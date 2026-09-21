import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getPersianDate, toPersianNumber, formatDateJalali } from '../utils/jalali';
import { GOAL_LABELS, EXPERIENCE_LABELS } from '../types';
import { 
  Dumbbell, TrendingUp, Calendar, Target, User,
  Flame, Award, Activity, Clock, Sparkles,
  CheckCircle2, Timer, Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const { state, activeProfile, sessions, programs, progress, profiles, setActiveProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const profile = activeProfile;

  const totalSessions = sessions.filter(s => s.completed).length;
  const totalVolume = sessions.reduce((acc, s) => acc + s.totalVolume, 0);
  const currentStreak = calculateStreak(sessions);
  const activeProgram = programs.find(p => p.id === (useAppContext().state.activeProgram));

  // Get last completed session
  const lastSession = sessions
    .filter(s => s.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const weightData = progress
    .slice(-10)
    .map(p => ({
      date: p.date.split('-').slice(1).join('/'),
      weight: p.weight,
    }));

  const sessionData = getLast7DaysSessions(sessions);

  // Calculate session duration
  const getSessionDuration = (session: any) => {
    if (!session.startTime || !session.endTime) return null;
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${toPersianNumber(hours)} ساعت و ${toPersianNumber(mins)} دقیقه`;
    }
    return `${toPersianNumber(minutes)} دقیقه`;
  };

  return (
    <div className="space-y-6">
      {/* Profile Selector */}
      {profiles.length > 0 && (
        <div className={`rounded-2xl p-4 border shadow-lg theme-transition ${
          isDark 
            ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#d4af37]/20' 
            : 'bg-gradient-to-l from-white to-[#fef9e7] border-[#d4af37]/30'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User size={18} className={isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'} />
              <h3 className={`font-bold ${isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'}`}>
                انتخاب شاگرد
              </h3>
            </div>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {toPersianNumber(profiles.length)} پروفایل
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profiles.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProfile(p.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  p.id === profile?.id
                    ? 'bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a] shadow-lg shadow-[#d4af37]/30'
                    : isDark
                      ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700 hover:border-[#d4af37]'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-[#d4af37]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className={`relative rounded-3xl p-6 lg:p-8 border shadow-2xl overflow-hidden theme-transition ${
        isDark 
          ? 'bg-gradient-to-l from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border-[#d4af37]/20' 
          : 'bg-gradient-to-l from-white via-[#fef9e7] to-white border-[#d4af37]/30'
      }`}>
        {/* Decorative Elements */}
        <div className={`absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl ${
          isDark ? 'bg-[#d4af37]/10' : 'bg-[#d4af37]/5'
        }`} />
        <div className={`absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl ${
          isDark ? 'bg-[#4a90d9]/10' : 'bg-[#4a90d9]/5'
        }`} />
        
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className={isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'} />
              <span className={`text-xs font-bold ${isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'}`}>
                خوش آمدید
              </span>
            </div>
            <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {profile ? `${profile.name} عزیز 👋` : 'به دستیار هوشمند خوش آمدید 👋'}
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {getPersianDate()}
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#f0d060] flex items-center justify-center shadow-2xl shadow-[#d4af37]/30 rotate-6 hover:rotate-0 transition-transform">
              <Dumbbell size={40} className="text-[#0d0d1a]" />
            </div>
          </div>
        </div>
      </div>

      {/* Last Session Card */}
      {lastSession && (
        <div className={`rounded-2xl p-5 border shadow-lg theme-transition ${
          isDark 
            ? 'bg-gradient-to-l from-[#22c55e]/5 to-transparent border-[#22c55e]/20' 
            : 'bg-gradient-to-l from-[#22c55e]/5 to-white border-[#22c55e]/30'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#22c55e]/20' : 'bg-[#22c55e]/10'
              }`}>
                <CheckCircle2 size={20} className="text-[#22c55e]" />
              </div>
              <div>
                <h3 className={`font-bold ${isDark ? 'text-[#22c55e]' : 'text-[#16a34a]'}`}>
                  آخرین جلسه تمرین
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatDateJalali(lastSession.date)}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#22c55e]/10 text-[#16a34a]'
            }`}>
              تکمیل شده ✓
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Timer size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>مدت زمان</span>
              </div>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {getSessionDuration(lastSession) || '-'}
              </p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>ست‌های انجام شده</span>
              </div>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {toPersianNumber(lastSession.sets.filter(s => s.completed).length)} ست
              </p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>حجم کل</span>
              </div>
              <p className={`font-bold text-sm ${isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'}`}>
                {toPersianNumber(lastSession.totalVolume)} kg
              </p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>تعداد تمرینات</span>
              </div>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {toPersianNumber(new Set(lastSession.sets.map(s => s.exerciseId)).size)} تمرین
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={<Activity size={20} />}
          label="جلسات انجام شده"
          value={toPersianNumber(totalSessions)}
          color="text-[#4a90d9]"
          bgColor={isDark ? "bg-[#4a90d9]/10" : "bg-[#4a90d9]/5"}
          borderColor={isDark ? "border-[#4a90d9]/20" : "border-[#4a90d9]/30"}
          isDark={isDark}
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="حجم کل (کیلوگرم)"
          value={toPersianNumber(totalVolume.toLocaleString())}
          color="text-[#22c55e]"
          bgColor={isDark ? "bg-[#22c55e]/10" : "bg-[#22c55e]/5"}
          borderColor={isDark ? "border-[#22c55e]/20" : "border-[#22c55e]/30"}
          isDark={isDark}
        />
        <StatCard
          icon={<Flame size={20} />}
          label="روزهای متوالی"
          value={toPersianNumber(currentStreak)}
          color="text-[#f59e0b]"
          bgColor={isDark ? "bg-[#f59e0b]/10" : "bg-[#f59e0b]/5"}
          borderColor={isDark ? "border-[#f59e0b]/20" : "border-[#f59e0b]/30"}
          isDark={isDark}
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="برنامه‌های فعال"
          value={toPersianNumber(programs.length)}
          color="text-[#d4af37]"
          bgColor={isDark ? "bg-[#d4af37]/10" : "bg-[#d4af37]/5"}
          borderColor={isDark ? "border-[#d4af37]/20" : "border-[#d4af37]/30"}
          isDark={isDark}
        />
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className={`rounded-2xl p-6 border shadow-lg theme-transition ${
          isDark 
            ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#d4af37]/10' 
            : 'bg-gradient-to-l from-white to-[#fef9e7] border-[#d4af37]/20'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className={isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'} />
            <h3 className={`font-bold ${isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'}`}>
              خلاصه پروفایل
            </h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoItem label="هدف اصلی" value={GOAL_LABELS[profile.primaryGoal]} isDark={isDark} />
            <InfoItem label="سطح تجربه" value={EXPERIENCE_LABELS[profile.experience]} isDark={isDark} />
            <InfoItem label="روزهای تمرین" value={`${toPersianNumber(profile.trainingDays)} روز/هفته`} isDark={isDark} />
            <InfoItem label="مدت جلسه" value={`${toPersianNumber(profile.sessionDuration)} دقیقه`} isDark={isDark} />
          </div>
        </div>
      )}

      {/* Active Program */}
      {activeProgram && (
        <div className={`rounded-2xl p-6 border shadow-lg theme-transition ${
          isDark 
            ? 'bg-gradient-to-l from-[#22c55e]/5 to-transparent border-[#22c55e]/20' 
            : 'bg-gradient-to-l from-[#22c55e]/5 to-white border-[#22c55e]/30'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[#22c55e]" />
              <h3 className={`font-bold ${isDark ? 'text-[#22c55e]' : 'text-[#16a34a]'}`}>
                برنامه فعال
              </h3>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
              isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#22c55e]/10 text-[#16a34a]'
            }`}>
              فعال
            </span>
          </div>
          <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {activeProgram.name}
          </p>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {activeProgram.duration} • {toPersianNumber(activeProgram.days.length)} روز تمرینی
          </p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weight Trend */}
        {weightData.length > 0 && (
          <div className={`rounded-2xl p-5 border shadow-lg theme-transition ${
            isDark 
              ? 'bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border-[#d4af37]/10' 
              : 'bg-gradient-to-b from-white to-[#fef9e7] border-[#d4af37]/20'
          }`}>
            <h3 className={`font-bold mb-4 flex items-center gap-2 ${
              isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'
            }`}>
              <TrendingUp size={18} />
              روند وزن
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#e5e7eb"} />
                <XAxis dataKey="date" stroke={isDark ? "#888" : "#6b7280"} fontSize={10} />
                <YAxis stroke={isDark ? "#888" : "#6b7280"} fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ 
                    background: isDark ? '#1a1a2e' : '#ffffff', 
                    border: `1px solid ${isDark ? '#d4af37' : '#b8941f'}`, 
                    borderRadius: '12px',
                    color: isDark ? '#e2e8f0' : '#1e293b'
                  }}
                  labelStyle={{ color: isDark ? '#d4af37' : '#b8941f' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#d4af37" strokeWidth={2} dot={{ fill: '#d4af37' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Weekly Sessions */}
        <div className={`rounded-2xl p-5 border shadow-lg theme-transition ${
          isDark 
            ? 'bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border-[#d4af37]/10' 
            : 'bg-gradient-to-b from-white to-[#fef9e7] border-[#d4af37]/20'
        }`}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${
            isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'
          }`}>
            <Clock size={18} />
            جلسات ۷ روز اخیر
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#e5e7eb"} />
              <XAxis dataKey="day" stroke={isDark ? "#888" : "#6b7280"} fontSize={10} />
              <YAxis stroke={isDark ? "#888" : "#6b7280"} fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  background: isDark ? '#1a1a2e' : '#ffffff', 
                  border: `1px solid ${isDark ? '#4a90d9' : '#3b82f6'}`, 
                  borderRadius: '12px',
                  color: isDark ? '#e2e8f0' : '#1e293b'
                }}
                labelStyle={{ color: isDark ? '#4a90d9' : '#3b82f6' }}
              />
              <Bar dataKey="sessions" fill="#4a90d9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      {!profile && (
        <div className={`rounded-2xl p-6 border shadow-lg theme-transition ${
          isDark 
            ? 'bg-gradient-to-l from-[#d4af37]/10 to-transparent border-[#d4af37]/30' 
            : 'bg-gradient-to-l from-[#d4af37]/10 to-white border-[#d4af37]/30'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-[#d4af37]/20' : 'bg-[#d4af37]/10'
            }`}>
              <Sparkles size={20} className={isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'} />
            </div>
            <div>
              <p className={`font-bold ${isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'}`}>
                ⚡ شروع کنید
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                برای شروع، ابتدا پروفایل ورزشکار خود را تکمیل کنید
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor, borderColor, isDark }: { 
  icon: React.ReactNode; label: string; value: string; color: string; bgColor: string; borderColor: string; isDark: boolean;
}) {
  return (
    <div className={`rounded-2xl p-4 border shadow-lg hover:scale-[1.02] transition-transform theme-transition ${
      isDark 
        ? `bg-gradient-to-b from-[#1a1a2e] to-[#16213e] ${borderColor}` 
        : `bg-gradient-to-b from-white to-[#fef9e7] ${borderColor}`
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3 ${bgColor}`}>
        {icon}
      </div>
      <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function InfoItem({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div className={`rounded-xl p-3 theme-transition ${
      isDark ? 'bg-[#0d0d1a]' : 'bg-white'
    }`}>
      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{label}</p>
      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function calculateStreak(sessions: any[]): number {
  if (sessions.length === 0) return 0;
  const completedDates = sessions
    .filter(s => s.completed)
    .map(s => new Date(s.date).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  if (completedDates.length === 0) return 0;
  
  let streak = 1;
  for (let i = 1; i < completedDates.length; i++) {
    const curr = new Date(completedDates[i - 1]);
    const prev = new Date(completedDates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 1) streak++;
    else break;
  }
  return streak;
}

function getLast7DaysSessions(sessions: any[]): { day: string; sessions: number }[] {
  const days = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const result: { day: string; sessions: number }[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toDateString();
    const count = sessions.filter(s => new Date(s.date).toDateString() === dayStr).length;
    const dayOfWeek = (date.getDay() + 1) % 7;
    result.push({ day: days[dayOfWeek], sessions: count });
  }
  
  return result;
}
