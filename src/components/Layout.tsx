import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Brain, Dumbbell, Calendar, 
  Import, Trophy, Menu, X 
} from 'lucide-react';
import { useState } from 'react';
import { toPersianNumber, getPersianDate } from '../utils/jalali';

const navItems = [
  { path: '/', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/profile', label: 'پروفایل', icon: User },
  { path: '/prompt', label: 'پرامپت', icon: Brain },
  { path: '/import', label: 'برنامه', icon: Import },
  { path: '/workout', label: 'تمرین', icon: Dumbbell },
  { path: '/calendar', label: 'تقویم', icon: Calendar },
  { path: '/progress', label: 'پیشرفت', icon: Trophy },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a15] via-[#0d0d1a] to-[#0a0a15] flex flex-col">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-l from-[#1a1a2e]/95 to-[#16213e]/95 backdrop-blur-lg border-b border-[#d4af37]/20 shadow-lg shadow-black/20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-[#d4af37] p-2 hover:bg-[#d4af37]/10 rounded-lg transition-all"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#f0d060] flex items-center justify-center shadow-lg shadow-[#d4af37]/30">
                  <Dumbbell size={20} className="text-[#0d0d1a]" />
                </div>
                <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#1a1a2e]" />
              </div>
              <div>
                <h1 className="text-[#d4af37] font-bold text-base sm:text-lg leading-tight">دستیار هوشمند بدنسازی</h1>
                <p className="text-gray-500 text-[10px] sm:text-xs">{getPersianDate()}</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-[#0d0d1a]/50 px-3 py-1.5 rounded-full border border-[#d4af37]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs text-gray-400">نسخه {toPersianNumber('1.0')}</span>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-[68px] flex-shrink-0" />

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-60 bg-[#1a1a2e]/50 backdrop-blur-sm border-l border-[#d4af37]/10 p-4 gap-1 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto">
          <div className="mb-4 px-3">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">منوی اصلی</p>
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all relative ${
                  isActive 
                    ? 'bg-gradient-to-l from-[#d4af37]/20 via-[#d4af37]/10 to-transparent text-[#d4af37] font-bold' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#d4af37] rounded-l-full" />
                )}
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-[#d4af37]/20' : 'group-hover:bg-white/5'}`}>
                  <Icon size={18} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="mt-auto pt-4 border-t border-[#d4af37]/10">
            <div className="bg-gradient-to-l from-[#d4af37]/10 to-transparent rounded-xl p-3">
              <p className="text-[#d4af37] text-xs font-bold mb-1">💡 نکته</p>
              <p className="text-gray-400 text-[11px] leading-5">
                برای شروع، پروفایل خود را تکمیل کنید
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
            <aside 
              className="w-72 h-full bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] p-5 flex flex-col gap-1 shadow-2xl" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#d4af37]/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#f0d060] flex items-center justify-center shadow-lg shadow-[#d4af37]/30">
                  <Dumbbell size={24} className="text-[#0d0d1a]" />
                </div>
                <div>
                  <span className="text-[#d4af37] font-bold text-lg block">AI Fitness</span>
                  <span className="text-gray-500 text-xs">Coach Assistant</span>
                </div>
              </div>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMenuOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all ${
                      isActive 
                        ? 'bg-gradient-to-l from-[#d4af37]/20 to-transparent text-[#d4af37] font-bold' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 overflow-auto pb-24 lg:pb-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0d0d1a] via-[#1a1a2e]/98 to-[#1a1a2e]/95 backdrop-blur-lg border-t border-[#d4af37]/20 shadow-2xl shadow-black/50">
        <div className="flex justify-around items-center py-2 px-1">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'text-[#d4af37]' 
                    : 'text-gray-500 active:scale-95'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-2 w-8 h-1 bg-[#d4af37] rounded-b-full" />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
