import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Brain, Dumbbell, Calendar, 
  Import, Trophy, Menu, X 
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/profile', label: 'پروفایل', icon: User },
  { path: '/prompt', label: 'تولید پرامپت', icon: Brain },
  { path: '/import', label: 'ورود برنامه', icon: Import },
  { path: '/workout', label: 'تمرین', icon: Dumbbell },
  { path: '/calendar', label: 'تقویم', icon: Calendar },
  { path: '/progress', label: 'پیشرفت', icon: Trophy },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a1a2e] border-b border-[#d4af37]/20 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-[#d4af37] p-1"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f0d060] flex items-center justify-center">
              <Dumbbell size={16} className="text-[#0d0d1a]" />
            </div>
            <h1 className="text-[#d4af37] font-bold text-lg hidden sm:block">دستیار هوشمند بدنسازی</h1>
            <h1 className="text-[#d4af37] font-bold text-lg sm:hidden">AI Fitness</h1>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          نسخه ۱.۰
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-56 bg-[#1a1a2e] border-l border-[#d4af37]/10 p-3 gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive 
                    ? 'bg-gradient-to-l from-[#d4af37]/20 to-transparent text-[#d4af37] border-r-2 border-[#d4af37]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMenuOpen(false)}>
            <aside className="w-64 h-full bg-[#1a1a2e] p-4 flex flex-col gap-1" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#d4af37]/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f0d060] flex items-center justify-center">
                  <Dumbbell size={20} className="text-[#0d0d1a]" />
                </div>
                <span className="text-[#d4af37] font-bold">AI Fitness Coach</span>
              </div>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMenuOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                      isActive 
                        ? 'bg-[#d4af37]/20 text-[#d4af37]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto pb-20 lg:pb-6">
          <div className="max-w-5xl mx-auto animate-slide-up">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-[#d4af37]/20 flex justify-around py-2 px-2 z-50">
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                isActive ? 'text-[#d4af37]' : 'text-gray-500'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
