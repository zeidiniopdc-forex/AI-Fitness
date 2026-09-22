import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Pill, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';
import { useNavigate } from 'react-router-dom';

export default function Supplements() {
  const { activeProfile, supplementPrograms, removeSupplementProgram } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          isDark ? 'bg-[#d4af37]/10' : 'bg-[#14b8a6]/10'
        }`}>
          <Pill size={48} className={isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'} />
        </div>
        <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
          پروفایل انتخاب نشده
        </h2>
        <p className={`text-center max-w-md ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
          لطفاً ابتدا یک پروفایل را از داشبورد انتخاب کنید
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
        <Pill size={24} className={isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'} />
        مکمل‌های ورزشی
      </h2>

      {/* Supplement Info */}
      <div className={`rounded-2xl p-6 border theme-transition ${
        isDark 
          ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#d4af37]/20' 
          : 'bg-gradient-to-l from-white to-[#f0fdfa] border-[#14b8a6]/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-[#d4af37]/20' : 'bg-[#14b8a6]/15'
          }`}>
            <Pill size={24} className={isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
              اطلاعات مکمل
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
              {activeProfile.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activeProfile.supplementGoal && (
            <InfoCard label="هدف مصرف" value={activeProfile.supplementGoal} isDark={isDark} />
          )}
          {activeProfile.supplementBudget && (
            <InfoCard label="بودجه ماهانه" value={activeProfile.supplementBudget} isDark={isDark} />
          )}
          <InfoCard 
            label="مکمل‌های فعلی" 
            value={activeProfile.currentSupplements.length > 0 
              ? `${toPersianNumber(activeProfile.currentSupplements.length)} مورد` 
              : 'هیچ'} 
            isDark={isDark} 
          />
        </div>
      </div>

      {/* Current Supplements */}
      {activeProfile.currentSupplements.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#d4af37]/10' : 'bg-white border-[#14b8a6]/15'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'}`}>
            مکمل‌های فعلی
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.currentSupplements.map((supp, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${
                isDark ? 'bg-[#4a90d9]/20 text-[#6bb5ff]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
              }`}>
                {supp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Health Conditions */}
      {activeProfile.healthConditions.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#ef4444]/20' : 'bg-white border-red-200'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'}`}>
            <AlertTriangle size={18} />
            شرایط پزشکی
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.healthConditions.map((condition, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                isDark ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-red-50 text-red-700'
              }`}>
                ⚠️ {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Supplement Programs */}
      <div className={`rounded-2xl p-5 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#d4af37]/10' : 'bg-white border-[#14b8a6]/15'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'}`}>
            <Pill size={18} />
            برنامه‌های مکمل
          </h3>
          <button
            onClick={() => navigate('/supplement-import')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
              isDark
                ? 'bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30'
                : 'bg-[#14b8a6]/15 text-[#0d9488] hover:bg-[#14b8a6]/25'
            }`}
          >
            <Plus size={14} />
            ورود برنامه
          </button>
        </div>

        {supplementPrograms.length === 0 ? (
          <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>
            هنوز برنامه مکملی وارد نشده است
          </p>
        ) : (
          <div className="space-y-3">
            {supplementPrograms.map(program => (
              <div key={program.id} className={`rounded-xl p-4 border ${
                isDark ? 'bg-[#0d0d1a] border-gray-800' : 'bg-[#f0fdfa] border-[#14b8a6]/20'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                    {program.recommendation_title}
                  </h4>
                  <button
                    onClick={() => {
                      if (confirm('آیا مطمئن هستید؟')) {
                        removeSupplementProgram(program.id);
                      }
                    }}
                    className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                  {program.summary}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    تعداد مکمل: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {toPersianNumber(program.supplements.length)}
                    </span>
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    هزینه ماهانه: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {program.total_estimated_cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>{label}</p>
      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{value}</p>
    </div>
  );
}
