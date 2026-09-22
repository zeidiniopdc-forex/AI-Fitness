import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { WorkoutSession, SetRecord } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Dumbbell, Timer, Check, SkipForward, Trophy, X, AlertTriangle, Play, Plus } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';

export default function WorkoutTracker() {
  const { state, activeProfile, programs, addSession, updateSession } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeProgram = programs.find(p => p.id === state.activeProgram) || programs[0];
  
  const getInitialDayIndex = () => {
    const dayParam = searchParams.get('day');
    if (dayParam !== null) return parseInt(dayParam);
    const today = new Date();
    const dayOfWeek = (today.getDay() + 1) % 7;
    return dayOfWeek % (activeProgram?.days.length || 1);
  };

  const [selectedDayIndex, setSelectedDayIndex] = useState(getInitialDayIndex());
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
    const autoStart = searchParams.get('autoStart');
    if (autoStart === 'true' && activeProgram && !workoutStarted && !session) {
      startWorkout();
    }
  }, [activeProgram, searchParams]);

  useEffect(() => {
    if (workoutStarted) {
      timerRef.current = setInterval(() => setWorkoutTime(prev => prev + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [workoutStarted]);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) { setIsResting(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (restTimerRef.current) clearInterval(restTimerRef.current); };
  }, [isResting, restTimer]);

  const startWorkout = () => {
    if (!selectedDay || !activeProfile || !activeProgram) return;
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
      profileId: activeProfile.id,
      programId: activeProgram.id,
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
    updatedSets[index] = { ...updatedSets[index], completed: true, actualWeight: weight, actualReps: reps };
    const exercise = selectedDay?.exercises.find(ex => ex.id === updatedSets[index].exerciseId);
    const volume = (weight || 0) * (reps || parseInt(exercise?.reps || '10'));
    setSession({ ...session, sets: updatedSets, totalVolume: session.totalVolume + volume });
    if (exercise) { setRestTimer(exercise.rest); setIsResting(true); }
  };

  const skipSet = (index: number) => {
    if (!session) return;
    const updatedSets = [...session.sets];
    updatedSets[index] = { ...updatedSets[index], completed: true };
    setSession({ ...session, sets: updatedSets });
  };

  const cancelWorkout = () => setShowCancelModal(true);

  const confirmCancel = () => {
    setWorkoutStarted(false);
    setSession(null);
    setShowCancelModal(false);
    setShowCancelConfirm(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (restTimerRef.current) clearInterval(restTimerRef.current);
  };

  const completeWorkout = () => {
    if (!session) return;
    addSession({ ...session, completed: true, endTime: new Date().toISOString() });
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
        <p className={`text-center max-w-md leading-7 mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {activeProfile
            ? `برای پروفایل «${activeProfile.name}» هنوز برنامه تمرینی وارد نشده است`
            : 'لطفاً ابتدا یک پروفایل انتخاب کنید'}
        </p>
        {activeProfile && (
          <button
            onClick={() => navigate('/import')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
              isDark
                ? 'bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a] shadow-lg shadow-[#d4af37]/30'
                : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white shadow-lg shadow-[#14b8a6]/30'
            }`}
          >
            <Plus size={18} />
            ورود برنامه تمرینی
          </button>
        )}
      </div>
    );
  }

  if (showCancelModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-slide-up">
        <div className={`rounded-2xl p-6 max-w-md w-full border shadow-2xl theme-transition ${
          isDark ? 'bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] border-[#ef4444]/30' : 'bg-white border-[#ef4444]/30'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#ef4444]/20 flex items-center justify-center">
              <AlertTriangle size={24} className="text-[#ef4444]" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>لغو جلسه تمرین</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>آیا مطمئن هستید؟</p>
            </div>
          </div>
          <div className={`rounded-xl p-4 mb-4 border ${isDark ? 'bg-[#0d0d1a] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>مدت زمان تمرین:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatTime(workoutTime)}</span>
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
            با لغو جلسه، اطلاعات ثبت شده تا این لحظه ذخیره نمی‌شود.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowCancelModal(false)} className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}>ادامه تمرین</button>
            <button onClick={() => { setShowCancelModal(false); setShowCancelConfirm(true); }}
              className="flex-1 bg-[#ef4444] text-white py-3 rounded-xl font-bold hover:bg-[#dc2626] transition-all">لغو تمرین</button>
          </div>
        </div>
      </div>
    );
  }

  if (showCancelConfirm) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-slide-up">
        <div className={`rounded-2xl p-6 max-w-md w-full border shadow-2xl theme-transition ${
          isDark ? 'bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] border-[#ef4444]/50' : 'bg-white border-[#ef4444]/50'
        }`}>
          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-full bg-[#ef4444]/20 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={32} className="text-[#ef4444]" />
            </div>
            <h3 className={`font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>تأیید نهایی لغو</h3>
            <p className={`text-sm leading-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              آیا واقعاً می‌خواهید جلسه تمرین را لغو کنید؟ این عمل قابل بازگشت نیست.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCancelConfirm(false)} className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}>بازگشت</button>
            <button onClick={confirmCancel}
              className="flex-1 bg-gradient-to-l from-[#ef4444] to-[#dc2626] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all">بله، لغو کن</button>
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
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>آفرین! 🎉</h2>
        <p className={`text-center mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>تمرین با موفقیت تکمیل شد</p>
        <div className={`rounded-2xl p-6 w-full max-w-sm border shadow-xl theme-transition ${
          isDark ? 'bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] border-[#d4af37]/20' : 'bg-white border-[#d4af37]/30'
        }`}>
          <div className="space-y-4">
            <div className={`flex justify-between items-center pb-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>مدت زمان</span>
              <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatTime(workoutTime)}</span>
            </div>
            <div className={`flex justify-between items-center pb-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
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
        <button onClick={() => { setShowComplete(false); setSession(null); }}
          className="mt-8 bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a] px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[#d4af37]/20">
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
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>روز تمرینی خود را انتخاب کنید</p>
          </div>
          <button
            onClick={() => navigate('/import')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isDark
                ? 'bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30'
                : 'bg-[#14b8a6]/15 text-[#0d9488] hover:bg-[#14b8a6]/25'
            }`}
          >
            <Plus size={14} />
            ورود برنامه
          </button>
        </div>

        <div className={`rounded-2xl p-5 border shadow-lg theme-transition ${
          isDark ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#d4af37]/20' : 'bg-gradient-to-l from-white to-[#fef9e7] border-[#d4af37]/30'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>برنامه فعال</p>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{activeProgram.name}</h3>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{activeProgram.duration}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#f0d060] flex items-center justify-center shadow-lg shadow-[#d4af37]/30">
              <Dumbbell size={24} className="text-[#0d0d1a]" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>انتخاب روز تمرینی</h3>
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
                      selectedDayIndex === index ? 'bg-[#d4af37] text-[#0d0d1a]' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>{toPersianNumber(index + 1)}</div>
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{day.day}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {day.muscleGroups.map((mg, i) => (
                      <span key={i} className="bg-[#4a90d9]/20 text-[#4a90d9] px-2.5 py-0.5 rounded-lg text-xs">{mg}</span>
                    ))}
                  </div>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {toPersianNumber(day.exercises.length)} تمرین • {toPersianNumber(day.exercises.reduce((a, e) => a + e.sets, 0))} ست
                  </p>
                </div>
                {selectedDayIndex === index && (
                  <div className="w-6 h-6 rounded-full bg-[#d4af37] flex items-center justify-center">
                    <Check size={14} className="text-[#0d0d1a]" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedDay && (
          <button
            onClick={startWorkout}
            className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 bg-gradient-to-l from-[#d4af37] to-[#f0d060] text-[#0d0d1a] shadow-lg shadow-[#d4af37]/30 hover:opacity-90 transition-all"
          >
            <Play size={20} />
            شروع تمرین — {selectedDay.day}
          </button>
        )}
      </div>
    );
  }

  // Active workout UI
  const completedSets = session?.sets.filter(s => s.completed).length || 0;
  const totalSets = session?.sets.length || 0;
  const progressPct = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl p-4 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#d4af37]/20' : 'bg-white border-[#d4af37]/30'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedDay?.day}</h2>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formatTime(workoutTime)}</p>
          </div>
          <button onClick={cancelWorkout} className="text-[#ef4444] p-2 hover:bg-[#ef4444]/10 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div className="h-full rounded-full bg-gradient-to-l from-[#d4af37] to-[#f0d060] transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {toPersianNumber(completedSets)} از {toPersianNumber(totalSets)} ست • {toPersianNumber(session?.totalVolume || 0)} kg
        </p>
      </div>

      {isResting && restTimer > 0 && (
        <div className={`rounded-2xl p-4 border text-center ${isDark ? 'bg-[#4a90d9]/10 border-[#4a90d9]/30' : 'bg-blue-50 border-blue-200'}`}>
          <Timer size={24} className={`mx-auto mb-2 ${isDark ? 'text-[#4a90d9]' : 'text-blue-600'}`} />
          <p className={`font-bold text-2xl ${isDark ? 'text-[#4a90d9]' : 'text-blue-600'}`}>{formatTime(restTimer)}</p>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>استراحت</p>
          <button onClick={() => { setIsResting(false); setRestTimer(0); }}
            className={`mt-2 text-xs px-3 py-1 rounded-full ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
            رد کردن استراحت
          </button>
        </div>
      )}

      {selectedDay?.exercises.map((ex, ei) => {
        const exerciseSets = session?.sets.filter(s => s.exerciseId === ex.id) || [];
        return (
          <div key={ex.id} className={`rounded-2xl p-4 border theme-transition ${
            isDark ? 'bg-[#1a1a2e] border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{ex.name}</h3>
            <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {toPersianNumber(ex.sets)} ست × {ex.reps} • استراحت {toPersianNumber(ex.rest)}ث
              {ex.notes && ` • ${ex.notes}`}
            </p>
            <div className="space-y-2">
              {exerciseSets.map((set, si) => {
                const globalIndex = session!.sets.findIndex(s => s === set);
                return (
                  <SetRow
                    key={si}
                    set={set}
                    index={globalIndex}
                    isDark={isDark}
                    onComplete={completeSet}
                    onSkip={skipSet}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {completedSets === totalSets && totalSets > 0 && (
        <button onClick={completeWorkout}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-l from-[#22c55e] to-[#16a34a] text-white shadow-lg shadow-[#22c55e]/30 hover:opacity-90 transition-all">
          <Trophy size={18} className="inline ml-2" />
          تکمیل تمرین
        </button>
      )}
    </div>
  );
}

function SetRow({ set, index, isDark, onComplete, onSkip }: {
  set: SetRecord; index: number; isDark: boolean;
  onComplete: (i: number, w?: number, r?: number) => void;
  onSkip: (i: number) => void;
}) {
  const [weight, setWeight] = useState<string | number>('');
  const [reps, setReps] = useState<string | number>('');

  if (set.completed) {
    return (
      <div className={`rounded-xl px-3 py-3 border ${isDark ? 'bg-[#22c55e]/10 border-[#22c55e]/20' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>ست {toPersianNumber(set.setNumber)}</span>
          <div className="text-[#22c55e] text-sm font-bold">
            {set.actualWeight ? `${toPersianNumber(set.actualWeight)} kg` : '-'} × {set.actualReps ? toPersianNumber(set.actualReps) : set.targetReps}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 rounded-xl px-3 py-3 border theme-transition ${
      isDark ? 'bg-[#0d0d1a] border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
        isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
      }`}>{toPersianNumber(set.setNumber)}</div>
      <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
        placeholder="وزن"
        className={`w-16 border rounded-lg px-2 py-1.5 text-xs text-center focus:border-[#d4af37] focus:outline-none ${
          isDark ? 'bg-[#1a1a2e] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
        }`} dir="ltr" />
      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>×</span>
      <input type="number" value={reps} onChange={e => setReps(e.target.value)}
        placeholder="تکرار"
        className={`w-14 border rounded-lg px-2 py-1.5 text-xs text-center focus:border-[#d4af37] focus:outline-none ${
          isDark ? 'bg-[#1a1a2e] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
        }`} dir="ltr" />
      <button onClick={() => onComplete(index, Number(weight) || undefined, Number(reps) || undefined)}
        className="bg-[#22c55e] text-white p-2 rounded-lg hover:bg-[#16a34a] transition-all ml-auto shadow-lg shadow-[#22c55e]/20">
        <Check size={14} />
      </button>
      <button onClick={() => onSkip(index)}
        className={`p-2 rounded-lg transition-all ${
          isDark ? 'text-gray-500 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-200'
        }`}>
        <SkipForward size={14} />
      </button>
    </div>
  );
}
