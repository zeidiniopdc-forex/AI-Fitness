import { AthleteProfile, GOAL_LABELS, EXPERIENCE_LABELS, getGoalLabel } from '../types';

// Translation maps for Persian to English
const GOAL_TRANSLATIONS: Record<string, string> = {
  'عضله‌سازی': 'Muscle Hypertrophy',
  'افزایش قدرت': 'Strength Gain',
  'چربی‌سوزی': 'Fat Loss',
  'بازسازی بدن': 'Body Recomposition',
  'آمادگی مسابقه': 'Competition Preparation',
  'آمادگی عمومی': 'General Fitness',
  'hypertrophy': 'Muscle Hypertrophy',
  'strength': 'Strength Gain',
  'fat_loss': 'Fat Loss',
  'recomposition': 'Body Recomposition',
  'competition': 'Competition Preparation',
  'general_fitness': 'General Fitness',
};

const EXPERIENCE_TRANSLATIONS: Record<string, string> = {
  'مبتدی': 'Beginner',
  'متوسط': 'Intermediate',
  'پیشرفته': 'Advanced',
  'حرفه‌ای': 'Professional',
  'beginner': 'Beginner',
  'intermediate': 'Intermediate',
  'advanced': 'Advanced',
  'professional': 'Professional',
};

const LOCATION_TRANSLATIONS: Record<string, string> = {
  'gym': 'Gym',
  'home': 'Home',
  'both': 'Gym and Home',
  'park': 'Park/Outdoor',
  'باشگاه': 'Gym',
  'خانه': 'Home',
  'هر دو': 'Gym and Home',
  'پارک': 'Park/Outdoor',
};

const PROGRAM_TYPE_TRANSLATIONS: Record<string, string> = {
  'full_body': 'Full Body',
  'split': 'Body Part Split',
  'push_pull_legs': 'Push/Pull/Legs (PPL)',
  'upper_lower': 'Upper/Lower Split',
  'ai_suggested': 'AI Suggested (based on athlete profile)',
  'فول بادی': 'Full Body',
  'تفکیکی': 'Body Part Split',
  'پول پوش': 'Push/Pull/Legs (PPL)',
  'بالاتنه پایین‌تنه': 'Upper/Lower Split',
  'پیشنهاد هوش مصنوعی': 'AI Suggested',
};

const MUSCLE_TRANSLATIONS: Record<string, string> = {
  'سینه': 'Chest',
  'پشت': 'Back',
  'سرشانه': 'Shoulders',
  'جلوبازو': 'Biceps',
  'پشت‌بازو': 'Triceps',
  'چهارسر ران': 'Quadriceps',
  'همسترینگ': 'Hamstrings',
  'باسن': 'Glutes',
  'ساق پا': 'Calves',
  'شکم': 'Abs/Core',
  'کول': 'Traps',
  'ساعد': 'Forearms',
};

function translateGoal(goal: string): string {
  return GOAL_TRANSLATIONS[goal] || goal;
}

function translateExperience(exp: string): string {
  return EXPERIENCE_TRANSLATIONS[exp] || exp;
}

function translateLocation(loc: string): string {
  return LOCATION_TRANSLATIONS[loc] || loc;
}

function translateProgramType(type: string): string {
  return PROGRAM_TYPE_TRANSLATIONS[type] || type;
}

function translateMuscle(muscle: string): string {
  return MUSCLE_TRANSLATIONS[muscle] || muscle;
}

export function generateWorkoutPrompt(profile: AthleteProfile): string {
  const goalEn = translateGoal(profile.primaryGoal);
  const secondaryGoalEn = profile.secondaryGoal ? translateGoal(profile.secondaryGoal) : null;
  const experienceEn = translateExperience(profile.experience);
  const locationEn = translateLocation(profile.location);
  const programTypeEn = translateProgramType(profile.programType || 'ai_suggested');
  const targetMusclesEn = profile.targetMuscles.map(translateMuscle).join(', ');

  const prompt = `You are an expert strength and conditioning coach, certified by NSCA and ACSM, with 20+ years of experience designing evidence-based training programs for athletes of all levels. You specialize in ${goalEn.toLowerCase()} and use the latest scientific research from Schoenfeld, Helms, and Israetel.

## Athlete Profile
- **Name**: ${profile.name}
- **Age**: ${profile.age} years old
- **Gender**: ${profile.gender === 'male' ? 'Male' : 'Female'}
- **Height**: ${profile.height} cm
- **Current Weight**: ${profile.weight} kg${profile.targetWeight ? `\n- **Target Weight**: ${profile.targetWeight} kg` : ''}
- **Experience Level**: ${experienceEn}
- **Activity Level**: ${profile.activityLevel || 'Moderately Active'}

## Training Parameters
- **Primary Goal**: ${goalEn}
${secondaryGoalEn ? `- **Secondary Goal**: ${secondaryGoalEn}` : ''}
- **Training Days per Week**: ${profile.trainingDays} days
- **Session Duration**: ${profile.sessionDuration} minutes
- **Training Location**: ${locationEn}
- **Program Type**: ${programTypeEn}
${targetMusclesEn ? `- **Priority Muscle Groups**: ${targetMusclesEn}` : ''}
- **Timeline**: ${profile.timeline || '8-12 weeks'}

## Available Equipment
${profile.equipment.length > 0 ? profile.equipment.join(', ') : 'Standard gym equipment'}
${profile.customEquipment.length > 0 ? `\n## Custom Equipment\n${profile.customEquipment.join(', ')}` : ''}

## Health Considerations
${profile.injuries.length > 0 ? `- **Injuries**: ${profile.injuries.join(', ')}` : '- No reported injuries'}
${profile.limitations.length > 0 ? `- **Medical Limitations**: ${profile.limitations.join(', ')}` : '- No medical limitations'}
${profile.avoidedExercises.length > 0 ? `- **Exercises to Avoid**: ${profile.avoidedExercises.join(', ')}` : '- No exercises to avoid'}

## Strength Records
${Object.keys(profile.strengthRecords).length > 0 
  ? Object.entries(profile.strengthRecords).map(([ex, w]) => `- ${ex}: ${w}`).join('\n')
  : '- No recorded strength data'}

## Scientific Framework
Apply these evidence-based principles:
1. **Volume**: Follow RP volume landmarks (MEV, MAV, MRV) appropriate for experience level
2. **Frequency**: Optimize training frequency (2x/week per muscle group minimum for ${experienceEn.toLowerCase()})
3. **Progressive Overload**: Include clear progression scheme
4. **Exercise Selection**: Biomechanically appropriate exercises with proper movement patterns
5. **Rest Periods**: Science-based rest intervals (2-5min for compounds, 1-2min for isolation)
6. **Tempo**: Include tempo prescriptions for key exercises
7. **Periodization**: Include weekly undulation if appropriate

## Output Requirements
You MUST respond with ONLY valid JSON. No markdown, no explanations outside JSON.

The JSON must follow this EXACT structure:
{
  "program_name": "نام برنامه به فارسی",
  "duration": "مدت برنامه به فارسی",
  "days": [
    {
      "day": "نام روز به فارسی (مثلاً: روز اول - سینه و پشت‌بازو)",
      "muscle_groups": ["گروه عضلانی به فارسی"],
      "exercises": [
        {
          "name": "نام تمرین به فارسی",
          "sets": "تعداد ست (عدد)",
          "reps": "محدوده تکرار (مثلاً: 8-12)",
          "rest": "زمان استراحت به ثانیه (عدد)",
          "tempo": "تمپو (مثلاً: 3-1-1-0)",
          "notes": "نکات مهم به فارسی"
        }
      ]
    }
  ]
}

IMPORTANT:
- All text MUST be in Persian (Farsi)
- Use common Persian gym terminology
- Provide exactly ${profile.trainingDays} training days
- Each day should have 5-8 exercises
- Ensure total session time fits within ${profile.sessionDuration} minutes
- Respect all injuries and limitations
- Prioritize target muscles if specified
- Use Persian numbers in text (۱، ۲، ۳، ...)`;

  return prompt;
}

export function generateNutritionPrompt(profile: AthleteProfile): string {
  const goalEn = translateGoal(profile.dietaryGoal || profile.primaryGoal);
  
  const prompt = `You are a certified sports nutritionist (RD, CSSD) with expertise in Iranian cuisine and evidence-based nutrition planning. You specialize in creating personalized meal plans for ${goalEn.toLowerCase()} using traditional Iranian foods.

## Athlete Profile
- **Name**: ${profile.name}
- **Age**: ${profile.age} years old
- **Gender**: ${profile.gender === 'male' ? 'Male' : 'Female'}
- **Height**: ${profile.height} cm
- **Current Weight**: ${profile.weight} kg${profile.targetWeight ? `\n- **Target Weight**: ${profile.targetWeight} kg` : ''}
- **Activity Level**: ${profile.activityLevel || 'Moderately Active'}

## Nutrition Goals
- **Primary Goal**: ${goalEn}
${profile.dietType ? `- **Diet Type**: ${profile.dietType}` : ''}
- **Meals per Day**: ${profile.mealsPerDay || 3}
${profile.calorieTarget ? `- **Calorie Target**: ${profile.calorieTarget} kcal/day` : ''}
- **Timeline**: ${profile.timeline || '8-12 weeks'}

## Food Preferences
${profile.favoriteFoods.length > 0 ? `- **Favorite Foods**: ${profile.favoriteFoods.join(', ')}` : ''}
${profile.dislikedFoods.length > 0 ? `- **Disliked Foods**: ${profile.dislikedFoods.join(', ')}` : ''}
${profile.foodAllergies.length > 0 ? `- **Food Allergies**: ${profile.foodAllergies.join(', ')}` : ''}

## Cooking Skill Level
${profile.cookingSkill === 'none' ? 'No cooking skills - needs very simple recipes' : 
  profile.cookingSkill === 'basic' ? 'Basic - can prepare simple meals' :
  profile.cookingSkill === 'intermediate' ? 'Intermediate - can prepare diverse meals' :
  'Advanced - can prepare complex recipes'}

## Health Considerations
${profile.healthConditions.length > 0 ? `- **Health Conditions**: ${profile.healthConditions.join(', ')}` : '- No specific health conditions'}
${profile.injuries.length > 0 ? `- **Injuries**: ${profile.injuries.join(', ')}` : ''}

## Requirements
1. Create a 7-day meal plan with ${profile.mealsPerDay || 3} meals per day
2. Use traditional Iranian foods and ingredients
3. Calculate approximate macronutrients (protein, carbs, fats) for each meal
4. Provide simple preparation instructions
5. Include portion sizes in grams/cups
6. Respect food allergies and dislikes
7. Prioritize favorite foods
8. Match cooking skill level
9. Ensure nutritional adequacy for the goal
10. Include hydration recommendations

## Output Requirements
You MUST respond with ONLY valid JSON. No markdown, no explanations outside JSON.

The JSON must follow this EXACT structure:
{
  "plan_name": "نام برنامه غذایی به فارسی",
  "duration": "مدت برنامه به فارسی",
  "daily_calories": "کالری روزانه (عدد)",
  "macros": {
    "protein": "پروتئین روزانه (گرم)",
    "carbs": "کربوهیدرات روزانه (گرم)",
    "fats": "چربی روزانه (گرم)"
  },
  "days": [
    {
      "day": "نام روز به فارسی (مثلاً: شنبه)",
      "meals": [
        {
          "meal_name": "نام وعده به فارسی (مثلاً: صبحانه)",
          "time": "ساعت وعده (مثلاً: ۸:۰۰)",
          "foods": [
            {
              "name": "نام غذا به فارسی",
              "portion": "مقدار به فارسی (مثلاً: ۱۰۰ گرم)",
              "calories": "کالری (عدد)",
              "protein": "پروتئین (گرم)",
              "carbs": "کربوهیدرات (گرم)",
              "fats": "چربی (گرم)"
            }
          ],
          "preparation": "دستور تهیه ساده به فارسی"
        }
      ],
      "total_calories": "مجموع کالری روز (عدد)",
      "notes": "نکات مهم به فارسی"
    }
  ],
  "hydration": "توصیه‌های نوشیدن آب به فارسی",
  "supplements": "توصیه‌های مکمل به فارسی (در صورت نیاز)"
}

IMPORTANT:
- All text MUST be in Persian (Farsi)
- Use common Iranian food names
- Provide realistic portion sizes
- Calculate accurate macronutrients
- Respect all allergies and dislikes
- Use Persian numbers in text (۱، ۲، ۳، ...)`;

  return prompt;
}

export function generateSupplementPrompt(profile: AthleteProfile): string {
  const goalEn = translateGoal(profile.supplementGoal || profile.primaryGoal);
  
  const prompt = `You are a sports nutrition PhD and certified supplement specialist (ISSN) with expertise in evidence-based supplementation. You provide personalized supplement recommendations based on scientific research.

## Athlete Profile
- **Name**: ${profile.name}
- **Age**: ${profile.age} years old
- **Gender**: ${profile.gender === 'male' ? 'Male' : 'Female'}
- **Weight**: ${profile.weight} kg
- **Experience Level**: ${translateExperience(profile.experience)}
- **Training Goal**: ${goalEn}

## Supplement Information
${profile.supplementGoal ? `- **Supplement Goal**: ${profile.supplementGoal}` : ''}
${profile.currentSupplements.length > 0 ? `- **Current Supplements**: ${profile.currentSupplements.join(', ')}` : '- Not currently taking any supplements'}
${profile.supplementBudget ? `- **Monthly Budget**: ${profile.supplementBudget}` : ''}

## Health Considerations
${profile.healthConditions.length > 0 ? `- **Health Conditions**: ${profile.healthConditions.join(', ')}` : '- No specific health conditions'}
${profile.injuries.length > 0 ? `- **Injuries**: ${profile.injuries.join(', ')}` : ''}
${profile.foodAllergies.length > 0 ? `- **Food Allergies**: ${profile.foodAllergies.join(', ')}` : ''}

## Requirements
1. Recommend evidence-based supplements only
2. Prioritize supplements with strong scientific backing (Level A evidence)
3. Consider potential interactions with current supplements
4. Respect health conditions and allergies
5. Stay within budget if specified
6. Provide dosage recommendations
7. Explain timing (pre/post workout, with meals, etc.)
8. Include expected benefits
9. Mention potential side effects
10. Suggest quality brands available in Iran

## Output Requirements
You MUST respond with ONLY valid JSON. No markdown, no explanations outside JSON.

The JSON must follow this EXACT structure:
{
  "recommendation_title": "عنوان توصیه به فارسی",
  "summary": "خلاصه توصیه به فارسی",
  "supplements": [
    {
      "name": "نام مکمل به فارسی",
      "english_name": "نام انگلیسی مکمل",
      "priority": "اولویت (بالا/متوسط/پایین)",
      "dosage": "دوز مصرف به فارسی",
      "timing": "زمان مصرف به فارسی",
      "benefits": "فواید به فارسی",
      "side_effects": "عوارض جانبی احتمالی به فارسی",
      "estimated_cost": "هزینه تقریبی ماهانه به فارسی",
      "recommended_brands": "برندهای پیشنهادی موجود در ایران به فارسی",
      "notes": "نکات مهم به فارسی"
    }
  ],
  "total_estimated_cost": "هزینه کل تخمینی ماهانه به فارسی",
  "important_notes": "نکات مهم کلی به فارسی",
  "warnings": "هشدارهای مهم به فارسی"
}

IMPORTANT:
- All text MUST be in Persian (Farsi)
- Use common Persian supplement names
- Provide realistic dosage recommendations
- Consider Iranian market availability
- Use Persian numbers in text (۱، ۲، ۳، ...)
- Be conservative with recommendations
- Prioritize safety over performance`;

  return prompt;
}

export function validateWorkoutJSON(json: string): { valid: boolean; data?: any; error?: string } {
  try {
    // Clean up common JSON issues from AI output
    let cleanJson = json.trim();
    
    // Remove markdown code blocks if present
    cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    // Remove any text before/after JSON
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }
    
    const data = JSON.parse(cleanJson);
    
    // Flexible validation - make most fields optional with defaults
    if (!data.program_name) data.program_name = 'برنامه تمرینی';
    if (!data.duration) data.duration = '۸ هفته';
    if (!Array.isArray(data.days)) {
      return { valid: false, error: 'فیلد days باید آرایه‌ای از روزهای تمرینی باشد' };
    }
    if (data.days.length === 0) {
      return { valid: false, error: 'حداقل یک روز تمرینی لازم است' };
    }
    
    for (let i = 0; i < data.days.length; i++) {
      const day = data.days[i];
      if (!day.day) day.day = `روز ${i + 1}`;
      if (!Array.isArray(day.muscle_groups)) day.muscle_groups = [];
      if (!Array.isArray(day.exercises)) {
        return { valid: false, error: `روز ${i + 1}: فیلد exercises الزامی است` };
      }
      if (day.exercises.length === 0) {
        return { valid: false, error: `روز ${i + 1}: حداقل یک تمرین لازم است` };
      }
      
      for (let j = 0; j < day.exercises.length; j++) {
        const ex = day.exercises[j];
        if (!ex.name) {
          return { valid: false, error: `روز ${i + 1}, تمرین ${j + 1}: نام تمرین الزامی است` };
        }
        // Provide defaults for optional fields
        if (ex.sets === undefined || ex.sets === null || ex.sets === '') ex.sets = '3';
        if (ex.reps === undefined || ex.reps === null || ex.reps === '') ex.reps = '10';
        if (ex.rest === undefined || ex.rest === null || ex.rest === '') ex.rest = '90';
        if (!ex.tempo) ex.tempo = '';
        if (!ex.notes) ex.notes = '';
        
        // Convert numeric values to strings if needed
        ex.sets = String(ex.sets);
        ex.rest = String(ex.rest);
      }
    }
    
    return { valid: true, data };
  } catch (e) {
    const errorMsg = (e as Error).message;
    let friendlyError = 'فرمت JSON نامعتبر است';
    
    if (errorMsg.includes('Unexpected token')) {
      friendlyError = 'خطای نگارشی در JSON. لطفاً بررسی کنید که تمام پرانتزها و براکت‌ها بسته باشند';
    } else if (errorMsg.includes('Unexpected end')) {
      friendlyError = 'JSON ناقص است. لطفاً کامل کپی کنید';
    } else if (errorMsg.includes('position')) {
      friendlyError = 'خطا در JSON: ' + errorMsg;
    }
    
    return { valid: false, error: friendlyError };
  }
}

export function validateNutritionJSON(json: string): { valid: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(json);
    
    if (!data.plan_name || typeof data.plan_name !== 'string') {
      return { valid: false, error: 'فیلد plan_name الزامی است' };
    }
    if (!Array.isArray(data.days) || data.days.length === 0) {
      return { valid: false, error: 'فیلد days باید آرایه‌ای از روزها باشد' };
    }
    
    for (let i = 0; i < data.days.length; i++) {
      const day = data.days[i];
      if (!day.day) {
        return { valid: false, error: `روز ${i + 1}: فیلد day الزامی است` };
      }
      if (!Array.isArray(day.meals) || day.meals.length === 0) {
        return { valid: false, error: `روز ${i + 1}: فیلد meals الزامی است` };
      }
      
      for (let j = 0; j < day.meals.length; j++) {
        const meal = day.meals[j];
        if (!meal.meal_name) {
          return { valid: false, error: `روز ${i + 1}, وعده ${j + 1}: نام وعده الزامی است` };
        }
        if (!Array.isArray(meal.foods) || meal.foods.length === 0) {
          return { valid: false, error: `روز ${i + 1}, وعده ${j + 1}: فیلد foods الزامی است` };
        }
      }
    }
    
    return { valid: true, data };
  } catch (e) {
    return { valid: false, error: 'فرمت JSON نامعتبر است: ' + (e as Error).message };
  }
}

export function validateSupplementJSON(json: string): { valid: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(json);
    
    if (!data.recommendation_title || typeof data.recommendation_title !== 'string') {
      return { valid: false, error: 'فیلد recommendation_title الزامی است' };
    }
    if (!Array.isArray(data.supplements) || data.supplements.length === 0) {
      return { valid: false, error: 'فیلد supplements باید آرایه‌ای از مکمل‌ها باشد' };
    }
    
    for (let i = 0; i < data.supplements.length; i++) {
      const supp = data.supplements[i];
      if (!supp.name) {
        return { valid: false, error: `مکمل ${i + 1}: فیلد name الزامی است` };
      }
    }
    
    return { valid: true, data };
  } catch (e) {
    return { valid: false, error: 'فرمت JSON نامعتبر است: ' + (e as Error).message };
  }
}
