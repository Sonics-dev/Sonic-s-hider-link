
import React, { useState } from 'react';
import { ChevronLeft, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface LinkService {
  name: string;
  url: string;
  desc: string;
  badge?: string;
  priority?: boolean;
}

const services: LinkService[] = [
  { name: 'is.gd', url: 'https://is.gd', desc: 'Fastest shortener in the galaxy.', badge: 'FASTEST ZONE', priority: true },
  { name: 'TinyURL', url: 'https://tinyurl.com', desc: 'The classic speedster.' },
  { name: 'Bit.ly', url: 'https://bit.ly', desc: 'Professional velocity.' },
  { name: 'Rebrand.ly', url: 'https://rebrand.ly', desc: 'Custom branding speed.' },
  { name: 'Cutt.ly', url: 'https://cutt.ly', desc: 'The analytics sprint.' },
  { name: 'click.ly', url: 'https://click.ly', desc: 'Direct engagement dash.' },
];

const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<LinkService | null>(null);
  const [mode, setMode] = useState<'shorten' | 'unshorten'>('shorten');

  const handleServiceClick = (service: LinkService) => {
    setSelectedService(service);
  };

  if (selectedService) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
        {/* Header Navigation */}
        <div className="w-full max-w-lg mt-8 px-4">
          <button 
            onClick={() => setSelectedService(null)}
            className="flex items-center space-x-2 bg-[#111] border border-zinc-800 px-6 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors w-full justify-center"
          >
            <ChevronLeft size={16} />
            <span>Back to Services</span>
          </button>
        </div>

        {/* Plexus Hero Section */}
        <div className="w-full plexus-bg py-12 flex flex-col items-center border-b border-zinc-900/50">
          <h1 className="text-6xl font-black italic text-white sonic-glow tracking-tighter">
            {selectedService.name}
          </h1>
        </div>

        {/* Main Interface */}
        <div className="w-full max-w-lg p-6 space-y-6">
          {/* Toggle Switch */}
          <div className="flex bg-[#0a0a0a] rounded-xl border border-zinc-900 overflow-hidden h-14">
            <button 
              onClick={() => setMode('shorten')}
              className={`flex-1 font-bold text-sm transition-all ${mode === 'shorten' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Shorten URL
            </button>
            <button 
              onClick={() => setMode('unshorten')}
              className={`flex-1 font-bold text-sm transition-all ${mode === 'unshorten' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Unshorten URL
            </button>
          </div>

          {/* Service Panel */}
          <div className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-6 space-y-6 shadow-2xl">
            {/* Select Link Type */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Select Link Type</label>
              <select className="w-full input-themed rounded-xl px-4 py-4 text-sm appearance-none cursor-pointer">
                <option>Private Server</option>
                <option>Public Link</option>
                <option>Alias Link</option>
              </select>
            </div>

            {/* Discord Button */}
            <button className="w-full bg-[#00eeff] text-black font-black py-4 rounded-xl flex items-center justify-center space-x-3 cyan-glow-button">
              <MessageCircle size={20} fill="black" />
              <span>Join Discord Community</span>
            </button>

            {/* URL Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Enter Your Link</label>
              <input 
                type="text" 
                placeholder="https://www.roblox.com/users/123/profile"
                className="w-full input-themed rounded-xl px-4 py-4 text-sm text-zinc-300 placeholder-zinc-700"
              />
            </div>

            {/* Custom Slug */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Custom Slug (Optional)</label>
              <input 
                type="text" 
                placeholder="your-custom-slug"
                className="w-full input-themed rounded-xl px-4 py-4 text-sm text-zinc-300 placeholder-zinc-700"
              />
            </div>

            {/* Action Button */}
            <button className="w-full bg-[#00eeff] text-black font-black py-5 rounded-xl text-lg cyan-glow-button mt-4">
              Generate Shortened Link
            </button>
          </div>

          <p className="text-center text-[10px] text-zinc-600 uppercase font-bold tracking-[0.2em] pt-4">
            Sonic's Nexus • Verified Security <ShieldCheck size={10} className="inline ml-1" />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative animate-in zoom-in duration-700">
      <header className="text-center mb-16">
        <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter sonic-glow text-[#00eeff] mb-2 uppercase">
          Sonic’s Nexus
        </h1>
        <p className="text-[#00eeff] font-bold tracking-[0.3em] text-xs sm:text-sm uppercase opacity-80">
          Hyperlink Speed Zone
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {services.map((service, idx) => (
          <div
            key={idx}
            onClick={() => handleServiceClick(service)}
            className={`cursor-pointer group relative card-shine bg-zinc-900/50 backdrop-blur-md p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:-rotate-1 flex flex-col justify-between h-48 ${
              service.priority 
              ? 'border-[#fff200] shadow-[0_0_20px_rgba(255,242,0,0.3)]' 
              : 'border-[#00eeff]/20 border-dashed hover:border-[#00eeff] hover:shadow-[0_0_20px_rgba(0,238,255,0.2)]'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-2xl font-black italic uppercase ${service.priority ? 'text-[#fff200]' : 'text-white'}`}>
                  {service.name}
                </span>
                {service.badge && (
                  <span className="bg-[#fff200] text-black text-[10px] font-black px-2 py-0.5 rounded italic">
                    {service.badge}
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-sm leading-tight group-hover:text-zinc-200 transition-colors">
                {service.desc}
              </p>
            </div>
            
            <div className="flex items-center text-[10px] font-bold tracking-widest text-[#00eeff] uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
              Enter Zone <ExternalLink size={10} className="ml-2" />
            </div>
            
            <div className={`absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-300 group-hover:w-full ${service.priority ? 'w-16 opacity-100' : 'w-0 opacity-0'}`}></div>
          </div>
        ))}
      </div>

      <footer className="mt-20 text-zinc-700 text-[10px] tracking-widest uppercase font-bold flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border border-zinc-900 flex items-center justify-center mb-4">
           <div className="w-2 h-2 bg-[#00eeff] rounded-full animate-ping"></div>
        </div>
        © {new Date().getFullYear()} SONIC'S NEXUS HUB
      </footer>
    </div>
  );
};

export default App;
