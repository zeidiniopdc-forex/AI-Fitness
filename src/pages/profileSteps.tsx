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
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>آسیب‌دیدگی‌ها (با ویرگول جدا کنید)</label>
        <textarea value={(form.injuries || []).join('، ')} onChange={e => setForm({ ...form, injuries: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: آسیب زانو راست، درد شانه چپ..." />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>محدودیت‌های حرکتی / پزشکی (با ویرگول جدا کنید)</label>
        <textarea value={(form.limitations || []).join('، ')} onChange={e => setForm({ ...form, limitations: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: عدم اسکات عمیق، محدودیت دامنه حرکت شانه..." />
      </div>
    </div>
  );
}

export function StepTraining({ form, setForm, toggleEquipment, isDark }: any) {
  const [customEquip, setCustomEquip] = useState('');
  const addCustomEquipment = () => {
    if (customEquip.trim()) {
      const current = form.customEquipment || [];
      setForm({ ...form, customEquipment: [...current, customEquip.trim()] });
      setCustomEquip('');
    }
  };
  return (
    <div className="space-y-4">
      <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#d4af37]' : 'text-[#0d9488]')}>اطلاعات تمرینی</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField label="روزهای تمرین در هفته" value={form.trainingDays} onChange={(v: number) => setForm({ ...form, trainingDays: v })} suffix="روز" isDark={isDark} />
        <NumberField label="مدت هر جلسه" value={form.sessionDuration} onChange={(v: number) => setForm({ ...form, sessionDuration: v })} suffix="دقیقه" isDark={isDark} />
        <SelectField label="محل تمرین" value={form.location} onChange={(v: string) => setForm({ ...form, location: v })} options={[{ value: 'gym', label: 'باشگاه' }, { value: 'home', label: 'خانه' }, { value: 'park', label: 'پارک' }, { value: 'both', label: 'هر دو' }]} isDark={isDark} />
        <SelectField label="نوع تجهیزات" value={form.equipmentType} onChange={(v: string) => setForm({ ...form, equipmentType: v })} options={Object.entries(EQUIPMENT_TYPES).map(([value, label]) => ({ value, label }))} isDark={isDark} />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>تجهیزات موجود</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map(item => (
            <button key={item} onClick={() => toggleEquipment(item)} className={'px-3 py-1.5 rounded-lg text-xs transition-all ' + ((form.equipment || []).includes(item) ? (isDark ? 'bg-[#d4af37] text-[#0d0d1a] font-bold' : 'bg-[#14b8a6] text-white font-bold') : (isDark ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700' : 'bg-[#f0fdfa] text-teal-700/70 border border-[#14b8a6]/30'))}>{item}</button>
          ))}
        </div>
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>اضافه کردن تجهیزات خاص</label>
        <div className="flex gap-2">
          <input type="text" value={customEquip} onChange={e => setCustomEquip(e.target.value)} placeholder="نام تجهیزات..." className={'flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} />
          <button onClick={addCustomEquipment} className={'px-4 py-2.5 rounded-xl font-bold text-sm transition-all ' + (isDark ? 'bg-[#d4af37] text-[#0d0d1a]' : 'bg-[#14b8a6] text-white')}><Plus size={16} /></button>
        </div>
        {(form.customEquipment || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {(form.customEquipment || []).map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1">
                <span className={'px-3 py-1.5 rounded-lg text-xs ' + (isDark ? 'bg-[#4a90d9]/20 text-[#6bb5ff]' : 'bg-[#14b8a6]/15 text-[#0d9488]')}>{item}</span>
                <button onClick={() => setForm({ ...form, customEquipment: (form.customEquipment || []).filter((_: string, i: number) => i !== idx) })} className={isDark ? 'text-red-400' : 'text-red-600'}><X size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function StepNutrition({ form, setForm, toggleFood, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#d4af37]' : 'text-[#0d9488]')}>تغذیه</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="نوع رژیم" value={form.dietType} onChange={(v: string) => setForm({ ...form, dietType: v })} options={Object.entries(DIET_TYPES).map(([value, label]) => ({ value, label }))} isDark={isDark} />
        <NumberField label="تعداد وعده در روز" value={form.mealsPerDay} onChange={(v: number) => setForm({ ...form, mealsPerDay: v })} suffix="وعده" isDark={isDark} />
        <NumberField label="هدف کالری" value={form.calorieTarget} onChange={(v: number) => setForm({ ...form, calorieTarget: v })} suffix="kcal" isDark={isDark} />
        <SelectField label="مهارت آشپزی" value={form.cookingSkill} onChange={(v: string) => setForm({ ...form, cookingSkill: v })} options={[{ value: 'basic', label: 'مبتدی' }, { value: 'intermediate', label: 'متوسط' }, { value: 'advanced', label: 'پیشرفته' }]} isDark={isDark} />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>حساسیت غذایی (با ویرگول)</label>
        <textarea value={(form.foodAllergies || []).join('، ')} onChange={e => setForm({ ...form, foodAllergies: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: لبنیات، گلوتن..." />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>غذاهای مورد علاقه</label>
        <div className="flex flex-wrap gap-2">
          {IRANIAN_FOODS.slice(0, 20).map(food => (
            <button key={food} onClick={() => toggleFood(food, 'favoriteFoods')} className={'px-3 py-1.5 rounded-lg text-xs transition-all ' + ((form.favoriteFoods || []).includes(food) ? (isDark ? 'bg-[#d4af37] text-[#0d0d1a] font-bold' : 'bg-[#14b8a6] text-white font-bold') : (isDark ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700' : 'bg-[#f0fdfa] text-teal-700/70 border border-[#14b8a6]/30'))}>{food}</button>
          ))}
        </div>
      </div>
      <InputField label="هدف تغذیه‌ای" value={form.dietaryGoal || ''} onChange={(v: string) => setForm({ ...form, dietaryGoal: v })} isDark={isDark} placeholder="مثلاً: کاهش چربی با حفظ عضله" />
    </div>
  );
}

export function StepSupplements({ form, setForm, toggleSupplement, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#d4af37]' : 'text-[#0d9488]')}>مکمل‌ها</h3>
      <InputField label="هدف از مصرف مکمل" value={form.supplementGoal || ''} onChange={(v: string) => setForm({ ...form, supplementGoal: v })} isDark={isDark} placeholder="مثلاً: افزایش عضله، ریکاوری" />
      <InputField label="بودجه ماهانه مکمل" value={form.supplementBudget || ''} onChange={(v: string) => setForm({ ...form, supplementBudget: v })} isDark={isDark} placeholder="مثلاً: ۵۰۰ هزار تومان" />
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>مکمل‌های فعلی</label>
        <div className="flex flex-wrap gap-2">
          {SUPPLEMENT_CATEGORIES.map(s => (
            <button key={s} onClick={() => toggleSupplement(s)} className={'px-3 py-1.5 rounded-lg text-xs transition-all ' + ((form.currentSupplements || []).includes(s) ? (isDark ? 'bg-[#d4af37] text-[#0d0d1a] font-bold' : 'bg-[#14b8a6] text-white font-bold') : (isDark ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700' : 'bg-[#f0fdfa] text-teal-700/70 border border-[#14b8a6]/30'))}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>شرایط پزشکی (با ویرگول)</label>
        <textarea value={(form.healthConditions || []).join('، ')} onChange={e => setForm({ ...form, healthConditions: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: فشار خون، دیابت..." />
      </div>
    </div>
  );
}

export function StepGoals({ form, setForm, toggleTargetMuscle, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#d4af37]' : 'text-[#0d9488]')}>اهداف</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="هدف اصلی" value={form.primaryGoal} onChange={(v: string) => setForm({ ...form, primaryGoal: v })} options={Object.entries(GOAL_LABELS).map(([value, label]) => ({ value, label }))} isDark={isDark} />
        <SelectField label="نوع برنامه" value={form.programType} onChange={(v: string) => setForm({ ...form, programType: v })} options={Object.entries(PROGRAM_TYPES).map(([value, label]) => ({ value, label }))} isDark={isDark} />
      </div>
      <InputField label="هدف فرعی" value={form.secondaryGoal || ''} onChange={(v: string) => setForm({ ...form, secondaryGoal: v })} isDark={isDark} placeholder="اختیاری" />
      <InputField label="بازه زمانی" value={form.timeline || ''} onChange={(v: string) => setForm({ ...form, timeline: v })} isDark={isDark} placeholder="مثلاً: ۳ ماه" />
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>عضلات هدف</label>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map(m => (
            <button key={m} onClick={() => toggleTargetMuscle(m)} className={'px-3 py-1.5 rounded-lg text-xs transition-all ' + ((form.targetMuscles || []).includes(m) ? (isDark ? 'bg-[#d4af37] text-[#0d0d1a] font-bold' : 'bg-[#14b8a6] text-white font-bold') : (isDark ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700' : 'bg-[#f0fdfa] text-teal-700/70 border border-[#14b8a6]/30'))}>{m}</button>
          ))}
        </div>
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>سابقه تمرینی</label>
        <textarea value={form.trainingHistory || ''} onChange={e => setForm({ ...form, trainingHistory: e.target.value })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={3} placeholder="توضیح مختصر سابقه تمرین..." />
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, isDark, placeholder }: { label: string; value: string; onChange: (v: string) => void; isDark: boolean; placeholder?: string }) {
  return (
    <div>
      <label className={'text-sm mb-1 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>{label}</label>
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} />
    </div>
  );
}

function NumberField({ label, value, onChange, suffix, isDark }: { label: string; value: number; onChange: (v: number) => void; suffix?: string; isDark: boolean }) {
  return (
    <div>
      <label className={'text-sm mb-1 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>{label}{suffix ? ' (' + suffix + ')' : ''}</label>
      <input type="number" value={value || ''} onChange={e => onChange(Number(e.target.value))} className={'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} />
    </div>
  );
}

function SelectField({ label, value, onChange, options, isDark }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; isDark: boolean }) {
  return (
    <div>
      <label className={'text-sm mb-1 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>{label}</label>
      <select value={value || ''} onChange={e => onChange(e.target.value)} className={'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')}>
        {options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
      </select>
    </div>
  );
}
