export interface AthleteProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  targetWeight?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  experience: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  trainingDays: number;
  sessionDuration: number;
  location: 'gym' | 'home' | 'both' | 'park';
  equipmentType: 'full_gym' | 'home' | 'park' | 'custom';
  customEquipment: string[];
  equipment: string[];
  injuries: string[];
  limitations: string[];
  avoidedExercises: string[];
  primaryGoal: string;
  secondaryGoal?: string;
  targetMuscles: string[];
  programType: 'full_body' | 'split' | 'push_pull_legs' | 'upper_lower' | 'ai_suggested';
  timeline: string;
  trainingHistory: string;
  strengthRecords: Record<string, string>;
  bodyMeasurements: BodyMeasurements;
  dietaryGoal: string;
  dietType: string;
  foodAllergies: string[];
  favoriteFoods: string[];
  dislikedFoods: string[];
  mealsPerDay: number;
  calorieTarget?: number;
  cookingSkill: 'none' | 'basic' | 'intermediate' | 'advanced';
  supplementGoal: string;
  currentSupplements: string[];
  supplementBudget: string;
  healthConditions: string[];
  createdAt: string;
  updatedAt: string;
}

export type Goal = 
  | 'hypertrophy' 
  | 'strength' 
  | 'fat_loss' 
  | 'recomposition' 
  | 'competition' 
  | 'general_fitness';

export interface BodyMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  calves?: number;
  shoulders?: number;
  neck?: number;
}

export interface WorkoutProgram {
  id: string;
  profileId: string;
  name: string;
  duration: string;
  createdAt: string;
  days: WorkoutDay[];
}

export interface NutritionProgram {
  id: string;
  profileId: string;
  plan_name: string;
  duration: string;
  daily_calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  days: NutritionDay[];
  hydration: string;
  supplements?: string;
  createdAt: string;
}

export interface NutritionDay {
  day: string;
  meals: Meal[];
  total_calories: number;
  notes?: string;
}

export interface Meal {
  meal_name: string;
  time: string;
  foods: Food[];
  preparation?: string;
}

export interface Food {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface SupplementProgram {
  id: string;
  profileId: string;
  recommendation_title: string;
  summary: string;
  supplements: Supplement[];
  total_estimated_cost: string;
  important_notes: string;
  warnings: string;
  createdAt: string;
}

export interface Supplement {
  name: string;
  english_name: string;
  priority: string;
  dosage: string;
  timing: string;
  benefits: string;
  side_effects: string;
  estimated_cost: string;
  recommended_brands: string;
  notes: string;
}

export interface WorkoutDay {
  id: string;
  day: string;
  muscleGroups: string[];
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  tempo: string;
  notes: string;
}

export interface WorkoutSession {
  id: string;
  profileId: string;
  programId: string;
  dayId: string;
  date: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
  sets: SetRecord[];
  notes: string;
  totalVolume: number;
  rpe?: number;
}

export interface SetRecord {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  targetReps: string;
  actualWeight?: number;
  actualReps?: number;
  completed: boolean;
  rpe?: number;
  rir?: number;
}

export interface ProgressEntry {
  id: string;
  profileId: string;
  date: string;
  weight: number;
  measurements?: BodyMeasurements;
  notes: string;
}

export interface AppState {
  profiles: AthleteProfile[];
  activeProfileId: string | null;
  programs: WorkoutProgram[];
  nutritionPrograms: NutritionProgram[];
  supplementPrograms: SupplementProgram[];
  sessions: WorkoutSession[];
  progress: ProgressEntry[];
  activeProgram: string | null;
  activeNutritionProgram: string | null;
  activeSupplementProgram: string | null;
}

export const GOAL_LABELS: Record<Goal, string> = {
  hypertrophy: 'Muscle Building',
  strength: 'Strength Gain',
  fat_loss: 'Fat Loss',
  recomposition: 'Body Recomposition',
  competition: 'Competition Prep',
  general_fitness: 'General Fitness',
};

export function getGoalLabel(goal: string): string {
  return GOAL_LABELS[goal as Goal] || goal;
}

export const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  professional: 'Professional',
};

export const EQUIPMENT_OPTIONS = [
  'هالتر', 'دمبل', 'دستگاه سیم‌کش', 'دستگاه اسمیت', 'زیربغل سیم‌کش',
  'سیم‌کش پایین', 'سیم‌کش بالا', 'نیمکت', 'میله بارفیکس', 'پارالل',
  'کتل‌بل', 'تی‌آرایکس', 'کش مقاومتی', 'وزن بدن', 'پرس پا',
  'دستگاه پرس سینه', 'صفحه وزنه', 'دمبل متغیر'
];

export const MUSCLE_GROUPS = [
  'سینه', 'پشت', 'سرشانه', 'جلوبازو', 'پشت‌بازو',
  'چهارسر ران', 'همسترینگ', 'باسن', 'ساق پا', 'شکم', 'کول', 'ساعد'
];

export const PROGRAM_TYPES = {
  full_body: 'Full Body',
  split: 'Body Part Split',
  push_pull_legs: 'Push/Pull/Legs',
  upper_lower: 'Upper/Lower',
  ai_suggested: 'AI Suggested',
};

export const ACTIVITY_LEVELS = {
  sedentary: 'Sedentary (desk job)',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Very Active',
  very_active: 'Extremely Active',
};

export const EQUIPMENT_TYPES = {
  full_gym: 'Full Gym',
  home: 'Home Gym',
  park: 'Park/Outdoor',
  custom: 'Custom Setup',
};

export const DIET_TYPES = [
  'Balanced', 'High Protein', 'Low Carb', 'Mediterranean', 
  'Vegetarian', 'Vegan', 'Keto', 'Traditional Iranian'
];

export const IRANIAN_FOODS = [
  'چلو کباب', 'قورمه‌سبزی', 'قیمه', 'ته‌چین',
  'آش رشته', 'کوکو سبزی', 'فسنجان', 'زرشک‌پلو',
  'باقالی‌پلو', 'دیزی', 'آبگوشت', 'ته‌دیگ',
  'نان سنگک', 'نان لواش', 'برنج', 'عدس‌پلو',
  'ماست', 'دوغ', 'سبزی خوردن', 'گردو',
  'مرغ', 'ماهی', 'گوشت قرمز', 'تخم‌مرغ',
  'لوبیا', 'نخود', 'لentils', 'سیب‌زمینی',
  'گوجه‌فرنگی', 'خیار', 'پیاز', 'سیر'
];

export const SUPPLEMENT_CATEGORIES = [
  'پودر پروتئین', 'کراتین', 'بی‌سی‌ای‌ای', 'پری‌ورک‌اوت',
  'مولتی‌ویتامین', 'امگا ۳', 'ویتامین D', 'ZMA',
  'گلوتامین', 'بتا-آلانین', 'سیترولین', 'کافئین'
];
