import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, AthleteProfile, WorkoutProgram, NutritionProgram, SupplementProgram, WorkoutSession, ProgressEntry } from '../types';
import { loadState, saveState } from '../utils/storage';

interface AppContextType {
  state: AppState;
  // Profile management
  profiles: AthleteProfile[];
  activeProfile: AthleteProfile | null;
  setActiveProfile: (id: string | null) => void;
  saveProfile: (profile: AthleteProfile) => void;
  deleteProfile: (id: string) => void;
  // Workout Program management (filtered by active profile)
  programs: WorkoutProgram[];
  addProgram: (program: WorkoutProgram) => void;
  updateProgram: (program: WorkoutProgram) => void;
  removeProgram: (id: string) => void;
  setActiveProgram: (id: string | null) => void;
  // Nutrition Program management (filtered by active profile)
  nutritionPrograms: NutritionProgram[];
  addNutritionProgram: (program: NutritionProgram) => void;
  removeNutritionProgram: (id: string) => void;
  setActiveNutritionProgram: (id: string | null) => void;
  // Supplement Program management (filtered by active profile)
  supplementPrograms: SupplementProgram[];
  addSupplementProgram: (program: SupplementProgram) => void;
  removeSupplementProgram: (id: string) => void;
  setActiveSupplementProgram: (id: string | null) => void;
  // Session management (filtered by active profile)
  sessions: WorkoutSession[];
  addSession: (session: WorkoutSession) => void;
  updateSession: (session: WorkoutSession) => void;
  // Progress management (filtered by active profile)
  progress: ProgressEntry[];
  addProgress: (entry: ProgressEntry) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeProfile = useMemo(() => {
    if (!state.activeProfileId) return null;
    return state.profiles.find(p => p.id === state.activeProfileId) || null;
  }, [state.profiles, state.activeProfileId]);

  // Filtered data for active profile
  const programs = useMemo(() => 
    state.programs.filter(p => p.profileId === state.activeProfileId),
    [state.programs, state.activeProfileId]
  );

  const sessions = useMemo(() => 
    state.sessions.filter(s => s.profileId === state.activeProfileId),
    [state.sessions, state.activeProfileId]
  );

  const progress = useMemo(() => 
    state.progress.filter(p => p.profileId === state.activeProfileId),
    [state.progress, state.activeProfileId]
  );

  // Profile management
  const setActiveProfile = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeProfileId: id }));
  }, []);

  const saveProfile = useCallback((profile: AthleteProfile) => {
    setState(prev => {
      const existingIndex = prev.profiles.findIndex(p => p.id === profile.id);
      let newProfiles: AthleteProfile[];
      if (existingIndex >= 0) {
        newProfiles = [...prev.profiles];
        newProfiles[existingIndex] = profile;
      } else {
        newProfiles = [...prev.profiles, profile];
      }
      return {
        ...prev,
        profiles: newProfiles,
        activeProfileId: prev.activeProfileId || profile.id,
      };
    });
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setState(prev => {
      const newProfiles = prev.profiles.filter(p => p.id !== id);
      return {
        ...prev,
        profiles: newProfiles,
        programs: prev.programs.filter(p => p.profileId !== id),
        nutritionPrograms: prev.nutritionPrograms.filter(p => p.profileId !== id),
        supplementPrograms: prev.supplementPrograms.filter(p => p.profileId !== id),
        sessions: prev.sessions.filter(s => s.profileId !== id),
        progress: prev.progress.filter(p => p.profileId !== id),
        activeProfileId: prev.activeProfileId === id 
          ? (newProfiles.length > 0 ? newProfiles[0].id : null)
          : prev.activeProfileId,
        activeProgram: prev.programs.find(p => p.id === prev.activeProgram && p.profileId !== id) 
          ? prev.activeProgram 
          : null,
        activeNutritionProgram: prev.nutritionPrograms.find(p => p.id === prev.activeNutritionProgram && p.profileId !== id)
          ? prev.activeNutritionProgram
          : null,
        activeSupplementProgram: prev.supplementPrograms.find(p => p.id === prev.activeSupplementProgram && p.profileId !== id)
          ? prev.activeSupplementProgram
          : null,
      };
    });
  }, []);

  // Filtered data for active profile
  const nutritionPrograms = useMemo(() => 
    state.nutritionPrograms.filter(p => p.profileId === state.activeProfileId),
    [state.nutritionPrograms, state.activeProfileId]
  );

  const supplementPrograms = useMemo(() => 
    state.supplementPrograms.filter(p => p.profileId === state.activeProfileId),
    [state.supplementPrograms, state.activeProfileId]
  );

  // Workout Program management
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

  // Nutrition Program management
  const addNutritionProgram = useCallback((program: NutritionProgram) => {
    setState(prev => ({ ...prev, nutritionPrograms: [...prev.nutritionPrograms, program] }));
  }, []);

  const removeNutritionProgram = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      nutritionPrograms: prev.nutritionPrograms.filter(p => p.id !== id),
      activeNutritionProgram: prev.activeNutritionProgram === id ? null : prev.activeNutritionProgram
    }));
  }, []);

  const setActiveNutritionProgram = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeNutritionProgram: id }));
  }, []);

  // Supplement Program management
  const addSupplementProgram = useCallback((program: SupplementProgram) => {
    setState(prev => ({ ...prev, supplementPrograms: [...prev.supplementPrograms, program] }));
  }, []);

  const removeSupplementProgram = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      supplementPrograms: prev.supplementPrograms.filter(p => p.id !== id),
      activeSupplementProgram: prev.activeSupplementProgram === id ? null : prev.activeSupplementProgram
    }));
  }, []);

  const setActiveSupplementProgram = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeSupplementProgram: id }));
  }, []);

  // Session management
  const addSession = useCallback((session: WorkoutSession) => {
    setState(prev => ({ ...prev, sessions: [...prev.sessions, session] }));
  }, []);

  const updateSession = useCallback((session: WorkoutSession) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === session.id ? session : s)
    }));
  }, []);

  // Progress management
  const addProgress = useCallback((entry: ProgressEntry) => {
    setState(prev => ({ ...prev, progress: [...prev.progress, entry] }));
  }, []);

  return (
    <AppContext.Provider value={{
      state,
      profiles: state.profiles,
      activeProfile,
      setActiveProfile,
      saveProfile,
      deleteProfile,
      programs,
      addProgram,
      updateProgram,
      removeProgram,
      setActiveProgram,
      nutritionPrograms,
      addNutritionProgram,
      removeNutritionProgram,
      setActiveNutritionProgram,
      supplementPrograms,
      addSupplementProgram,
      removeSupplementProgram,
      setActiveSupplementProgram,
      sessions,
      addSession,
      updateSession,
      progress,
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
