import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Apple, AlertTriangle, Target, Utensils } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';

export default function Nutrition() {
  const { activeProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          isDark ? 'bg-[#d4af37]/10' : 'bg-[#14b8a6]/10'
        }`}>
          <Apple size={48} className={isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'} />
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

  const hasNutritionInfo = activeProfile.dietaryGoal || activeProfile.dietType || activeProfile.favoriteFoods.length > 0;

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
        <Apple size={24} className={isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'} />
        تغذیه و رژیم غذایی
      </h2>

      {/* Nutrition Summary */}
      <div className={`rounded-2xl p-6 border theme-transition ${
        isDark 
          ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#d4af37]/20' 
          : 'bg-gradient-to-l from-white to-[#f0fdfa] border-[#14b8a6]/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-[#d4af37]/20' : 'bg-[#14b8a6]/15'
          }`}>
            <Target size={24} className={isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
              خلاصه تغذیه
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
              {activeProfile.name}
            </p>
          </div>
        </div>

        {!hasNutritionInfo ? (
          <div className={`rounded-xl p-4 text-center ${
            isDark ? 'bg-[#0d0d1a]/50' : 'bg-[#f0fdfa]'
          }`}>
            <AlertTriangle size={32} className={`mx-auto mb-2 ${isDark ? 'text-[#f59e0b]' : 'text-[#d97706]'}`} />
            <p className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
              اطلاعات تغذیه تکمیل نشده
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
              لطفاً به بخش پروفایل رفته و اطلاعات تغذیه را تکمیل کنید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {activeProfile.dietaryGoal && (
              <InfoCard label="هدف رژیم" value={activeProfile.dietaryGoal} isDark={isDark} />
            )}
            {activeProfile.dietType && (
              <InfoCard label="نوع رژیم" value={activeProfile.dietType} isDark={isDark} />
            )}
            <InfoCard label="وعده‌های روزانه" value={`${toPersianNumber(activeProfile.mealsPerDay || 3)} وعده`} isDark={isDark} />
            {activeProfile.calorieTarget && (
              <InfoCard label="کالری هدف" value={`${toPersianNumber(activeProfile.calorieTarget)} کالری`} isDark={isDark} />
            )}
          </div>
        )}
      </div>

      {/* Favorite Foods */}
      {activeProfile.favoriteFoods.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#d4af37]/10' : 'bg-white border-[#14b8a6]/15'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'}`}>
            <Utensils size={18} />
            غذاهای مورد علاقه
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.favoriteFoods.map((food, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${
                isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#10b981]/15 text-[#059669]'
              }`}>
                {food}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Disliked Foods */}
      {activeProfile.dislikedFoods.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#d4af37]/10' : 'bg-white border-[#14b8a6]/15'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'}`}>
            <AlertTriangle size={18} />
            غذاهای مورد عدم علاقه
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.dislikedFoods.map((food, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${
                isDark ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-red-50 text-red-700'
              }`}>
                {food}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Food Allergies */}
      {activeProfile.foodAllergies.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#ef4444]/20' : 'bg-white border-red-200'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'}`}>
            <AlertTriangle size={18} />
            آلرژی‌های غذایی
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.foodAllergies.map((allergy, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                isDark ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-red-50 text-red-700'
              }`}>
                ⚠️ {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cooking Skill */}
      {activeProfile.cookingSkill && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#d4af37]/10' : 'bg-white border-[#14b8a6]/15'
        }`}>
          <h3 className={`font-bold mb-3 ${isDark ? 'text-[#d4af37]' : 'text-[#0d9488]'}`}>
            مهارت آشپزی
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#134e4a]'}`}>
            {activeProfile.cookingSkill === 'none' && 'بدون مهارت آشپزی'}
            {activeProfile.cookingSkill === 'basic' && 'مقدماتی - توانایی پخت غذاهای ساده'}
            {activeProfile.cookingSkill === 'intermediate' && 'متوسط - توانایی پخت غذاهای متنوع'}
            {activeProfile.cookingSkill === 'advanced' && 'پیشرفته - توانایی پخت غذاهای پیچیده'}
          </p>
        </div>
      )}
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
