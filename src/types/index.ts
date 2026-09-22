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
  sessions: WorkoutSession[];
  progress: ProgressEntry[];
  activeProgram: string | null;
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
  'Barbell', 'Dumbbell', 'Cable Machine', 'Smith Machine', 'Lat Pulldown',
  'Low Cable', 'High Cable', 'Bench', 'Pull-up Bar', 'Dip Station',
  'Kettlebell', 'TRX', 'Resistance Bands', 'Bodyweight', 'Leg Press',
  'Chest Press Machine', 'Weight Plates', 'Adjustable Dumbbells'
];

export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs', 'Traps', 'Forearms'
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
  'Chelo Kabab', 'Ghormeh Sabzi', 'Gheymeh', 'Tahchin',
  'Ash Reshteh', 'Kuku Sabzi', 'Fesenjan', 'Zereshk Polo',
  'Baghali Polo', 'Dizi', 'Abgoosht', 'Tahdig',
  'Sangak Bread', 'Lavash', 'Rice', 'Lentil Stew',
  'Yogurt', 'Doogh', 'Fresh Herbs', 'Walnuts'
];

export const SUPPLEMENT_CATEGORIES = [
  'Protein Powder', 'Creatine', 'BCAA', 'Pre-Workout',
  'Multivitamin', 'Omega-3', 'Vitamin D', 'ZMA',
  'Glutamine', 'Beta-Alanine', 'Citrulline', 'Caffeine'
];
