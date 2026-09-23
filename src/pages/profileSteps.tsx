import { useState } from 'react';
import { AthleteProfile, GOAL_LABELS, EXPERIENCE_LABELS, EQUIPMENT_OPTIONS, MUSCLE_GROUPS, PROGRAM_TYPES, ACTIVITY_LEVELS, EQUIPMENT_TYPES, DIET_TYPES, IRANIAN_FOODS, SUPPLEMENT_CATEGORIES } from '../types';
import { Plus, X, Apple, Pill, Dumbbell } from 'lucide-react';

export function StepBasic({ form, setForm, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#d4af37]' : 'text-[#0d9488]')}>اطلاعات پایه</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="نام" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} isDark={isDark} />
        <NumberField label="سن" value={form.age} onChange={(v: number) => setForm({ ...form, age: v })} suffix="سال" isDark={isDark} />
        <SelectField label="جنسیت" value={form.gender} onChange={(v: string) => setForm({ ...form, gender: v })} options={[{ value: 'male', label: 'مرد' }, { value: 'female', label: 'زن' }]} isDark={isDark} />
        <NumberField label="قد" value={form.height} onChange={(v: number) => setForm({ ...form, height: v })} suffix="سانتی‌متر" isDark={isDark} />
        <NumberField label="وزن فعلی" value={form.weight} onChange={(v: number) => setForm({ ...form, weight: v })} suffix="کیلوگرم" isDark={isDark} />
        <NumberField label="وزن هدف" value={form.targetWeight} onChange={(v: number) => setForm({ ...form, targetWeight: v })} suffix="کیلوگرم" isDark={isDark} />
        <SelectField label="سطح فعالیت" value={form.activityLevel} onChange={(v: string) => setForm({ ...form, activityLevel: v })} options={Object.entries(ACTIVITY_LEVELS).map(([value, label]) => ({ value, label }))} isDark={isDark} />
        <SelectField label="سطح تجربه" value={form.experience} onChange={(v: string) => setForm({ ...form, experience: v })} options={Object.entries(EXPERIENCE_LABELS).map(([value, label]) => ({ value, label }))} isDark={isDark} />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>آسیب‌دیدگی‌ها (با ویرگول جدا کنید)</label>
        <textarea value={(form.injuries || []).join('، ')} onChange={e => setForm({ ...form, injuries: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: آسیب زانو راست، درد شانه چپ..." />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>محدودیت‌های حرکتی / پزشکی (با ویرگول جدا کنید)</label>
        <textarea value={(form.limitations || []).join('، ')} onChange={e => setForm({ ...form, limitations: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: عدم اسکات عمیق، محدودیت دامنه حرکت شانه..." />
      </div>
    </div>
  );
}

export function StepTraining({ form, setForm, toggleEquipment, isDark }: any) {
  return <div className={'p-4 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>در حال بارگذاری اطلاعات تمرینی...</div>;
}
export function StepNutrition({ form, setForm, toggleFood, isDark }: any) {
  return <div className={'p-4 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e']/70')}>در حال بارگذاری اطلاعات تغذیه...</div>;
}
export function StepSupplements({ form, setForm, toggleSupplement, isDark }: any) {
  return <div className={'p-4 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e']/70')}>در حال بارگذاری مکمل‌ها...</div>;
}
export function StepGoals({ form, setForm, toggleTargetMuscle, isDark }: any) {
  return <div className={'p-4 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e']/70')}>در حال بارگذاری اهداف...</div>;
}

function InputField({ label, value, onChange, isDark, placeholder }: { label: string; value: string; onChange: (v: string) => void; isDark: boolean; placeholder?: string }) {
  return (
    <div>
      <label className={'text-sm mb-1 block ' + (isDark ? 'text-gray-400' : 'text-[#0f766e']/70')}>{label}</label>
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} />
    </div>
  );
}

function NumberField({ label, value, onChange, suffix, isDark }: { label: string; value: number; onChange: (v: number) => void; suffix?: string; isDark: boolean }) {
  return (
    <div>
      <label className={'text-sm mb-1 block ' + (isDark ? 'text-gray-400' : 'text-[#0f766e']/70')}>{label}{suffix ? ' (' + suffix + ')' : ''}</label>
      <input type="number" value={value || ''} onChange={e => onChange(Number(e.target.value))} className={'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} />
    </div>
  );
}

function SelectField({ label, value, onChange, options, isDark }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; isDark: boolean }) {
  return (
    <div>
      <label className={'text-sm mb-1 block ' + (isDark ? 'text-gray-400' : 'text-[#0f766e']/70')}>{label}</label>
      <select value={value || ''} onChange={e => onChange(e.target.value)} className={'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')}>
        {options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
      </select>
    </div>
  );
}

function GoalInput({ label, value, onChange, isDark, placeholder }: { label: string; value: string; onChange: (v: string) => void; isDark: boolean; placeholder?: string }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = Object.values(GOAL_LABELS);
  const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes((value || '').toLowerCase()) && s !== value);
  return (
    <div className="relative">
      <label className={'text-sm mb-1 block ' + (isDark ? 'text-gray-400' : 'text-[#0f766e']/70')}>{label}</label>
      <input type="text" value={value || ''} onChange={e => { onChange(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} placeholder={placeholder} className={'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className={'absolute z-10 w-full mt-1 rounded-xl border shadow-lg max-h-48 overflow-y-auto theme-transition ' + (isDark ? 'bg-[#1a1a2e] border-gray-700' : 'bg-white border-[#14b8a6]/30')}>
          {filteredSuggestions.map((suggestion, idx) => (
            <button key={idx} type="button" onMouseDown={e => e.preventDefault()} onClick={() => { onChange(suggestion); setShowSuggestions(false); }} className={'w-full text-right px-4 py-2 text-sm transition-all ' + (isDark ? 'text-gray-300 hover:bg-[#d4af37]/10 hover:text-[#d4af37]' : 'text-[#134e4a] hover:bg-[#14b8a6]/10 hover:text-[#0d9488]')}>
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <p className={'text-xs mt-1 ' + (isDark ? 'text-gray-500' : 'text-[#0f766e']/50')}>می‌توانید هدف دلخواه خود را تایپ کنید یا از پیشنهادات انتخاب کنید</p>
    </div>
  );
}
