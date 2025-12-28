
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { TranscriptionItem } from '../types';
import { decode, encode, decodeAudioData, createPcmBlob } from '../utils/audio';

const LiveSection: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const transcriptRef = useRef({ input: '', output: '' });
  const transcriptionListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcription
  useEffect(() => {
    if (transcriptionListRef.current) {
      transcriptionListRef.current.scrollTop = transcriptionListRef.current.scrollHeight;
    }
  }, [transcriptions]);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsActive(false);
    setStatus('idle');
  }, []);

  const startSession = async () => {
    try {
      setStatus('connecting');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('connected');
            setIsActive(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              transcriptRef.current.output += message.serverContent.outputTranscription.text;
              setTranscriptions(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'model') {
                  return [...prev.slice(0, -1), { ...last, text: transcriptRef.current.output }];
                }
                return [...prev, { id: Date.now().toString(), role: 'model', text: transcriptRef.current.output }];
              });
            } else if (message.serverContent?.inputTranscription) {
              transcriptRef.current.input += message.serverContent.inputTranscription.text;
              setTranscriptions(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'user') {
                  return [...prev.slice(0, -1), { ...last, text: transcriptRef.current.input }];
                }
                return [...prev, { id: Date.now().toString(), role: 'user', text: transcriptRef.current.input }];
              });
            }

            if (message.serverContent?.turnComplete) {
              transcriptRef.current.input = '';
              transcriptRef.current.output = '';
            }

            // Handle Audio
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live session error:', e);
            setStatus('error');
            stopSession();
          },
          onclose: () => {
            setStatus('idle');
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are a supportive, real-time AI companion. Keep your responses concise and conversational.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start live session:', err);
      setStatus('error');
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 space-y-6">
      <div className="max-w-4xl mx-auto w-full glass-panel rounded-3xl p-8 flex flex-col items-center text-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 shadow-2xl ${
          isActive ? 'gemini-gradient animate-pulse scale-110' : 'bg-slate-800'
        }`}>
          <span className="text-4xl">{isActive ? '🔊' : '🎙️'}</span>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Voice Connect</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Experience low-latency, real-time conversation with Gemini. Speak naturally and it will respond.
        </p>

        <div className="flex space-x-4 mb-8">
          {status === 'idle' || status === 'error' ? (
            <button
              onClick={startSession}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full shadow-lg shadow-indigo-900/30 transition-all active:scale-95"
            >
              Start Conversation
            </button>
          ) : (
            <button
              onClick={stopSession}
              disabled={status === 'connecting'}
              className="px-8 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white font-bold rounded-full shadow-lg shadow-red-900/30 transition-all active:scale-95"
            >
              {status === 'connecting' ? 'Connecting...' : 'End Session'}
            </button>
          )}
        </div>

        {status === 'error' && (
          <p className="text-red-400 text-sm mb-4">Error connecting. Check your mic permissions or API key.</p>
        )}
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 ml-2">Live Transcript</h3>
        <div 
          ref={transcriptionListRef}
          className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 overflow-y-auto space-y-4"
        >
          {transcriptions.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-600 italic">
              Transcription will appear as you speak...
            </div>
          ) : (
            transcriptions.map((t) => (
              <div key={t.id} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                  t.role === 'user' ? 'bg-slate-700 text-slate-200' : 'bg-indigo-900/40 border border-indigo-800 text-indigo-100'
                }`}>
                  <span className="font-bold mr-2 text-[10px] opacity-40 uppercase">
                    {t.role === 'user' ? 'You' : 'Gemini'}
                  </span>
                  {t.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSection;
