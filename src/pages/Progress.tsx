import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ProgressEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Trophy, Plus, TrendingUp, BarChart3, Target, Save } from 'lucide-react';
import { toPersianNumber, formatDateJalali } from '../utils/jalali';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function Progress() {
  const { state, activeProfile, addProgress } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    weight: 0,
    chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, shoulders: 0,
    notes: '',
  });

  const handleSave = () => {
    const entry: ProgressEntry = {
      id: uuidv4(),
      profileId: activeProfile!.id,
      date: new Date().toISOString(),
      weight: form.weight,
      measurements: {
        chest: form.chest || undefined,
        waist: form.waist || undefined,
        hips: form.hips || undefined,
        arms: form.arms || undefined,
        thighs: form.thighs || undefined,
        calves: form.calves || undefined,
        shoulders: form.shoulders || undefined,
      },
      notes: form.notes,
    };
    addProgress(entry);
    setShowForm(false);
    setForm({ weight: 0, chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, shoulders: 0, notes: '' });
  };

  const weightData = state.progress
    .filter(p => p.weight > 0)
    .map(p => ({
      date: formatDateJalali(p.date),
      weight: p.weight,
    }));

  const latestMeasurements = state.progress
    .filter(p => p.measurements)
    .slice(-1)[0]?.measurements;

  const radarData = latestMeasurements ? [
    { subject: 'سینه', value: latestMeasurements.chest || 0 },
    { subject: 'کمر', value: latestMeasurements.waist || 0 },
    { subject: 'بازو', value: latestMeasurements.arms || 0 },
    { subject: 'ران', value: latestMeasurements.thighs || 0 },
    { subject: 'ساق', value: latestMeasurements.calves || 0 },
    { subject: 'شانه', value: latestMeasurements.shoulders || 0 },
  ] : [];

  // Calculate stats (only completed sessions)
  const completedSessions = state.sessions.filter(s => s.completed);
  const totalSessions = completedSessions.length;
  const avgVolume = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((acc, s) => acc + s.totalVolume, 0) / completedSessions.length)
    : 0;
  const weightChange = state.progress.length >= 2 
    ? state.progress[state.progress.length - 1].weight - state.progress[0].weight
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy size={22} className="text-[#d4af37]" />
          پیشرفت و آمار
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-[#d4af37] text-[#0d0d1a] px-3 py-2 rounded-xl font-bold text-sm"
        >
          <Plus size={16} />
          ثبت جدید
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#d4af37]/10">
          <p className="text-gray-400 text-xs mb-1">کل جلسات</p>
          <p className="text-2xl font-bold text-[#4a90d9]">{toPersianNumber(totalSessions)}</p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#d4af37]/10">
          <p className="text-gray-400 text-xs mb-1">میانگین حجم</p>
          <p className="text-2xl font-bold text-[#22c55e]">{toPersianNumber(avgVolume)}<span className="text-sm">kg</span></p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#d4af37]/10">
          <p className="text-gray-400 text-xs mb-1">تغییرات وزن</p>
          <p className={`text-2xl font-bold ${weightChange >= 0 ? 'text-[#f59e0b]' : 'text-[#4a90d9]'}`}>
            {weightChange >= 0 ? '+' : ''}{toPersianNumber(weightChange.toFixed(1))}
          </p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-[#d4af37]/10">
          <p className="text-gray-400 text-xs mb-1">ثبت‌های اندازه‌گیری</p>
          <p className="text-2xl font-bold text-[#d4af37]">{toPersianNumber(state.progress.length)}</p>
        </div>
      </div>

      {/* Add Progress Form */}
      {showForm && (
        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10 animate-slide-up">
          <h3 className="text-[#d4af37] font-bold mb-4">ثبت اندازه‌گیری جدید</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">وزن (kg)</label>
              <input
                type="number"
                value={form.weight || ''}
                onChange={e => setForm({ ...form, weight: Number(e.target.value) })}
                className="w-full bg-[#0d0d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">سینه (cm)</label>
              <input
                type="number"
                value={form.chest || ''}
                onChange={e => setForm({ ...form, chest: Number(e.target.value) })}
                className="w-full bg-[#0d0d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">کمر (cm)</label>
              <input
                type="number"
                value={form.waist || ''}
                onChange={e => setForm({ ...form, waist: Number(e.target.value) })}
                className="w-full bg-[#0d0d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">بازو (cm)</label>
              <input
                type="number"
                value={form.arms || ''}
                onChange={e => setForm({ ...form, arms: Number(e.target.value) })}
                className="w-full bg-[#0d0d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">ران (cm)</label>
              <input
                type="number"
                value={form.thighs || ''}
                onChange={e => setForm({ ...form, thighs: Number(e.target.value) })}
                className="w-full bg-[#0d0d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">ساق (cm)</label>
              <input
                type="number"
                value={form.calves || ''}
                onChange={e => setForm({ ...form, calves: Number(e.target.value) })}
                className="w-full bg-[#0d0d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">شانه (cm)</label>
              <input
                type="number"
                value={form.shoulders || ''}
                onChange={e => setForm({ ...form, shoulders: Number(e.target.value) })}
                className="w-full bg-[#0d0d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">باسن (cm)</label>
              <input
                type="number"
                value={form.hips || ''}
                onChange={e => setForm({ ...form, hips: Number(e.target.value) })}
                className="w-full bg-[#0d0d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-gray-400 text-xs mb-1 block">یادداشت</label>
            <input
              type="text"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-[#0d0d1a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#d4af37] focus:outline-none"
              placeholder="توضیحات اختیاری..."
            />
          </div>
          <button
            onClick={handleSave}
            className="mt-4 flex items-center gap-2 bg-[#22c55e] text-white px-4 py-2 rounded-xl font-bold text-sm"
          >
            <Save size={16} />
            ذخیره
          </button>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weight Chart */}
        {weightData.length > 0 && (
          <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
            <h3 className="text-[#d4af37] font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              روند وزن
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ background: '#1a1a2e', border: '1px solid #d4af37', borderRadius: '8px', direction: 'rtl' }}
                  labelStyle={{ color: '#d4af37' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#d4af37" strokeWidth={2} dot={{ fill: '#d4af37', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Body Radar */}
        {radarData.length > 0 && radarData.some(d => d.value > 0) && (
          <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
            <h3 className="text-[#d4af37] font-bold mb-4 flex items-center gap-2">
              <Target size={18} />
              اندازه‌گیری بدن
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" stroke="#888" fontSize={11} />
                <PolarRadiusAxis stroke="#555" fontSize={9} />
                <Radar name="اندازه" dataKey="value" stroke="#4a90d9" fill="#4a90d9" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Progress History */}
      <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
        <h3 className="text-[#d4af37] font-bold mb-4 flex items-center gap-2">
          <BarChart3 size={18} />
          تاریخچه اندازه‌گیری‌ها
        </h3>
        {state.progress.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">هنوز اندازه‌گیری ثبت نشده است</p>
        ) : (
          <div className="space-y-3">
            {state.progress.slice().reverse().map(entry => (
              <div key={entry.id} className="bg-[#0d0d1a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">{formatDateJalali(entry.date)}</span>
                  <span className="text-[#d4af37] font-bold">{toPersianNumber(entry.weight)} kg</span>
                </div>
                {entry.measurements && (
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    {entry.measurements.chest && <span>سینه: {toPersianNumber(entry.measurements.chest)}</span>}
                    {entry.measurements.waist && <span>کمر: {toPersianNumber(entry.measurements.waist)}</span>}
                    {entry.measurements.arms && <span>بازو: {toPersianNumber(entry.measurements.arms)}</span>}
                    {entry.measurements.thighs && <span>ران: {toPersianNumber(entry.measurements.thighs)}</span>}
                    {entry.measurements.shoulders && <span>شانه: {toPersianNumber(entry.measurements.shoulders)}</span>}
                  </div>
                )}
                {entry.notes && <p className="text-gray-500 text-xs mt-2">📝 {entry.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
