import { AthleteProfile, GOAL_LABELS, EXPERIENCE_LABELS } from '../types';

export function generateAIPrompt(profile: AthleteProfile): string {
  const goalLabel = GOAL_LABELS[profile.primaryGoal];
  const experienceLabel = EXPERIENCE_LABELS[profile.experience];
  
  const prompt = `You are a world-class bodybuilding coach, CSCS specialist, biomechanics expert, and hypertrophy researcher with 20+ years of experience training elite athletes. You have deep knowledge of evidence-based training principles from Brad Schoenfeld, Renaissance Periodization (Mike Israetel), Eric Helms, and ACSM guidelines.

## Task
Design a complete, periodized training program for the following athlete based on their profile, goals, and constraints.

## Athlete Profile
- Name: ${profile.name}
- Age: ${toPersianNum(profile.age)} years
- Gender: ${profile.gender === 'male' ? 'Male' : 'Female'}
- Height: ${toPersianNum(profile.height)} cm
- Weight: ${toPersianNum(profile.weight)} kg
- Experience Level: ${experienceLabel} (${profile.experience})
- Training History: ${profile.trainingHistory || 'Not specified'}

## Training Parameters
- Training Days Per Week: ${toPersianNum(profile.trainingDays)}
- Session Duration: ${toPersianNum(profile.sessionDuration)} minutes
- Training Location: ${profile.location === 'gym' ? 'Gym' : profile.location === 'home' ? 'Home' : 'Gym & Home'}
- Available Equipment: ${profile.equipment.join(', ') || 'Standard gym equipment'}

## Primary Goal
${goalLabel}
${profile.secondaryGoal ? `## Secondary Goal\n${GOAL_LABELS[profile.secondaryGoal]}` : ''}
${profile.targetMuscles.length > 0 ? `## Priority Muscles\n${profile.targetMuscles.join(', ')}` : ''}
## Timeline
${profile.timeline || 'Standard 8-12 week program'}

## Health & Limitations
${profile.injuries.length > 0 ? `- Injuries: ${profile.injuries.join(', ')}` : '- No reported injuries'}
${profile.limitations.length > 0 ? `- Medical Limitations: ${profile.limitations.join(', ')}` : '- No medical limitations'}
${profile.avoidedExercises.length > 0 ? `- Exercises to Avoid: ${profile.avoidedExercises.join(', ')}` : '- No exercises to avoid'}

## Strength Records
${Object.keys(profile.strengthRecords).length > 0 
  ? Object.entries(profile.strengthRecords).map(([ex, w]) => `- ${ex}: ${w}`).join('\n')
  : '- No recorded strength data'}

## Scientific Framework Requirements
Apply the following evidence-based principles:
1. **Volume**: Follow RP volume landmarks (MEV, MAV, MRV) appropriate for experience level
2. **Frequency**: Optimize training frequency based on Schoenfeld's research (2x/week per muscle group minimum)
3. **Progressive Overload**: Include clear progression scheme
4. **Exercise Selection**: Biomechanically appropriate exercises with proper movement patterns
5. **Rest Periods**: Science-based rest intervals (2-5min for compounds, 1-2min for isolation)
6. **Tempo**: Include tempo prescriptions for key exercises
7. **Periodization**: Include weekly undulation if appropriate

## Output Format
You MUST respond with ONLY valid JSON. No markdown formatting. No explanations outside JSON.

The JSON must follow this exact structure:
{
  "program_name": "Program name in Persian",
  "duration": "Duration description in Persian",
  "days": [
    {
      "day": "Day name in Persian (e.g., روز اول)",
      "muscle_groups": ["Muscle group in Persian"],
      "exercises": [
        {
          "name": "Exercise name in Persian",
          "sets": "Number of sets (e.g., 4)",
          "reps": "Rep range (e.g., 8-12)",
          "rest": "Rest time in seconds (e.g., 90)",
          "tempo": "Tempo prescription (e.g., 3-1-1-0)",
          "notes": "Important notes in Persian"
        }
      ]
    }
  ]
}

Important:
- All text must be in Persian (Farsi)
- Exercise names should be commonly used Persian gym terminology
- Provide exactly ${toPersianNum(profile.trainingDays)} training days
- Each day should have 5-8 exercises
- Ensure total session time fits within ${toPersianNum(profile.sessionDuration)} minutes
- Respect all injuries and limitations
- Prioritize target muscles if specified`;

  return prompt;
}

function toPersianNum(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

export function validateWorkoutJSON(json: string): { valid: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(json);
    
    if (!data.program_name || typeof data.program_name !== 'string') {
      return { valid: false, error: 'فیلد program_name الزامی است' };
    }
    if (!data.duration || typeof data.duration !== 'string') {
      return { valid: false, error: 'فیلد duration الزامی است' };
    }
    if (!Array.isArray(data.days) || data.days.length === 0) {
      return { valid: false, error: 'فیلد days باید آرایه‌ای از روزهای تمرینی باشد' };
    }
    
    for (let i = 0; i < data.days.length; i++) {
      const day = data.days[i];
      if (!day.day) {
        return { valid: false, error: `روز ${i + 1}: فیلد day الزامی است` };
      }
      if (!Array.isArray(day.muscle_groups)) {
        return { valid: false, error: `روز ${i + 1}: فیلد muscle_groups باید آرایه باشد` };
      }
      if (!Array.isArray(day.exercises) || day.exercises.length === 0) {
        return { valid: false, error: `روز ${i + 1}: فیلد exercises الزامی است` };
      }
      
      for (let j = 0; j < day.exercises.length; j++) {
        const ex = day.exercises[j];
        if (!ex.name) {
          return { valid: false, error: `روز ${i + 1}, تمرین ${j + 1}: نام تمرین الزامی است` };
        }
        if (!ex.sets) {
          return { valid: false, error: `روز ${i + 1}, تمرین ${j + 1}: تعداد ست الزامی است` };
        }
        if (!ex.reps) {
          return { valid: false, error: `روز ${i + 1}, تمرین ${j + 1}: تعداد تکرار الزامی است` };
        }
      }
    }
    
    return { valid: true, data };
  } catch (e) {
    return { valid: false, error: 'فرمت JSON نامعتبر است: ' + (e as Error).message };
  }
}
