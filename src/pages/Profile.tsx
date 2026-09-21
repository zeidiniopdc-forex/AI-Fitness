import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { AthleteProfile, Goal, GOAL_LABELS, EXPERIENCE_LABELS, EQUIPMENT_OPTIONS, MUSCLE_GROUPS } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { User, Save, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';

const steps = ['اطلاعات پایه', 'اطلاعات تمرینی', 'سلامت و محدودیت‌ها', 'اهداف'];

export default function Profile() {
  const { state, setProfile } = useAppContext();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Partial<AthleteProfile>>({
    name: '',
    age: 25,
    gender: 'male',
    height: 175,
    weight: 75,
    experience: 'intermediate',
    trainingDays: 4,
    sessionDuration: 60,
    location: 'gym',
    equipment: [],
    injuries: [],
    limitations: [],
    avoidedExercises: [],
    primaryGoal: 'hypertrophy',
    secondaryGoal: undefined,
    targetMuscles: [],
    timeline: '',
    trainingHistory: '',
    strengthRecords: {},
    bodyMeasurements: {},
  });

  useEffect(() => {
    if (state.profile) {
      setForm(state.profile);
    }
  }, [state.profile]);

  const handleSave = () => {
    const profile: AthleteProfile = {
      id: state.profile?.id || uuidv4(),
      name: form.name || 'ورزشکار',
      age: form.age || 25,
      gender: form.gender || 'male',
      height: form.height || 175,
      weight: form.weight || 75,
      experience: form.experience || 'intermediate',
      trainingDays: form.trainingDays || 4,
      sessionDuration: form.sessionDuration || 60,
      location: form.location || 'gym',
      equipment: form.equipment || [],
      injuries: form.injuries || [],
      limitations: form.limitations || [],
      avoidedExercises: form.avoidedExercises || [],
      primaryGoal: form.primaryGoal || 'hypertrophy',
      secondaryGoal: form.secondaryGoal,
      targetMuscles: form.targetMuscles || [],
      timeline: form.timeline || '',
      trainingHistory: form.trainingHistory || '',
      strengthRecords: form.strengthRecords || {},
      bodyMeasurements: form.bodyMeasurements || {},
      createdAt: state.profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleEquipment = (item: string) => {
    const current = form.equipment || [];
    setForm({
      ...form,
      equipment: current.includes(item) ? current.filter(e => e !== item) : [...current, item]
    });
  };

  const toggleTargetMuscle = (muscle: string) => {
    const current = form.targetMuscles || [];
    setForm({
      ...form,
      targetMuscles: current.includes(muscle) ? current.filter(m => m !== muscle) : [...current, muscle]
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User size={22} className="text-[#d4af37]" />
          پروفایل ورزشکار
        </h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#d4af37] text-[#0d0d1a] px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#f0d060] transition-all"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'ذخیره شد' : 'ذخیره'}
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className={`h-1.5 w-full rounded-full ${i <= step ? 'bg-[#d4af37]' : 'bg-gray-700'}`} />
            <span className={`text-[10px] mt-1 ${i <= step ? 'text-[#d4af37]' : 'text-gray-500'}`}>{s}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
        {step === 0 && <StepBasic form={form} setForm={setForm} />}
        {step === 1 && <StepTraining form={form} setForm={setForm} toggleEquipment={toggleEquipment} />}
        {step === 2 && <StepHealth form={form} setForm={setForm} />}
        {step === 3 && <StepGoals form={form} setForm={setForm} toggleTargetMuscle={toggleTargetMuscle} />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="flex items-center gap-1 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
        >
          <ChevronRight size={18} />
          قبلی
        </button>
        <span className="text-gray-500 text-sm">{toPersianNumber(step + 1)} از {toPersianNumber(4)}</span>
        <button
          onClick={() => setStep(Math.min(3, step + 1))}
          disabled={step === 3}
          className="flex items-center gap-1 text-[#d4af37] hover:text-[#f0d060] disabled:opacity-30 transition-all"
        >
          بعدی
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  );
}

function StepBasic({ form, setForm }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-[#d4af37] font-bold mb-4">اطلاعات پایه</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="نام" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} />
        <NumberField label="سن" value={form.age} onChange={(v: number) => setForm({ ...form, age: v })} suffix="سال" />
        <SelectField 
          label="جنسیت" 
          value={form.gender} 
          onChange={(v: string) => setForm({ ...form, gender: v })}
          options={[{ value: 'male', label: 'مرد' }, { value: 'female', label: 'زن' }]}
        />
        <NumberField label="قد" value={form.height} onChange={(v: number) => setForm({ ...form, height: v })} suffix="سانتی‌متر" />
        <NumberField label="وزن" value={form.weight} onChange={(v: number) => setForm({ ...form, weight: v })} suffix="کیلوگرم" />
        <SelectField 
          label="سطح تجربه" 
          value={form.experience} 
          onChange={(v: string) => setForm({ ...form, experience: v })}
          options={Object.entries(EXPERIENCE_LABELS).map(([value, label]) => ({ value, label }))}
        />
      </div>
    </div>
  );
}

function StepTraining({ form, setForm, toggleEquipment }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-[#d4af37] font-bold mb-4">اطلاعات تمرینی</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField label="روزهای تمرین در هفته" value={form.trainingDays} onChange={(v: number) => setForm({ ...form, trainingDays: v })} suffix="روز" />
        <NumberField label="مدت هر جلسه" value={form.sessionDuration} onChange={(v: number) => setForm({ ...form, sessionDuration: v })} suffix="دقیقه" />
        <SelectField 
          label="محل تمرین" 
          value={form.location} 
          onChange={(v: string) => setForm({ ...form, location: v })}
          options={[
            { value: 'gym', label: 'باشگاه' },
            { value: 'home', label: 'خانه' },
            { value: 'both', label: 'هر دو' },
          ]}
        />
      </div>
      <div>
        <label className="text-gray-400 text-sm mb-2 block">سابقه تمرینی</label>
        <textarea
          value={form.trainingHistory || ''}
          onChange={e => setForm({ ...form, trainingHistory: e.target.value })}
          className="w-full bg-[#0d0d1a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af37] focus:outline-none resize-none"
          rows={3}
          placeholder="سابقه تمرینی خود را شرح دهید..."
        />
      </div>
      <div>
        <label className="text-gray-400 text-sm mb-2 block">تجهیزات موجود</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map(item => (
            <button
              key={item}
              onClick={() => toggleEquipment(item)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                (form.equipment || []).includes(item)
                  ? 'bg-[#d4af37] text-[#0d0d1a] font-bold'
                  : 'bg-[#0d0d1a] text-gray-400 border border-gray-700 hover:border-[#d4af37]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepHealth({ form, setForm }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-[#d4af37] font-bold mb-4">سلامت و محدودیت‌ها</h3>
      <div>
        <label className="text-gray-400 text-sm mb-2 block">آسیب‌دیدگی‌ها</label>
        <textarea
          value={(form.injuries || []).join('، ')}
          onChange={e => setForm({ ...form, injuries: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })}
          className="w-full bg-[#0d0d1a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af37] focus:outline-none resize-none"
          rows={2}
          placeholder="آسیب‌ها را با ویرگول جدا کنید..."
        />
      </div>
      <div>
        <label className="text-gray-400 text-sm mb-2 block">محدودیت‌های پزشکی</label>
        <textarea
          value={(form.limitations || []).join('، ')}
          onChange={e => setForm({ ...form, limitations: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })}
          className="w-full bg-[#0d0d1a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af37] focus:outline-none resize-none"
          rows={2}
          placeholder="محدودیت‌ها را با ویرگول جدا کنید..."
        />
      </div>
      <div>
        <label className="text-gray-400 text-sm mb-2 block">تمرینات ممنوعه</label>
        <textarea
          value={(form.avoidedExercises || []).join('، ')}
          onChange={e => setForm({ ...form, avoidedExercises: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })}
          className="w-full bg-[#0d0d1a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af37] focus:outline-none resize-none"
          rows={2}
          placeholder="تمریناتی که نباید انجام دهید..."
        />
      </div>
    </div>
  );
}

function StepGoals({ form, setForm, toggleTargetMuscle }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-[#d4af37] font-bold mb-4">اهداف تمرینی</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField 
          label="هدف اصلی" 
          value={form.primaryGoal} 
          onChange={(v: string) => setForm({ ...form, primaryGoal: v as Goal })}
          options={Object.entries(GOAL_LABELS).map(([value, label]) => ({ value, label }))}
        />
        <SelectField 
          label="هدف ثانویه" 
          value={form.secondaryGoal || ''} 
          onChange={(v: string) => setForm({ ...form, secondaryGoal: v || undefined })}
          options={[{ value: '', label: 'ندارم' }, ...Object.entries(GOAL_LABELS).map(([value, label]) => ({ value, label }))]}
        />
      </div>
      <div>
        <label className="text-gray-400 text-sm mb-2 block">مدت زمان هدف</label>
        <input
          type="text"
          value={form.timeline || ''}
          onChange={e => setForm({ ...form, timeline: e.target.value })}
          className="w-full bg-[#0d0d1a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af37] focus:outline-none"
          placeholder="مثال: ۱۲ هفته"
        />
      </div>
      <div>
        <label className="text-gray-400 text-sm mb-2 block">عضلات هدف</label>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map(muscle => (
            <button
              key={muscle}
              onClick={() => toggleTargetMuscle(muscle)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                (form.targetMuscles || []).includes(muscle)
                  ? 'bg-[#4a90d9] text-white font-bold'
                  : 'bg-[#0d0d1a] text-gray-400 border border-gray-700 hover:border-[#4a90d9]'
              }`}
            >
              {muscle}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-gray-400 text-sm mb-1 block">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#0d0d1a] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#d4af37] focus:outline-none"
      />
    </div>
  );
}

function NumberField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div>
      <label className="text-gray-400 text-sm mb-1 block">{label}{suffix ? ` (${suffix})` : ''}</label>
      <input
        type="number"
        value={value || ''}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full bg-[#0d0d1a] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#d4af37] focus:outline-none"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-gray-400 text-sm mb-1 block">{label}</label>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#0d0d1a] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#d4af37] focus:outline-none"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
