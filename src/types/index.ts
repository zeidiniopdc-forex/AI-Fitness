export interface AthleteProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  experience: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  trainingDays: number;
  sessionDuration: number;
  location: 'gym' | 'home' | 'both';
  equipment: string[];
  injuries: string[];
  limitations: string[];
  avoidedExercises: string[];
  primaryGoal: string;
  secondaryGoal?: string;
  targetMuscles: string[];
  timeline: string;
  trainingHistory: string;
  strengthRecords: Record<string, string>;
  bodyMeasurements: BodyMeasurements;
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
  hypertrophy: 'عضله‌سازی',
  strength: 'افزایش قدرت',
  fat_loss: 'چربی‌سوزی',
  recomposition: 'بازسازی بدن',
  competition: 'آمادگی مسابقه',
  general_fitness: 'آمادگی عمومی',
};

export function getGoalLabel(goal: string): string {
  return GOAL_LABELS[goal as Goal] || goal;
}

export const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'مبتدی',
  intermediate: 'متوسط',
  advanced: 'پیشرفته',
  professional: 'حرفه‌ای',
};

export const EQUIPMENT_OPTIONS = [
  'هالتر', 'دمبل', 'کابل کراس', 'دستگاه اسمیت', 'دستگاه سیم‌کش',
  'پولی پایین', 'پولی بالا', 'نیمکت', 'بارفیکس', 'دیپ',
  'کتل‌بل', 'TRX', 'کش مقاومتی', 'وزن بدن', 'دستگاه لگ پرس',
  'دستگاه اسمیت ماشین', 'صفحه وزنه', 'دمبل قابل تنظیم'
];

export const MUSCLE_GROUPS = [
  'سینه', 'پشت', 'سرشانه', 'جلوبازو', 'پشت‌بازو',
  'چهارسر ران', 'همسترینگ', 'سرنشین', 'ساق پا', 'شکم', 'کول', 'ذوزنقه'
];
