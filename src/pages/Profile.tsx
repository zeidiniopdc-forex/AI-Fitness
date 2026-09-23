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

  // TEMP_MARKER_CONTINUE
}
