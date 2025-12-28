
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GeneratedImage } from '../types';

const ImageSection: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any
          }
        }
      });

      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setImages(prev => [{
          id: Date.now().toString(),
          url: imageUrl,
          prompt: prompt
        }, ...prev]);
        setPrompt('');
      }
    } catch (error) {
      console.error('Image Gen Error:', error);
      alert('Failed to generate image. Please check console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full p-4 md:p-8 flex flex-col space-y-8">
      <div className="max-w-4xl mx-auto w-full glass-panel rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <span>🎨</span>
          <span>Visual Imagination</span>
        </h2>
        
        <form onSubmit={generateImage} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with floating gardens, cinematic lighting, 8k resolution..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-slate-600"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-5 gap-2">
                {['1:1', '3:4', '4:3', '9:16', '16:9'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      aspectRatio === ratio 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="md:w-48 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all h-[52px] flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/20"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Generate</span>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-6xl mx-auto w-full flex-1">
        <h3 className="text-xl font-bold text-slate-300 mb-6 flex items-center space-x-2">
          <span>🖼️</span>
          <span>Gallery</span>
        </h3>
        
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Your generated masterpieces will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative glass-panel rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                <img src={img.url} alt={img.prompt} className="w-full h-auto object-cover aspect-square bg-slate-900" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-xs text-slate-200 line-clamp-3 italic">"{img.prompt}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSection;
