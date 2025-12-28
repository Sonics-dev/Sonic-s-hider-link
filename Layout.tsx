
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const navItems = [
    { id: AppView.CHAT, label: 'Intelligent Chat', icon: '💬' },
    { id: AppView.IMAGE, label: 'Creative Imaging', icon: '🎨' },
    { id: AppView.LIVE, label: 'Voice Connect', icon: '🎙️' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl gemini-gradient flex items-center justify-center text-white text-xl font-bold">
            G
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-slate-800 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-slate-300">Gemini 3 Pro Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gemini-gradient flex items-center justify-center text-white font-bold">G</div>
            <span className="font-bold text-white">Nexus</span>
          </div>
          <div className="flex space-x-4">
             {navItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setView(item.id)}
                  className={`text-xl ${currentView === item.id ? 'opacity-100' : 'opacity-40'}`}
                >
                  {item.icon}
                </button>
             ))}
          </div>
        </header>

        <div className="flex-1 overflow-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
