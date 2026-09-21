import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { validateWorkoutJSON } from '../utils/promptGenerator';
import { WorkoutProgram, WorkoutDay, Exercise } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Import as ImportIcon, Check, AlertCircle, Trash2, Save, Eye } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';

export default function ProgramImport() {
  const { state, addProgram, removeProgram, setActiveProgram } = useAppContext();
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; data?: any; error?: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imported, setImported] = useState(false);

  const handleValidate = () => {
    const result = validateWorkoutJSON(jsonInput);
    setValidationResult(result);
    if (result.valid) {
      setShowPreview(true);
    }
  };

  const handleImport = () => {
    if (!validationResult?.valid || !validationResult.data) return;
    
    const program: WorkoutProgram = {
      id: uuidv4(),
      name: validationResult.data.program_name,
      duration: validationResult.data.duration,
      createdAt: new Date().toISOString(),
      days: validationResult.data.days.map((day: any) => ({
        id: uuidv4(),
        day: day.day,
        muscleGroups: day.muscle_groups || [],
        exercises: day.exercises.map((ex: any) => ({
          id: uuidv4(),
          name: ex.name,
          sets: parseInt(ex.sets) || 4,
          reps: ex.reps,
          rest: parseInt(ex.rest) || 90,
          tempo: ex.tempo || '',
          notes: ex.notes || '',
        })),
      })),
    };

    addProgram(program);
    setImported(true);
    setJsonInput('');
    setValidationResult(null);
    setShowPreview(false);
    setTimeout(() => setImported(false), 3000);
  };

  const sampleJSON = JSON.stringify({
    "program_name": "برنامه عضله‌سازی ۴ روزه",
    "duration": "۸ هفته",
    "days": [
      {
        "day": "روز اول - سینه و پشت‌بازو",
        "muscle_groups": ["سینه", "پشت‌بازو"],
        "exercises": [
          {
            "name": "پرس سینه هالتر",
            "sets": "4",
            "reps": "8-10",
            "rest": "120",
            "tempo": "3-1-1-0",
            "notes": "کنترل کامل در فاز منفی"
          },
          {
            "name": "پرس بالا سینه دمبل",
            "sets": "3",
            "reps": "10-12",
            "rest": "90",
            "tempo": "2-1-1-0",
            "notes": "انقباض در بالا"
          }
        ]
      }
    ]
  }, null, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <ImportIcon size={22} className="text-[#22c55e]" />
        ورود برنامه تمرینی
      </h2>

      {/* Success Message */}
      {imported && (
        <div className="bg-[#22c55e]/20 border border-[#22c55e]/30 rounded-xl p-4 flex items-center gap-3 animate-slide-up">
          <Check size={20} className="text-[#22c55e]" />
          <span className="text-[#22c55e] font-bold">برنامه با موفقیت وارد شد!</span>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
        <h3 className="text-[#d4af37] font-bold mb-3">JSON برنامه تمرینی</h3>
        <p className="text-gray-400 text-sm mb-3">
          خروجی هوش مصنوعی را در قالب JSON وارد کنید:
        </p>
        <textarea
          value={jsonInput}
          onChange={e => { setJsonInput(e.target.value); setValidationResult(null); setShowPreview(false); }}
          className="w-full bg-[#0d0d1a] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm font-mono focus:border-[#d4af37] focus:outline-none resize-none"
          rows={10}
          dir="ltr"
          placeholder='{"program_name": "...", "days": [...]}'
        />
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleValidate}
            disabled={!jsonInput.trim()}
            className="flex items-center gap-2 bg-[#4a90d9] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#6bb5ff] disabled:opacity-50 transition-all"
          >
            <Eye size={16} />
            اعتبارسنجی و پیش‌نمایش
          </button>
          <button
            onClick={() => setJsonInput(sampleJSON)}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm hover:bg-gray-600 transition-all"
          >
            نمونه JSON
          </button>
        </div>
      </div>

      {/* Validation Result */}
      {validationResult && !validationResult.valid && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-[#ef4444] mt-0.5" />
          <div>
            <p className="text-[#ef4444] font-bold">خطا در اعتبارسنجی</p>
            <p className="text-gray-400 text-sm mt-1">{validationResult.error}</p>
          </div>
        </div>
      )}

      {/* Preview */}
      {showPreview && validationResult?.valid && (
        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#22c55e]/20 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#22c55e] font-bold flex items-center gap-2">
              <Check size={18} />
              پیش‌نمایش برنامه
            </h3>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 bg-[#22c55e] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#16a34a] transition-all"
            >
              <Save size={16} />
              ذخیره برنامه
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">نام برنامه:</span>
              <span className="text-white font-bold">{validationResult.data.program_name}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">مدت:</span>
              <span className="text-white">{validationResult.data.duration}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">تعداد روزها:</span>
              <span className="text-white">{toPersianNumber(validationResult.data.days.length)} روز</span>
            </div>

            <div className="border-t border-gray-700 pt-4 mt-4">
              {validationResult.data.days.map((day: any, i: number) => (
                <div key={i} className="mb-4 bg-[#0d0d1a] rounded-xl p-4">
                  <h4 className="text-[#d4af37] font-bold mb-2">{day.day}</h4>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(day.muscle_groups || []).map((mg: string, j: number) => (
                      <span key={j} className="bg-[#4a90d9]/20 text-[#4a90d9] px-2 py-0.5 rounded text-xs">{mg}</span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {(day.exercises || []).map((ex: any, k: number) => (
                      <div key={k} className="flex items-center justify-between text-sm border-b border-gray-800 pb-2">
                        <span className="text-white">{ex.name}</span>
                        <span className="text-gray-400">
                          {toPersianNumber(ex.sets)}×{ex.reps} | استراحت: {toPersianNumber(ex.rest)}ث
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved Programs */}
      {state.programs.length > 0 && (
        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#d4af37]/10">
          <h3 className="text-[#d4af37] font-bold mb-4">برنامه‌های ذخیره شده</h3>
          <div className="space-y-3">
            {state.programs.map(program => (
              <div
                key={program.id}
                className={`bg-[#0d0d1a] rounded-xl p-4 border ${
                  state.activeProgram === program.id ? 'border-[#22c55e]/50' : 'border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold">{program.name}</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {program.duration} • {toPersianNumber(program.days.length)} روز • {toPersianNumber(program.days.reduce((acc, d) => acc + d.exercises.length, 0))} تمرین
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {state.activeProgram === program.id ? (
                      <span className="text-xs bg-[#22c55e]/20 text-[#22c55e] px-2 py-1 rounded-full">فعال</span>
                    ) : (
                      <button
                        onClick={() => setActiveProgram(program.id)}
                        className="text-xs bg-[#4a90d9]/20 text-[#4a90d9] px-3 py-1 rounded-full hover:bg-[#4a90d9]/30"
                      >
                        فعال‌سازی
                      </button>
                    )}
                    <button
                      onClick={() => removeProgram(program.id)}
                      className="text-[#ef4444] p-1 hover:bg-[#ef4444]/10 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
