import { useAppContext } from '../context/AppContext';
import { getPersianDate, toPersianNumber } from '../utils/jalali';
import { GOAL_LABELS, EXPERIENCE_LABELS } from '../types';
import { 
  Dumbbell, TrendingUp, Calendar, Target, 
  Flame, Award, Activity, Clock 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const { state } = useAppContext();
  const { profile, sessions, programs, progress } = state;

  const totalSessions = sessions.filter(s => s.completed).length;
  const totalVolume = sessions.reduce((acc, s) => acc + s.totalVolume, 0);
  const currentStreak = calculateStreak(sessions);
  const activeProgram = programs.find(p => p.id === state.activeProgram);

  const weightData = progress
    .slice(-10)
    .map(p => ({
      date: p.date.split('-').slice(1).join('/'),
      weight: p.weight,
    }));

  const sessionData = getLast7DaysSessions(sessions);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-l from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 border border-[#d4af37]/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {profile ? `سلام ${profile.name} 👋` : 'خوش آمدید 👋'}
            </h2>
            <p className="text-gray-400 text-sm">{getPersianDate()}</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f0d060] flex items-center justify-center">
            <Dumbbell size={28} className="text-[#0d0d1a]" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Activity size={20} />}
          label="جلسات انجام شده"
          value={toPersianNumber(totalSessions)}
          color="text-[#4a90d9]"
          bgColor="bg-[#4a90d9]/10"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="حجم کل (کیلوگرم)"
          value={toPersianNumber(totalVolume.toLocaleString())}
          color="text-[#22c55e]"
          bgColor="bg-[#22c55e]/10"
        />
        <StatCard
          icon={<Flame size={20} />}
          label="روزهای متوالی"
          value={toPersianNumber(currentStreak)}
          color="text-[#f59e0b]"
          bgColor="bg-[#f59e0b]/10"
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="برنامه‌های فعال"
          value={toPersianNumber(programs.length)}
          color="text-[#d4af37]"
          bgColor="bg-[#d4af37]/10"
        />
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
          <h3 className="text-[#d4af37] font-bold mb-4 flex items-center gap-2">
            <Target size={18} />
            خلاصه پروفایل
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoItem label="هدف اصلی" value={GOAL_LABELS[profile.primaryGoal]} />
            <InfoItem label="سطح تجربه" value={EXPERIENCE_LABELS[profile.experience]} />
            <InfoItem label="روزهای تمرین" value={`${toPersianNumber(profile.trainingDays)} روز/هفته`} />
            <InfoItem label="مدت جلسه" value={`${toPersianNumber(profile.sessionDuration)} دقیقه`} />
          </div>
        </div>
      )}

      {/* Active Program */}
      {activeProgram && (
        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#22c55e]/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#22c55e] font-bold flex items-center gap-2">
              <Award size={18} />
              برنامه فعال
            </h3>
            <span className="text-xs bg-[#22c55e]/20 text-[#22c55e] px-2 py-1 rounded-full">فعال</span>
          </div>
          <p className="text-white font-medium">{activeProgram.name}</p>
          <p className="text-gray-400 text-sm mt-1">{activeProgram.duration} • {toPersianNumber(activeProgram.days.length)} روز تمرینی</p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weight Trend */}
        {weightData.length > 0 && (
          <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
            <h3 className="text-[#d4af37] font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              روند وزن
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ background: '#1a1a2e', border: '1px solid #d4af37', borderRadius: '8px' }}
                  labelStyle={{ color: '#d4af37' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#d4af37" strokeWidth={2} dot={{ fill: '#d4af37' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Weekly Sessions */}
        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
          <h3 className="text-[#d4af37] font-bold mb-4 flex items-center gap-2">
            <Clock size={18} />
            جلسات ۷ روز اخیر
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" fontSize={10} />
              <YAxis stroke="#888" fontSize={10} />
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #4a90d9', borderRadius: '8px' }}
                labelStyle={{ color: '#4a90d9' }}
              />
              <Bar dataKey="sessions" fill="#4a90d9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      {!profile && (
        <div className="bg-gradient-to-l from-[#d4af37]/10 to-transparent rounded-2xl p-5 border border-[#d4af37]/30">
          <p className="text-[#d4af37] font-medium">⚡ برای شروع، ابتدا پروفایل ورزشکار خود را تکمیل کنید</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor }: { icon: React.ReactNode; label: string; value: string; color: string; bgColor: string }) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#d4af37]/10">
      <div className={`w-9 h-9 rounded-lg ${bgColor} flex items-center justify-center ${color} mb-2`}>
        {icon}
      </div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="text-white text-sm font-medium">{value}</p>
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
