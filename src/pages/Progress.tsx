import { useMemo, useState } from 'react';
import { BarChart3, Plus, Trophy, TrendingUp, Target, Save, Dumbbell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { ProgressEntry } from '../types';
import { formatDateJalali, toPersianNumber } from '../utils/jalali';

export default function Progress() {
  const { sessions, progress, activeProfile, addProgress } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ weight: 0, chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, shoulders: 0, notes: '' });

  const completedSessions = useMemo(() => sessions.filter(s => s.completed), [sessions]);
  const totalVolume = completedSessions.reduce((sum, s) => sum + s.totalVolume, 0);
  const avgVolume = completedSessions.length ? Math.round(totalVolume / completedSessions.length) : 0;
  const weightChange = progress.length >= 2 ? progress[progress.length - 1].weight - progress[0].weight : 0;

  const exercisePRs = useMemo(() => {
    const map = new Map<string, { weight: number; reps: number; volume: number; date: string }>();
    completedSessions.forEach(session => session.sets.filter(s => s.completed).forEach(set => {
      const volume = set.weight * set.actualReps;
      const current = map.get(set.exerciseName);
      if (!current || set.weight > current.weight || (set.weight === current.weight && set.actualReps > current.reps)) {
        map.set(set.exerciseName, { weight: set.weight, reps: set.actualReps, volume, date: session.date });
      }
    }));
    return Array.from(map.entries()).sort((a, b) => b[1].weight - a[1].weight);
  }, [completedSessions]);

  const volumeData = completedSessions.slice(-12).map(s => ({ date: formatDateJalali(s.date), volume: Math.round(s.totalVolume) }));

  const save = () => {
    if (!activeProfile) return;
    const entry: ProgressEntry = { id: uuidv4(), profileId: activeProfile.id, date: new Date().toISOString(), weight: form.weight, measurements: { chest: form.chest || undefined, waist: form.waist || undefined, hips: form.hips || undefined, arms: form.arms || undefined, thighs: form.thighs || undefined, calves: form.calves || undefined, shoulders: form.shoulders || undefined }, notes: form.notes };
    addProgress(entry);
    setShowForm(false);
    setForm({ weight: 0, chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, shoulders: 0, notes: '' });
  };

  const card = isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15';
  return <div className="space-y-5">
    <div className="flex items-center justify-between"><h2 className="text-xl font-bold flex items-center gap-2"><Trophy size={22} className="text-[#14b8a6]" /> پیشرفت و عملکرد</h2><button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-2 rounded-xl font-bold text-sm bg-[#14b8a6] text-black"><Plus size={16} /> ثبت اندازه‌گیری</button></div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[['جلسات کامل', completedSessions.length, 'text-[#4a90d9]'], ['میانگین حجم', `${avgVolume} kg`, 'text-green-500'], ['تغییر وزن', `${weightChange >= 0 ? '+' : ''}${weightChange.toFixed(1)} kg`, weightChange >= 0 ? 'text-amber-500' : 'text-blue-500'], ['رکوردها', exercisePRs.length, 'text-[#14b8a6]']].map(([label, value, color]) => <div key={String(label)} className={`rounded-xl p-4 border ${card}`}><p className="text-gray-400 text-xs mb-1">{label}</p><p className={`text-2xl font-black ${color}`}>{toPersianNumber(String(value))}</p></div>)}
    </div>

    {showForm && <div className={`rounded-2xl p-5 border ${card}`}><h3 className="font-bold text-[#14b8a6] mb-4">ثبت اندازه‌گیری جدید</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{([['weight','وزن','kg'],['chest','سینه','cm'],['waist','کمر','cm'],['hips','باسن','cm'],['arms','بازو','cm'],['thighs','ران','cm'],['calves','ساق','cm'],['shoulders','شانه','cm']] as const).map(([key,label,unit]) => <label key={key} className="text-xs text-gray-400">{label} ({unit})<input type="number" value={form[key] || ''} onChange={e => setForm({ ...form, [key]: Number(e.target.value) })} className={`mt-1 w-full rounded-lg px-3 py-2 ${isDark ? 'bg-[#0d0d1a] text-white' : 'bg-gray-50 border text-gray-900'}`} /></label>)}</div><input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="یادداشت اختیاری" className={`mt-3 w-full rounded-lg px-3 py-2 ${isDark ? 'bg-[#0d0d1a] text-white' : 'bg-gray-50 border'}`} /><button onClick={save} className="mt-4 px-4 py-2 rounded-xl font-bold bg-green-500 text-white flex items-center gap-2"><Save size={16} /> ذخیره</button></div>}

    {volumeData.length > 0 && <div className={`rounded-2xl p-5 border ${card}`}><h3 className="font-bold text-[#14b8a6] mb-4 flex items-center gap-2"><TrendingUp size={18} /> روند حجم تمرین</h3><ResponsiveContainer width="100%" height={250}><LineChart data={volumeData}><CartesianGrid strokeDasharray="3 3" stroke="#333" /><XAxis dataKey="date" stroke="#888" fontSize={10} /><YAxis stroke="#888" fontSize={10} /><Tooltip contentStyle={{ background: isDark ? '#1a1a2e' : '#fff', border: '1px solid #14b8a6', borderRadius: 8 }} /><Line type="monotone" dataKey="volume" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div>}

    <div className={`rounded-2xl p-5 border ${card}`}><h3 className="font-bold text-[#14b8a6] mb-4 flex items-center gap-2"><Dumbbell size={18} /> رکوردهای حرکات (PR)</h3>{exercisePRs.length === 0 ? <p className="text-sm text-gray-500 text-center py-6">پس از ثبت ست‌های دارای وزنه، رکوردهای شما اینجا نمایش داده می‌شوند.</p> : <div className="space-y-2">{exercisePRs.map(([name, pr]) => <div key={name} className={`rounded-xl p-3 flex items-center justify-between ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}><div><p className="font-bold text-sm">{name}</p><p className="text-xs text-gray-500">{formatDateJalali(pr.date)}</p></div><div className="text-left"><p className="font-black text-[#14b8a6]">{toPersianNumber(String(pr.weight))} kg × {toPersianNumber(String(pr.reps))}</p><p className="text-xs text-gray-500">حجم ست: {toPersianNumber(String(Math.round(pr.volume)))} kg</p></div></div>)}</div>}</div>

    <div className={`rounded-2xl p-5 border ${card}`}><h3 className="font-bold text-[#14b8a6] mb-4 flex items-center gap-2"><BarChart3 size={18} /> تاریخچه اندازه‌گیری</h3>{progress.length === 0 ? <p className="text-sm text-gray-500 text-center py-6">هنوز اندازه‌گیری ثبت نشده است.</p> : <div className="space-y-2">{progress.slice().reverse().map(entry => <div key={entry.id} className={`rounded-xl p-4 ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}><div className="flex justify-between"><span className="font-bold">{formatDateJalali(entry.date)}</span><span className="font-bold text-[#14b8a6]">{toPersianNumber(String(entry.weight))} kg</span></div>{entry.measurements && <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">{Object.entries(entry.measurements).filter(([,v]) => v).map(([k,v]) => <span key={k}>{k}: {toPersianNumber(String(v))}</span>)}</div>}</div>)}</div>}</div>
  </div>;
}
