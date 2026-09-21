import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { WorkoutSession, SetRecord } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Dumbbell, Timer, Check, SkipForward, Trophy, X, AlertTriangle, Play } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';

export default function WorkoutTracker() {
  const { state, addSession, updateSession } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const activeProgram = state.programs.find(p => p.id === state.activeProgram);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
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

  const cancelWorkout = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (!session) return;
    const cancelledSession: WorkoutSession = {
      ...session,
      completed: false,
      endTime: new Date().toISOString(),
      notes: '❌ جلسه لغو شد',
    };
    addSession(cancelledSession);
    setWorkoutStarted(false);
    setSession(null);
    setShowCancelModal(false);
    setShowCancelConfirm(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (restTimerRef.current) clearInterval(restTimerRef.current);
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
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          isDark ? 'bg-gradient-to-br from-[#d4af37]/20 to-transparent' : 'bg-gradient-to-br from-[#d4af37]/10 to-transparent'
        }`}>
          <Dumbbell size={48} className={isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'} />
        </div>
        <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          برنامه‌ای فعال نیست
        </h2>
        <p className={`text-center max-w-md leading-7 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          لطفاً ابتدا یک برنامه تمرینی در بخش «ورود برنامه» وارد و فعال کنید
        </p>
      </div>
    );
  }

  // Cancel Modal
  if (showCancelModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-slide-up">
        <div className={`rounded-2xl p-6 max-w-md w-full border shadow-2xl theme-transition ${
          isDark 
            ? 'bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] border-[#ef4444]/30' 
            : 'bg-white border-[#ef4444]/30'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#ef4444]/20 flex items-center justify-center">
              <AlertTriangle size={24} className="text-[#ef4444]" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                لغو جلسه تمرین
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                آیا مطمئن هستید؟
              </p>
            </div>
          </div>
          
          <div className={`rounded-xl p-4 mb-4 border theme-transition ${
            isDark ? 'bg-[#0d0d1a] border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>مدت زمان تمرین:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatTime(workoutTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>ست‌های انجام شده:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {toPersianNumber(session?.sets.filter(s => s.completed).length || 0)} از {toPersianNumber(session?.sets.length || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>حجم فعلی:</span>
                <span className={`font-bold ${isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'}`}>
                  {toPersianNumber(session?.totalVolume || 0)} kg
                </span>
              </div>
            </div>
          </div>

          <p className={`text-sm mb-5 leading-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            با لغو جلسه، اطلاعات ثبت شده تا این لحظه به عنوان «جلسه لغو شده» ذخیره می‌شود و در آمار شما محاسبه نخواهد شد.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelModal(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              ادامه تمرین
            </button>
            <button
              onClick={() => { setShowCancelModal(false); setShowCancelConfirm(true); }}
              className="flex-1 bg-[#ef4444] text-white py-3 rounded-xl font-bold hover:bg-[#dc2626] transition-all"
            >
              لغو تمرین
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Second confirmation
  if (showCancelConfirm) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-slide-up">
        <div className={`rounded-2xl p-6 max-w-md w-full border shadow-2xl theme-transition ${
          isDark 
            ? 'bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] border-[#ef4444]/50' 
            : 'bg-white border-[#ef4444]/50'
        }`}>
          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-full bg-[#ef4444]/20 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={32} className="text-[#ef4444]" />
            </div>
            <h3 className={`font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              تأیید نهایی لغو
            </h3>
            <p className={`text-sm leading-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              آیا واقعاً می‌خواهید جلسه تمرین را لغو کنید؟ این عمل قابل بازگشت نیست.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelConfirm(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              بازگشت
            </button>
            <button
              onClick={confirmCancel}
              className="flex-1 bg-gradient-to-l from-[#ef4444] to-[#dc2626] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              بله، لغو کن
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-10 animate-slide-up">
        <div className="relative mb-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            isDark ? 'bg-gradient-to-br from-[#22c55e]/30 to-transparent' : 'bg-gradient-to-br from-[#22c55e]/20 to-transparent'
          }`}>
            <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
              <Trophy size={40} className="text-[#22c55e]" />
            </div>
          </div>
          <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#d4af37] flex items-center justify-center text-xs font-bold text-[#0d0d1a]">
            ✓
          </div>
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          آفرین! 🎉
        </h2>
        <p className={`text-center mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          تمرین با موفقیت تکمیل شد
        </p>
        
        <div className={`rounded-2xl p-6 w-full max-w-sm border shadow-xl theme-transition ${
          isDark 
            ? 'bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] border-[#d4af37]/20' 
            : 'bg-white border-[#d4af37]/30'
        }`}>
          <div className="space-y-4">
            <div className={`flex justify-between items-center pb-3 border-b theme-transition ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>مدت زمان</span>
              <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatTime(workoutTime)}
              </span>
            </div>
            <div className={`flex justify-between items-center pb-3 border-b theme-transition ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>ست‌های انجام شده</span>
              <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {toPersianNumber(session?.sets.filter(s => s.completed).length || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>حجم کل</span>
              <span className={`font-bold text-lg ${isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'}`}>
                {toPersianNumber(session?.totalVolume || 0)} kg
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => { setShowComplete(false); setSession(null); }}
          className="mt-8 bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a] px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[#d4af37]/20"
        >
          بازگشت به خانه
        </button>
      </div>
    );
  }

  if (!workoutStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Dumbbell size={24} className={isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'} />
              شروع تمرین
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              روز تمرینی خود را انتخاب کنید
            </p>
          </div>
        </div>

        {/* Program Info */}
        <div className={`rounded-2xl p-5 border shadow-lg theme-transition ${
          isDark 
            ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#d4af37]/20' 
            : 'bg-gradient-to-l from-white to-[#fef9e7] border-[#d4af37]/30'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>برنامه فعال</p>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {activeProgram.name}
              </h3>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {activeProgram.duration}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#f0d060] flex items-center justify-center shadow-lg shadow-[#d4af37]/30">
              <Dumbbell size={24} className="text-[#0d0d1a]" />
            </div>
          </div>
        </div>

        {/* Day Selection */}
        <div className="space-y-3">
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            انتخاب روز تمرینی
          </h3>
          {activeProgram.days.map((day, index) => (
            <button
              key={day.id}
              onClick={() => setSelectedDayIndex(index)}
              className={`w-full text-right rounded-2xl p-5 border transition-all theme-transition ${
                selectedDayIndex === index 
                  ? isDark
                    ? 'border-[#d4af37] bg-gradient-to-l from-[#d4af37]/10 to-transparent shadow-lg shadow-[#d4af37]/10'
                    : 'border-[#d4af37] bg-gradient-to-l from-[#d4af37]/10 to-white shadow-lg shadow-[#d4af37]/10'
                  : isDark
                    ? 'border-gray-800 bg-[#1a1a2e] hover:border-gray-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      selectedDayIndex === index 
                        ? 'bg-[#d4af37] text-[#0d0d1a]' 
                        : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {toPersianNumber(index + 1)}
                    </div>
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {day.day}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {day.muscleGroups.map((mg, i) => (
                      <span key={i} className="bg-[#4a90d9]/20 text-[#4a90d9] px-2.5 py-0.5 rounded-lg text-xs">
                        {mg}
                      </span>
                    ))}
                  </div>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    {toPersianNumber(day.exercises.length)} تمرین • {toPersianNumber(day.exercises.reduce((acc, ex) => acc + ex.sets, 0))} ست
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Start Button */}
        {selectedDay && (
          <button
            onClick={startWorkout}
            className="w-full bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a] py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-[#d4af37]/30 flex items-center justify-center gap-2"
          >
            <Play size={20} fill="currentColor" />
            🏋️ شروع تمرین
          </button>
        )}
      </div>
    );
  }

  // Active Workout View
  const completedSetsCount = session?.sets.filter(s => s.completed).length || 0;
  const totalSetsCount = session?.sets.length || 0;
  const progressPercent = totalSetsCount > 0 ? (completedSetsCount / totalSetsCount) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Workout Header */}
      <div className={`rounded-2xl p-4 border shadow-lg sticky top-0 z-30 theme-transition ${
        isDark 
          ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#d4af37]/20' 
          : 'bg-gradient-to-l from-white to-[#fef9e7] border-[#d4af37]/30'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedDay?.day}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Timer size={14} />
                <span className="font-mono">{formatTime(workoutTime)}</span>
              </div>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {toPersianNumber(completedSetsCount)} / {toPersianNumber(totalSetsCount)} ست
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cancelWorkout}
              className="flex items-center gap-1 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 px-3 py-2 rounded-xl font-bold text-sm hover:bg-[#ef4444]/20 transition-all"
              title="لغو تمرین"
            >
              <X size={16} />
              <span className="hidden sm:inline">لغو</span>
            </button>
            <button
              onClick={completeWorkout}
              className="flex items-center gap-1 bg-[#22c55e] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#16a34a] transition-all shadow-lg shadow-[#22c55e]/20"
            >
              <Check size={16} />
              <span className="hidden sm:inline">پایان</span>
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className={`w-full h-2 rounded-full overflow-hidden theme-transition ${
          isDark ? 'bg-gray-800' : 'bg-gray-200'
        }`}>
          <div 
            className="h-full bg-gradient-to-l from-[#d4af37] to-[#22c55e] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Rest Timer Overlay */}
      {isResting && (
        <div className="bg-gradient-to-l from-[#4a90d9]/10 to-transparent border border-[#4a90d9]/30 rounded-2xl p-5 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer size={20} className="text-[#4a90d9]" />
            <p className="text-[#4a90d9] font-bold text-sm">زمان استراحت</p>
          </div>
          <p className="text-[#4a90d9] font-bold text-4xl font-mono">{formatTime(restTimer)}</p>
          <div className="flex gap-2 mt-4 justify-center">
            <button
              onClick={() => setIsResting(false)}
              className="text-xs bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              رد شدن
            </button>
            <button
              onClick={() => setRestTimer(prev => prev + 30)}
              className="text-xs bg-[#4a90d9]/30 text-[#4a90d9] px-4 py-2 rounded-lg hover:bg-[#4a90d9]/40 transition-all"
            >
              +۳۰ ثانیه
            </button>
          </div>
        </div>
      )}

      {/* Exercises */}
      {selectedDay?.exercises.map((exercise) => {
        const exerciseSets = session?.sets.filter(s => s.exerciseId === exercise.id) || [];
        const exerciseCompleted = exerciseSets.filter(s => s.completed).length;
        const exerciseTotal = exerciseSets.length;
        
        return (
          <div key={exercise.id} className={`rounded-2xl p-5 border shadow-lg theme-transition ${
            isDark 
              ? 'bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border-gray-800' 
              : 'bg-gradient-to-b from-white to-[#fef9e7] border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {exercise.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-bold ${isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'}`}>
                    {toPersianNumber(exerciseCompleted)}/{toPersianNumber(exerciseTotal)}
                  </span>
                  <span className={isDark ? 'text-gray-500 text-xs' : 'text-gray-400 text-xs'}>•</span>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {toPersianNumber(exercise.sets)}×{exercise.reps}
                  </span>
                </div>
              </div>
              <div className="text-left">
                <span className={`text-xs block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>استراحت</span>
                <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {toPersianNumber(exercise.rest)}ث
                </span>
              </div>
            </div>
            
            {exercise.tempo && (
              <div className={`rounded-lg px-3 py-1.5 mb-3 inline-block theme-transition ${
                isDark ? 'bg-[#0d0d1a]' : 'bg-gray-100'
              }`}>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>تمپو: </span>
                <span className={`text-xs font-mono ${isDark ? 'text-[#d4af37]' : 'text-[#b8941f]'}`}>
                  {exercise.tempo}
                </span>
              </div>
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
                    isDark={isDark}
                  />
                );
              })}
            </div>
            
            {exercise.notes && (
              <div className={`mt-3 pt-3 border-t theme-transition ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  📝 {exercise.notes}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SetRow({ set, index, onComplete, onSkip, isDark }: { 
  set: SetRecord; 
  index: number; 
  onComplete: (index: number, weight?: number, reps?: number) => void;
  onSkip: (index: number) => void;
  isDark: boolean;
}) {
  const [weight, setWeight] = useState(set.actualWeight || '');
  const [reps, setReps] = useState(set.actualReps || '');

  if (set.completed) {
    return (
      <div className={`flex items-center gap-3 rounded-xl px-4 py-3 theme-transition ${
        isDark 
          ? 'bg-[#22c55e]/5 border border-[#22c55e]/20' 
          : 'bg-[#22c55e]/10 border border-[#22c55e]/30'
      }`}>
        <div className="w-7 h-7 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
          <Check size={14} className="text-[#22c55e]" />
        </div>
        <div className="flex-1">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            ست {toPersianNumber(set.setNumber)}
          </span>
          <div className="text-[#22c55e] text-sm font-bold">
            {set.actualWeight ? `${toPersianNumber(set.actualWeight)} kg` : '-'} × {set.actualReps ? toPersianNumber(set.actualReps) : set.targetReps}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 rounded-xl px-3 py-3 border theme-transition ${
      isDark 
        ? 'bg-[#0d0d1a] border-gray-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold theme-transition ${
        isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
      }`}>
        {toPersianNumber(set.setNumber)}
      </div>
      <input
        type="number"
        value={weight}
        onChange={e => setWeight(e.target.value as any)}
        placeholder="وزن"
        className={`w-16 border rounded-lg px-2 py-1.5 text-xs text-center focus:border-[#d4af37] focus:outline-none theme-transition ${
          isDark 
            ? 'bg-[#1a1a2e] border-gray-700 text-white' 
            : 'bg-gray-50 border-gray-300 text-gray-900'
        }`}
        dir="ltr"
      />
      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>×</span>
      <input
        type="number"
        value={reps}
        onChange={e => setReps(e.target.value as any)}
        placeholder="تکرار"
        className={`w-14 border rounded-lg px-2 py-1.5 text-xs text-center focus:border-[#d4af37] focus:outline-none theme-transition ${
          isDark 
            ? 'bg-[#1a1a2e] border-gray-700 text-white' 
            : 'bg-gray-50 border-gray-300 text-gray-900'
        }`}
        dir="ltr"
      />
      <button
        onClick={() => onComplete(index, Number(weight) || undefined, Number(reps) || undefined)}
        className="bg-[#22c55e] text-white p-2 rounded-lg hover:bg-[#16a34a] transition-all ml-auto shadow-lg shadow-[#22c55e]/20"
      >
        <Check size={14} />
      </button>
      <button
        onClick={() => onSkip(index)}
        className={`p-2 rounded-lg transition-all theme-transition ${
          isDark 
            ? 'text-gray-500 hover:text-white hover:bg-gray-800' 
            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-200'
        }`}
      >
        <SkipForward size={14} />
      </button>
    </div>
  );
}
