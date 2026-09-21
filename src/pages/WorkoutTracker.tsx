import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { WorkoutSession, SetRecord } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Dumbbell, Timer, Check, SkipForward, Trophy, ChevronDown } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';

export default function WorkoutTracker() {
  const { state, addSession, updateSession } = useAppContext();
  const activeProgram = state.programs.find(p => p.id === state.activeProgram);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedDay = activeProgram?.days[selectedDayIndex];

  useEffect(() => {
    if (workoutStarted) {
      timerRef.current = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [workoutStarted]);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (restTimerRef.current) clearInterval(restTimerRef.current); };
  }, [isResting, restTimer]);

  const startWorkout = () => {
    if (!selectedDay) return;
    const sets: SetRecord[] = [];
    selectedDay.exercises.forEach(ex => {
      for (let i = 1; i <= ex.sets; i++) {
        sets.push({
          exerciseId: ex.id,
          exerciseName: ex.name,
          setNumber: i,
          targetReps: ex.reps,
          completed: false,
        });
      }
    });
    
    const newSession: WorkoutSession = {
      id: uuidv4(),
      programId: activeProgram!.id,
      dayId: selectedDay.id,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      completed: false,
      sets,
      notes: '',
      totalVolume: 0,
    };
    setSession(newSession);
    setWorkoutStarted(true);
    setWorkoutTime(0);
  };

  const completeSet = (index: number, weight?: number, reps?: number) => {
    if (!session) return;
    const updatedSets = [...session.sets];
    updatedSets[index] = {
      ...updatedSets[index],
      completed: true,
      actualWeight: weight,
      actualReps: reps,
    };
    
    const exercise = selectedDay?.exercises.find(ex => ex.id === updatedSets[index].exerciseId);
    const volume = (weight || 0) * (reps || parseInt(exercise?.reps || '10'));
    
    setSession({
      ...session,
      sets: updatedSets,
      totalVolume: session.totalVolume + volume,
    });

    // Start rest timer
    if (exercise) {
      setRestTimer(exercise.rest);
      setIsResting(true);
    }
  };

  const skipSet = (index: number) => {
    if (!session) return;
    const updatedSets = [...session.sets];
    updatedSets[index] = { ...updatedSets[index], completed: true };
    setSession({ ...session, sets: updatedSets });
  };

  const completeWorkout = () => {
    if (!session) return;
    const completedSession: WorkoutSession = {
      ...session,
      completed: true,
      endTime: new Date().toISOString(),
    };
    addSession(completedSession);
    setWorkoutStarted(false);
    setShowComplete(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${toPersianNumber(String(mins).padStart(2, '0'))}:${toPersianNumber(String(secs).padStart(2, '0'))}`;
  };

  if (!activeProgram) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Dumbbell size={48} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">برنامه‌ای فعال نیست</h2>
        <p className="text-gray-400 text-center">لطفاً ابتدا یک برنامه تمرینی وارد و فعال کنید</p>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-10 animate-slide-up">
        <div className="w-20 h-20 rounded-full bg-[#22c55e]/20 flex items-center justify-center mb-4">
          <Trophy size={40} className="text-[#22c55e]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">آفرین! 🎉</h2>
        <p className="text-gray-400 text-center mb-6">تمرین با موفقیت تکمیل شد</p>
        <div className="bg-[#1a1a2e] rounded-2xl p-5 w-full max-w-sm border border-[#d4af37]/10">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">مدت زمان</span>
              <span className="text-white font-bold">{formatTime(workoutTime)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">ست‌های انجام شده</span>
              <span className="text-white font-bold">{toPersianNumber(session?.sets.filter(s => s.completed).length || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">حجم کل</span>
              <span className="text-[#d4af37] font-bold">{toPersianNumber(session?.totalVolume || 0)} کیلو</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => { setShowComplete(false); setSession(null); }}
          className="mt-6 bg-[#d4af37] text-[#0d0d1a] px-6 py-3 rounded-xl font-bold hover:bg-[#f0d060] transition-all"
        >
          بازگشت
        </button>
      </div>
    );
  }

  if (!workoutStarted) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Dumbbell size={22} className="text-[#d4af37]" />
          شروع تمرین
        </h2>

        {/* Program Info */}
        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
          <h3 className="text-[#d4af37] font-bold mb-3">{activeProgram.name}</h3>
          <p className="text-gray-400 text-sm">{activeProgram.duration}</p>
        </div>

        {/* Day Selection */}
        <div className="space-y-3">
          <h3 className="text-white font-bold">انتخاب روز تمرینی</h3>
          {activeProgram.days.map((day, index) => (
            <button
              key={day.id}
              onClick={() => setSelectedDayIndex(index)}
              className={`w-full text-right bg-[#1a1a2e] rounded-xl p-4 border transition-all ${
                selectedDayIndex === index ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold">{day.day}</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {day.muscleGroups.map((mg, i) => (
                      <span key={i} className="bg-[#4a90d9]/20 text-[#4a90d9] px-2 py-0.5 rounded text-xs">{mg}</span>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">{toPersianNumber(day.exercises.length)} تمرین</p>
                </div>
                <ChevronDown size={18} className="text-gray-500" />
              </div>
            </button>
          ))}
        </div>

        {/* Start Button */}
        {selectedDay && (
          <button
            onClick={startWorkout}
            className="w-full bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a] py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all animate-pulse-gold"
          >
            🏋️ شروع تمرین
          </button>
        )}
      </div>
    );
  }

  // Active Workout View
  return (
    <div className="space-y-4">
      {/* Workout Header */}
      <div className="bg-[#1a1a2e] rounded-2xl p-4 border border-[#d4af37]/10 sticky top-14 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">{selectedDay?.day}</h3>
            <p className="text-gray-400 text-sm">{formatTime(workoutTime)}</p>
          </div>
          <div className="flex items-center gap-3">
            {isResting && (
              <div className="bg-[#4a90d9]/20 text-[#4a90d9] px-3 py-1.5 rounded-lg font-bold text-sm animate-pulse">
                استراحت: {formatTime(restTimer)}
              </div>
            )}
            <button
              onClick={completeWorkout}
              className="bg-[#22c55e] text-white px-4 py-2 rounded-lg font-bold text-sm"
            >
              پایان
            </button>
          </div>
        </div>
      </div>

      {/* Rest Timer Overlay */}
      {isResting && (
        <div className="bg-[#4a90d9]/10 border border-[#4a90d9]/30 rounded-xl p-4 text-center">
          <Timer size={24} className="text-[#4a90d9] mx-auto mb-2" />
          <p className="text-[#4a90d9] font-bold text-3xl">{formatTime(restTimer)}</p>
          <p className="text-gray-400 text-sm mt-1">زمان استراحت</p>
          <div className="flex gap-2 mt-3 justify-center">
            <button
              onClick={() => setIsResting(false)}
              className="text-xs bg-gray-700 text-white px-3 py-1 rounded"
            >
              رد شدن
            </button>
            <button
              onClick={() => setRestTimer(prev => prev + 30)}
              className="text-xs bg-[#4a90d9]/30 text-[#4a90d9] px-3 py-1 rounded"
            >
              +۳۰ ثانیه
            </button>
          </div>
        </div>
      )}

      {/* Exercises */}
      {selectedDay?.exercises.map((exercise) => {
        const exerciseSets = session?.sets.filter(s => s.exerciseId === exercise.id) || [];
        return (
          <div key={exercise.id} className="bg-[#1a1a2e] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold">{exercise.name}</h4>
              <span className="text-gray-400 text-xs">
                {toPersianNumber(exercise.sets)}×{exercise.reps} | استراحت: {toPersianNumber(exercise.rest)}ث
              </span>
            </div>
            {exercise.tempo && (
              <p className="text-gray-500 text-xs mb-2">تمپو: {exercise.tempo}</p>
            )}
            
            <div className="space-y-2">
              {exerciseSets.map((set, idx) => {
                const globalIdx = session?.sets.indexOf(set) || 0;
                return (
                  <SetRow
                    key={idx}
                    set={set}
                    index={globalIdx}
                    onComplete={completeSet}
                    onSkip={skipSet}
                  />
                );
              })}
            </div>
            
            {exercise.notes && (
              <p className="text-gray-500 text-xs mt-2 border-t border-gray-800 pt-2">📝 {exercise.notes}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SetRow({ set, index, onComplete, onSkip }: { 
  set: SetRecord; 
  index: number; 
  onComplete: (index: number, weight?: number, reps?: number) => void;
  onSkip: (index: number) => void;
}) {
  const [weight, setWeight] = useState(set.actualWeight || '');
  const [reps, setReps] = useState(set.actualReps || '');

  if (set.completed) {
    return (
      <div className="flex items-center gap-3 bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-lg px-3 py-2">
        <Check size={16} className="text-[#22c55e]" />
        <span className="text-[#22c55e] text-sm">
          ست {toPersianNumber(set.setNumber)} - {set.actualWeight ? `${toPersianNumber(set.actualWeight)}kg` : '-'} × {set.actualReps ? toPersianNumber(set.actualReps) : set.targetReps}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-[#0d0d1a] rounded-lg px-3 py-2">
      <span className="text-gray-400 text-xs w-12">ست {toPersianNumber(set.setNumber)}</span>
      <input
        type="number"
        value={weight}
        onChange={e => setWeight(e.target.value as any)}
        placeholder="وزن"
        className="w-16 bg-[#1a1a2e] border border-gray-700 rounded px-2 py-1 text-white text-xs text-center focus:border-[#d4af37] focus:outline-none"
        dir="ltr"
      />
      <span className="text-gray-500 text-xs">×</span>
      <input
        type="number"
        value={reps}
        onChange={e => setReps(e.target.value as any)}
        placeholder="تکرار"
        className="w-14 bg-[#1a1a2e] border border-gray-700 rounded px-2 py-1 text-white text-xs text-center focus:border-[#d4af37] focus:outline-none"
        dir="ltr"
      />
      <button
        onClick={() => onComplete(index, Number(weight) || undefined, Number(reps) || undefined)}
        className="bg-[#22c55e] text-white p-1.5 rounded hover:bg-[#16a34a] transition-all mr-auto"
      >
        <Check size={14} />
      </button>
      <button
        onClick={() => onSkip(index)}
        className="text-gray-500 p-1.5 hover:text-white transition-all"
      >
        <SkipForward size={14} />
      </button>
    </div>
  );
}
