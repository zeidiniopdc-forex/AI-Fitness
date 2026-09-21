import { AppState, AthleteProfile, WorkoutProgram, WorkoutSession, ProgressEntry } from '../types';

const STORAGE_KEY = 'ai_fitness_coach_data';

export function loadState(): AppState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return {
    profile: null,
    programs: [],
    sessions: [],
    progress: [],
    activeProgram: null,
  };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

export function saveProfile(profile: AthleteProfile): void {
  const state = loadState();
  state.profile = profile;
  saveState(state);
}

export function saveProgram(program: WorkoutProgram): void {
  const state = loadState();
  const existingIndex = state.programs.findIndex(p => p.id === program.id);
  if (existingIndex >= 0) {
    state.programs[existingIndex] = program;
  } else {
    state.programs.push(program);
  }
  saveState(state);
}

export function deleteProgram(programId: string): void {
  const state = loadState();
  state.programs = state.programs.filter(p => p.id !== programId);
  if (state.activeProgram === programId) {
    state.activeProgram = null;
  }
  saveState(state);
}

export function saveSession(session: WorkoutSession): void {
  const state = loadState();
  const existingIndex = state.sessions.findIndex(s => s.id === session.id);
  if (existingIndex >= 0) {
    state.sessions[existingIndex] = session;
  } else {
    state.sessions.push(session);
  }
  saveState(state);
}

export function saveProgress(entry: ProgressEntry): void {
  const state = loadState();
  state.progress.push(entry);
  saveState(state);
}

export function setActiveProgram(programId: string | null): void {
  const state = loadState();
  state.activeProgram = programId;
  saveState(state);
}
