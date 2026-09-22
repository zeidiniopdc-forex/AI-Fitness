import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { AthleteProfile, GOAL_LABELS, EXPERIENCE_LABELS, EQUIPMENT_OPTIONS, MUSCLE_GROUPS, PROGRAM_TYPES, ACTIVITY_LEVELS, EQUIPMENT_TYPES, DIET_TYPES, IRANIAN_FOODS, SUPPLEMENT_CATEGORIES, getGoalLabel } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { User, Save, ChevronLeft, ChevronRight, Check, Plus, Trash2, Edit, Dumbbell, Apple, Pill, X } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';

const steps = ['اطلاعات پایه', 'اطلاعات تمرینی', 'تغذیه', 'مکمل‌ها', 'اهداف'];

export default function Profile() {
  const { profiles, activeProfile, saveProfile, deleteProfile, setActiveProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  
  const [form, setForm] = useState<Partial<AthleteProfile>>({
    name: '',
    age: 25,
    gender: 'male',
    height: 175,
    weight: 75,
    targetWeight: undefined,
    activityLevel: 'moderate',
    experience: 'intermediate',
    trainingDays: 4,
    sessionDuration: 60,
    location: 'gym',
    equipmentType: 'full_gym',
    customEquipment: [],
    equipment: [],
    injuries: [],
    limitations: [],
    avoidedExercises: [],
    primaryGoal: 'hypertrophy',
    secondaryGoal: undefined,
    targetMuscles: [],
    programType: 'full_body',
    timeline: '',
    trainingHistory: '',
    strengthRecords: {},
    bodyMeasurements: {},
    dietaryGoal: '',
    dietType: '',
    foodAllergies: [],
    favoriteFoods: [],
    dislikedFoods: [],
    mealsPerDay: 3,
    calorieTarget: undefined,
    cookingSkill: 'basic',
    supplementGoal: '',
    currentSupplements: [],
    supplementBudget: '',
    healthConditions: [],
  });

  useEffect(() => {
    if (activeProfile && !editingProfileId) {
      setForm(activeProfile);
    }
  }, [activeProfile, editingProfileId]);

  const handleSave = () => {
    const profile: AthleteProfile = {
      id: editingProfileId || uuidv4(),
      name: form.name || 'ورزشکار',
      age: form.age || 25,
      gender: form.gender || 'male',
      height: form.height || 175,
      weight: form.weight || 75,
      targetWeight: form.targetWeight,
      activityLevel: form.activityLevel || 'moderate',
      experience: form.experience || 'intermediate',
      trainingDays: form.trainingDays || 4,
      sessionDuration: form.sessionDuration || 60,
      location: form.location || 'gym',
      equipmentType: form.equipmentType || 'full_gym',
      customEquipment: form.customEquipment || [],
      equipment: form.equipment || [],
      injuries: form.injuries || [],
      limitations: form.limitations || [],
      avoidedExercises: form.avoidedExercises || [],
      primaryGoal: form.primaryGoal || 'hypertrophy',
      secondaryGoal: form.secondaryGoal,
      targetMuscles: form.targetMuscles || [],
      programType: form.programType || 'full_body',
      timeline: form.timeline || '',
      trainingHistory: form.trainingHistory || '',
      strengthRecords: form.strengthRecords || {},
      bodyMeasurements: form.bodyMeasurements || {},
      dietaryGoal: form.dietaryGoal || '',
      dietType: form.dietType || '',
      foodAllergies: form.foodAllergies || [],
      favoriteFoods: form.favoriteFoods || [],
      dislikedFoods: form.dislikedFoods || [],
      mealsPerDay: form.mealsPerDay || 3,
      calorieTarget: form.calorieTarget,
      cookingSkill: form.cookingSkill || 'basic',
      supplementGoal: form.supplementGoal || '',
      currentSupplements: form.currentSupplements || [],
      supplementBudget: form.supplementBudget || '',
      healthConditions: form.healthConditions || [],
      createdAt: activeProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProfile(profile);
    setSaved(true);
    setEditingProfileId(profile.id);
    setShowNewProfileForm(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNewProfile = () => {
    setForm({
      name: '',
      age: 25,
      gender: 'male',
      height: 175,
      weight: 75,
      targetWeight: undefined,
      activityLevel: 'moderate',
      experience: 'intermediate',
      trainingDays: 4,
      sessionDuration: 60,
      location: 'gym',
      equipmentType: 'full_gym',
      customEquipment: [],
      equipment: [],
      injuries: [],
      limitations: [],
      avoidedExercises: [],
      primaryGoal: 'hypertrophy',
      secondaryGoal: undefined,
      targetMuscles: [],
      programType: 'full_body',
      timeline: '',
      trainingHistory: '',
      strengthRecords: {},
      bodyMeasurements: {},
      dietaryGoal: '',
      dietType: '',
      foodAllergies: [],
      favoriteFoods: [],
      dislikedFoods: [],
      mealsPerDay: 3,
      calorieTarget: undefined,
      cookingSkill: 'basic',
      supplementGoal: '',
      currentSupplements: [],
      supplementBudget: '',
      healthConditions: [],
    });
    setEditingProfileId(null);
    setShowNewProfileForm(true);
    setStep(0);
  };

  const handleEditProfile = (profile: AthleteProfile) => {
    setForm(profile);
    setEditingProfileId(profile.id);
    setShowNewProfileForm(true);
    setStep(0);
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این پروفایل را حذف کنید؟')) {
      deleteProfile(id);
      if (editingProfileId === id) {
        setEditingProfileId(null);
        setShowNewProfileForm(false);
      }
    }
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

  const toggleFood = (food: string, field: 'favoriteFoods' | 'dislikedFoods') => {
    const current = form[field] || [];
    setForm({
      ...form,
      [field]: current.includes(food) ? current.filter(f => f !== food) : [...current, food]
    });
  };

  const toggleSupplement = (supp: string) => {
    const current = form.currentSupplements || [];
    setForm({
      ...form,
      currentSupplements: current.includes(supp) ? current.filter(s => s !== supp) : [...current, supp]
    });
  };

  // Profile List View
  if (!showNewProfileForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
            <User size={22} className={isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'} />
            مدیریت پروفایل شاگردان
          </h2>
          <button
            onClick={handleNewProfile}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isDark
                ? 'bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a] shadow-[#d4af37]/20 hover:opacity-90'
                : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white shadow-[#14b8a6]/20 hover:opacity-90'
            }`}
          >
            <Plus size={16} />
            پروفایل جدید
          </button>
        </div>

        {profiles.length === 0 ? (
          <div className={`rounded-2xl p-10 border text-center theme-transition ${
            isDark 
              ? 'bg-[#1a1a2e] border-[#d4af37]/10' 
              : 'bg-white border-[#14b8a6]/20'
          }`}>
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isDark ? 'bg-[#d4af37]/10' : 'bg-[#14b8a6]/10'
            }`}>
              <User size={40} className={isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'} />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
              هنوز پروفایلی ایجاد نشده
            </h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
              برای شروع، اولین پروفایل شاگرد خود را ایجاد کنید
            </p>
            <button
              onClick={handleNewProfile}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isDark
                  ? 'bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a] hover:opacity-90'
                  : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90'
              }`}
            >
              ایجاد پروفایل جدید
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map(profile => (
              <div
                key={profile.id}
                className={`rounded-2xl p-5 border theme-transition ${
                  profile.id === activeProfile?.id
                    ? isDark 
                      ? 'bg-gradient-to-l from-[#d4af37]/10 to-transparent border-[#d4af37]/50 shadow-lg shadow-[#d4af37]/10' 
                      : 'bg-gradient-to-l from-[#14b8a6]/10 to-white border-[#14b8a6]/50 shadow-lg shadow-[#14b8a6]/10'
                    : isDark 
                      ? 'bg-[#1a1a2e] border-gray-800 hover:border-gray-600' 
                      : 'bg-white border-[#14b8a6]/20 hover:border-[#14b8a6]/40'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      profile.id === activeProfile?.id
                        ? isDark
                          ? 'bg-gradient-to-br from-[#d4af37] to-[#f0d060] text-[#0d0d1a]'
                          : 'bg-gradient-to-br from-[#14b8a6] to-[#0d9488] text-white'
                        : isDark ? 'bg-gray-800 text-gray-400' : 'bg-[#f0fdfa] text-[#0d9488]'
                    }`}>
                      {profile.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                        {profile.name}
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                        {toPersianNumber(profile.age)} سال • {profile.gender === 'male' ? 'مرد' : 'زن'}
                      </p>
                    </div>
                  </div>
                  {profile.id === activeProfile?.id && (
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#10b981]/15 text-[#059669]'
                    }`}>
                      فعال
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    قد: <span className={`font-medium ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{toPersianNumber(profile.height)} cm</span>
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    وزن: <span className={`font-medium ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{toPersianNumber(profile.weight)} kg</span>
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    هدف: <span className={`font-medium ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{getGoalLabel(profile.primaryGoal)}</span>
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    سطح: <span className={`font-medium ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{EXPERIENCE_LABELS[profile.experience]}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {profile.id !== activeProfile?.id && (
                    <button
                      onClick={() => setActiveProfile(profile.id)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        isDark
                          ? 'bg-[#4a90d9]/20 text-[#4a90d9] hover:bg-[#4a90d9]/30'
                          : 'bg-[#14b8a6]/15 text-[#0d9488] hover:bg-[#14b8a6]/25'
                      }`}
                    >
                      فعال‌سازی
                    </button>
                  )}
                  <button
                    onClick={() => handleEditProfile(profile)}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isDark 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-[#f0fdfa] text-[#0d9488] hover:bg-[#ccfbf1]'
                    }`}
                  >
                    <Edit size={12} />
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDeleteProfile(profile.id)}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isDark
                        ? 'bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Profile Form View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewProfileForm(false)}
            className={`p-2 rounded-lg transition-all ${
              isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-[#f0fdfa] text-[#0f766e]/70'
            }`}
          >
            <ChevronRight size={20} />
          </button>
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
            <User size={22} className={isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'} />
            {editingProfileId ? 'ویرایش پروفایل' : 'پروفایل جدید'}
          </h2>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg ${
            isDark
              ? 'bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a] shadow-[#d4af37]/20 hover:opacity-90'
              : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white shadow-[#14b8a6]/20 hover:opacity-90'
          }`}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'ذخیره شد' : 'ذخیره'}
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className={`h-1.5 w-full rounded-full ${
              i <= step 
                ? isDark ? 'bg-[#d4af37]' : 'bg-[#14b8a6]'
                : isDark ? 'bg-gray-700' : 'bg-[#f0fdfa]'
            }`} />
            <span className={`text-[10px] mt-1 ${
              i <= step 
                ? isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'
                : isDark ? 'text-gray-500' : 'text-[#0f766e]/50'
            }`}>
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className={`rounded-2xl p-5 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#d4af37]/10' : 'bg-white border-[#14b8a6]/15'
      }`}>
        {step === 0 && <StepBasic form={form} setForm={setForm} isDark={isDark} />}
        {step === 1 && <StepTraining form={form} setForm={setForm} toggleEquipment={toggleEquipment} isDark={isDark} />}
        {step === 2 && <StepNutrition form={form} setForm={setForm} toggleFood={toggleFood} isDark={isDark} />}
        {step === 3 && <StepSupplements form={form} setForm={setForm} toggleSupplement={toggleSupplement} isDark={isDark} />}
        {step === 4 && <StepGoals form={form} setForm={setForm} toggleTargetMuscle={toggleTargetMuscle} isDark={isDark} />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className={`flex items-center gap-1 disabled:opacity-30 transition-all ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-[#0f766e]/70 hover:text-[#0d9488]'
          }`}
        >
          <ChevronRight size={18} />
          قبلی
        </button>
        <span className={isDark ? 'text-gray-500 text-sm' : 'text-[#0f766e]/50 text-sm'}>
          {toPersianNumber(step + 1)} از {toPersianNumber(5)}
        </span>
        <button
          onClick={() => setStep(Math.min(4, step + 1))}
          disabled={step === 4}
          className={`flex items-center gap-1 disabled:opacity-30 transition-all ${
            isDark ? 'text-[#d4af37] hover:text-[#f0d060]' : 'text-[#0d9488] hover:text-[#14b8a6]'
          }`}
        >
          بعدی
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  );
}

function StepBasic({ form, setForm, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={`font-bold mb-4 ${isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'}`}>اطلاعات پایه</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="نام" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} isDark={isDark} />
        <NumberField label="سن" value={form.age} onChange={(v: number) => setForm({ ...form, age: v })} suffix="سال" isDark={isDark} />
        <SelectField 
          label="جنسیت" 
          value={form.gender} 
          onChange={(v: string) => setForm({ ...form, gender: v })}
          options={[{ value: 'male', label: 'مرد' }, { value: 'female', label: 'زن' }]}
          isDark={isDark}
        />
        <NumberField label="قد" value={form.height} onChange={(v: number) => setForm({ ...form, height: v })} suffix="سانتی‌متر" isDark={isDark} />
        <NumberField label="وزن فعلی" value={form.weight} onChange={(v: number) => setForm({ ...form, weight: v })} suffix="کیلوگرم" isDark={isDark} />
        <NumberField label="وزن هدف" value={form.targetWeight} onChange={(v: number) => setForm({ ...form, targetWeight: v })} suffix="کیلوگرم" isDark={isDark} />
        <SelectField 
          label="سطح فعالیت" 
          value={form.activityLevel} 
          onChange={(v: string) => setForm({ ...form, activityLevel: v })}
          options={Object.entries(ACTIVITY_LEVELS).map(([value, label]) => ({ value, label }))}
          isDark={isDark}
        />
        <SelectField 
          label="سطح تجربه" 
          value={form.experience} 
          onChange={(v: string) => setForm({ ...form, experience: v })}
          options={Object.entries(EXPERIENCE_LABELS).map(([value, label]) => ({ value, label }))}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

function StepTraining({ form, setForm, toggleEquipment, isDark }: any) {
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
      <h3 className={`font-bold mb-4 ${isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'}`}>اطلاعات تمرینی</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField label="روزهای تمرین در هفته" value={form.trainingDays} onChange={(v: number) => setForm({ ...form, trainingDays: v })} suffix="روز" isDark={isDark} />
        <NumberField label="مدت هر جلسه" value={form.sessionDuration} onChange={(v: number) => setForm({ ...form, sessionDuration: v })} suffix="دقیقه" isDark={isDark} />
        <SelectField 
          label="محل تمرین" 
          value={form.location} 
          onChange={(v: string) => setForm({ ...form, location: v })}
          options={[
            { value: 'gym', label: 'باشگاه' },
            { value: 'home', label: 'خانه' },
            { value: 'park', label: 'پارک' },
            { value: 'both', label: 'هر دو' },
          ]}
          isDark={isDark}
        />
        <SelectField 
          label="نوع تجهیزات" 
          value={form.equipmentType} 
          onChange={(v: string) => setForm({ ...form, equipmentType: v })}
          options={Object.entries(EQUIPMENT_TYPES).map(([value, label]) => ({ value, label }))}
          isDark={isDark}
        />
      </div>
      
      <div>
        <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>تجهیزات موجود</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map(item => (
            <button
              key={item}
              onClick={() => toggleEquipment(item)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                (form.equipment || []).includes(item)
                  ? isDark
                    ? 'bg-[#d4af37] text-[#0d0d1a] font-bold'
                    : 'bg-[#14b8a6] text-white font-bold'
                  : isDark
                    ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700 hover:border-[#d4af37]'
                    : 'bg-[#f0fdfa] text-[#0f766e]/70 border border-[#14b8a6]/30 hover:border-[#14b8a6]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>اضافه کردن تجهیزات خاص</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customEquip}
            onChange={e => setCustomEquip(e.target.value)}
            placeholder="نام تجهیزات..."
            className={`flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ${
              isDark 
                ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' 
                : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
            }`}
          />
          <button
            onClick={addCustomEquipment}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isDark
                ? 'bg-[#d4af37] text-[#0d0d1a] hover:bg-[#f0d060]'
                : 'bg-[#14b8a6] text-white hover:bg-[#0d9488]'
            }`}
          >
            <Plus size={16} />
          </button>
        </div>
        {(form.customEquipment || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {(form.customEquipment || []).map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1">
                <span className={`px-3 py-1.5 rounded-lg text-xs ${
                  isDark ? 'bg-[#4a90d9]/20 text-[#6bb5ff]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
                }`}>
                  {item}
                </span>
                <button
                  onClick={() => {
                    const updated = (form.customEquipment || []).filter((_: string, i: number) => i !== idx);
                    setForm({ ...form, customEquipment: updated });
                  }}
                  className={`p-1 rounded hover:bg-red-500/20 transition-all ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`}
                  title="حذف"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StepNutrition({ form, setForm, toggleFood, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'}`}>
        <Apple size={18} />
        اطلاعات تغذیه
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="هدف رژیم غذایی" value={form.dietaryGoal} onChange={(v: string) => setForm({ ...form, dietaryGoal: v })} isDark={isDark} placeholder="مثلاً: کاهش وزن، عضله‌سازی..." />
        <SelectField 
          label="نوع رژیم" 
          value={form.dietType} 
          onChange={(v: string) => setForm({ ...form, dietType: v })}
          options={[{ value: '', label: 'انتخاب کنید' }, ...DIET_TYPES.map(d => ({ value: d, label: d }))]}
          isDark={isDark}
        />
        <NumberField label="تعداد وعده در روز" value={form.mealsPerDay} onChange={(v: number) => setForm({ ...form, mealsPerDay: v })} suffix="وعده" isDark={isDark} />
        <NumberField label="کالری هدف (اختیاری)" value={form.calorieTarget} onChange={(v: number) => setForm({ ...form, calorieTarget: v })} suffix="کالری" isDark={isDark} />
        <SelectField 
          label="مهارت آشپزی" 
          value={form.cookingSkill} 
          onChange={(v: string) => setForm({ ...form, cookingSkill: v })}
          options={[
            { value: 'none', label: 'بدون مهارت' },
            { value: 'basic', label: 'مقدماتی' },
            { value: 'intermediate', label: 'متوسط' },
            { value: 'advanced', label: 'پیشرفته' },
          ]}
          isDark={isDark}
        />
      </div>

      <div>
        <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>غذاهای مورد علاقه (ایرانی)</label>
        <div className="flex flex-wrap gap-2">
          {IRANIAN_FOODS.map(food => (
            <button
              key={food}
              onClick={() => toggleFood(food, 'favoriteFoods')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                (form.favoriteFoods || []).includes(food)
                  ? isDark
                    ? 'bg-[#22c55e] text-white font-bold'
                    : 'bg-[#10b981] text-white font-bold'
                  : isDark
                    ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700 hover:border-[#22c55e]'
                    : 'bg-[#f0fdfa] text-[#0f766e]/70 border border-[#14b8a6]/30 hover:border-[#10b981]'
              }`}
            >
              {food}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>غذاهای مورد عدم علاقه</label>
        <div className="flex flex-wrap gap-2">
          {IRANIAN_FOODS.map(food => (
            <button
              key={food}
              onClick={() => toggleFood(food, 'dislikedFoods')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                (form.dislikedFoods || []).includes(food)
                  ? 'bg-[#ef4444] text-white font-bold'
                  : isDark
                    ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700 hover:border-[#ef4444]'
                    : 'bg-[#f0fdfa] text-[#0f766e]/70 border border-[#14b8a6]/30 hover:border-[#ef4444]'
              }`}
            >
              {food}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>آلرژی‌های غذایی (با ویرگول جدا کنید)</label>
        <textarea
          value={(form.foodAllergies || []).join('، ')}
          onChange={e => setForm({ ...form, foodAllergies: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })}
          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ${
            isDark 
              ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' 
              : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
          }`}
          rows={2}
          placeholder="مثلاً: شیر، بادام زمینی..."
        />
      </div>
    </div>
  );
}

function StepSupplements({ form, setForm, toggleSupplement, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'}`}>
        <Pill size={18} />
        مکمل‌های ورزشی
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="هدف از مصرف مکمل" value={form.supplementGoal} onChange={(v: string) => setForm({ ...form, supplementGoal: v })} isDark={isDark} placeholder="مثلاً: افزایش حجم، ریکاوری..." />
        <InputField label="بودجه ماهانه مکمل" value={form.supplementBudget} onChange={(v: string) => setForm({ ...form, supplementBudget: v })} isDark={isDark} placeholder="مثلاً: 500 هزار تومان" />
      </div>

      <div>
        <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>مکمل‌های فعلی</label>
        <div className="flex flex-wrap gap-2">
          {SUPPLEMENT_CATEGORIES.map(supp => (
            <button
              key={supp}
              onClick={() => toggleSupplement(supp)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                (form.currentSupplements || []).includes(supp)
                  ? isDark
                    ? 'bg-[#4a90d9] text-white font-bold'
                    : 'bg-[#14b8a6] text-white font-bold'
                  : isDark
                    ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700 hover:border-[#4a90d9]'
                    : 'bg-[#f0fdfa] text-[#0f766e]/70 border border-[#14b8a6]/30 hover:border-[#14b8a6]'
              }`}
            >
              {supp}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>شرایط پزشکی خاص (با ویرگول جدا کنید)</label>
        <textarea
          value={(form.healthConditions || []).join('، ')}
          onChange={e => setForm({ ...form, healthConditions: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })}
          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ${
            isDark 
              ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' 
              : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
          }`}
          rows={2}
          placeholder="مثلاً: دیابت، فشار خون..."
        />
      </div>
    </div>
  );
}

function StepGoals({ form, setForm, toggleTargetMuscle, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'}`}>
        <Dumbbell size={18} />
        اهداف تمرینی
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GoalInput
          label="هدف اصلی"
          value={form.primaryGoal || ''}
          onChange={(v: string) => setForm({ ...form, primaryGoal: v })}
          isDark={isDark}
          placeholder="هدف خود را تایپ کنید..."
        />
        <GoalInput
          label="هدف ثانویه"
          value={form.secondaryGoal || ''}
          onChange={(v: string) => setForm({ ...form, secondaryGoal: v || undefined })}
          isDark={isDark}
          placeholder="هدف ثانویه (اختیاری)..."
        />
        <SelectField 
          label="نوع برنامه تمرینی" 
          value={form.programType} 
          onChange={(v: string) => setForm({ ...form, programType: v })}
          options={Object.entries(PROGRAM_TYPES).map(([value, label]) => ({ value, label }))}
          isDark={isDark}
        />
      </div>
      <div>
        <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>مدت زمان هدف</label>
        <input
          type="text"
          value={form.timeline || ''}
          onChange={e => setForm({ ...form, timeline: e.target.value })}
          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none theme-transition ${
            isDark 
              ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' 
              : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
          }`}
          placeholder="مثال: ۱۲ هفته"
        />
      </div>
      <div>
        <label className={`text-sm mb-2 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>عضلات هدف</label>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map(muscle => (
            <button
              key={muscle}
              onClick={() => toggleTargetMuscle(muscle)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                (form.targetMuscles || []).includes(muscle)
                  ? isDark
                    ? 'bg-[#4a90d9] text-white font-bold'
                    : 'bg-[#14b8a6] text-white font-bold'
                  : isDark
                    ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700 hover:border-[#4a90d9]'
                    : 'bg-[#f0fdfa] text-[#0f766e]/70 border border-[#14b8a6]/30 hover:border-[#14b8a6]'
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

function InputField({ label, value, onChange, isDark, placeholder }: { label: string; value: string; onChange: (v: string) => void; isDark: boolean; placeholder?: string }) {
  return (
    <div>
      <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ${
          isDark 
            ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' 
            : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
        }`}
      />
    </div>
  );
}

function NumberField({ label, value, onChange, suffix, isDark }: { label: string; value: number; onChange: (v: number) => void; suffix?: string; isDark: boolean }) {
  return (
    <div>
      <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
        {label}{suffix ? ` (${suffix})` : ''}
      </label>
      <input
        type="number"
        value={value || ''}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ${
          isDark 
            ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' 
            : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
        }`}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, isDark }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; isDark: boolean }) {
  return (
    <div>
      <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>{label}</label>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ${
          isDark 
            ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' 
            : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
        }`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function GoalInput({ label, value, onChange, isDark, placeholder }: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  isDark: boolean;
  placeholder?: string;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = Object.values(GOAL_LABELS);
  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(value.toLowerCase()) && s !== value
  );

  return (
    <div className="relative">
      <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={e => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ${
          isDark 
            ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#d4af37]' 
            : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
        }`}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className={`absolute z-10 w-full mt-1 rounded-xl border shadow-lg max-h-48 overflow-y-auto theme-transition ${
          isDark 
            ? 'bg-[#1a1a2e] border-gray-700' 
            : 'bg-white border-[#14b8a6]/30'
        }`}>
          {filteredSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
              }}
              className={`w-full text-right px-4 py-2 text-sm transition-all ${
                isDark 
                  ? 'text-gray-300 hover:bg-[#d4af37]/10 hover:text-[#d4af37]' 
                  : 'text-[#134e4a] hover:bg-[#14b8a6]/10 hover:text-[#0d9488]'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>
        می‌توانید هدف دلخواه خود را تایپ کنید یا از پیشنهادات انتخاب کنید
      </p>
    </div>
  );
}
