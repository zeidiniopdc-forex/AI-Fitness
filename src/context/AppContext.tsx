import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, AthleteProfile, WorkoutProgram, WorkoutSession, ProgressEntry } from '../types';
import { loadState, saveState } from '../utils/storage';

interface AppContextType {
  state: AppState;
  setProfile: (profile: AthleteProfile) => void;
  addProgram: (program: WorkoutProgram) => void;
  updateProgram: (program: WorkoutProgram) => void;
  removeProgram: (id: string) => void;
  setActiveProgram: (id: string | null) => void;
  addSession: (session: WorkoutSession) => void;
  updateSession: (session: WorkoutSession) => void;
  addProgress: (entry: ProgressEntry) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setProfile = useCallback((profile: AthleteProfile) => {
    setState(prev => ({ ...prev, profile }));
  }, []);

  const addProgram = useCallback((program: WorkoutProgram) => {
    setState(prev => ({ ...prev, programs: [...prev.programs, program] }));
  }, []);

  const updateProgram = useCallback((program: WorkoutProgram) => {
    setState(prev => ({
      ...prev,
      programs: prev.programs.map(p => p.id === program.id ? program : p)
    }));
  }, []);

  const removeProgram = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      programs: prev.programs.filter(p => p.id !== id),
      activeProgram: prev.activeProgram === id ? null : prev.activeProgram
    }));
  }, []);

  const setActiveProgram = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeProgram: id }));
  }, []);

  const addSession = useCallback((session: WorkoutSession) => {
    setState(prev => ({ ...prev, sessions: [...prev.sessions, session] }));
  }, []);

  const updateSession = useCallback((session: WorkoutSession) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === session.id ? session : s)
    }));
  }, []);

  const addProgress = useCallback((entry: ProgressEntry) => {
    setState(prev => ({ ...prev, progress: [...prev.progress, entry] }));
  }, []);

  return (
    <AppContext.Provider value={{
      state,
      setProfile,
      addProgram,
      updateProgram,
      removeProgram,
      setActiveProgram,
      addSession,
      updateSession,
      addProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
