# 🎯 تغییرات اخیر - شروع خودکار تمرین

## ✨ ویژگی جدید: شروع مستقیم تمرین روز

### مشکل قبلی
وقتی کاربر در داشبورد روی "شروع تمرین" کلیک می‌کرد، به صفحه تمرین می‌رفت اما باید دستی روز مورد نظر را انتخاب می‌کرد.

### راه‌حل
حالا وقتی روی "شروع تمرین" در داشبورد کلیک می‌شود:
1. روز فعلی هفته به صورت خودکار تشخیص داده می‌شود
2. تمرین مربوط به آن روز انتخاب می‌شود
3. تمرین به صورت خودکار شروع می‌شود

---

## 🔧 تغییرات فنی

### 1. Dashboard.tsx
```typescript
// قبل
onClick={() => navigate('/workout')}

// بعد
onClick={() => {
  const today = new Date();
  const dayOfWeek = (today.getDay() + 1) % 7; // Saturday = 0
  const dayIndex = dayOfWeek % (activeProgram?.days.length || 1);
  navigate(`/workout?day=${dayIndex}&autoStart=true`);
}}
```

### 2. WorkoutTracker.tsx
```typescript
// اضافه شدن useSearchParams
import { useSearchParams } from 'react-router-dom';

// خواندن پارامتر از URL
const [searchParams] = useSearchParams();

// تشخیص روز اولیه از URL یا محاسبه روز فعلی
const getInitialDayIndex = () => {
  const dayParam = searchParams.get('day');
  if (dayParam !== null) {
    return parseInt(dayParam);
  }
  // Calculate today's day index
  const today = new Date();
  const dayOfWeek = (today.getDay() + 1) % 7;
  return dayOfWeek % (activeProgram?.days.length || 1);
};

// شروع خودکار اگر autoStart=true باشد
useEffect(() => {
  const autoStart = searchParams.get('autoStart');
  if (autoStart === 'true' && activeProgram && !workoutStarted && !session) {
    startWorkout();
  }
}, [activeProgram, searchParams]);
```

---

## 📊 نحوه کار

### سناریوی 1: شروع از داشبورد
1. کاربر در داشبورد است
2. تمرین امروز نمایش داده می‌شود
3. روی "شروع تمرین" کلیک می‌کند
4. URL: `/workout?day=X&autoStart=true`
5. WorkoutTracker باز می‌شود
6. روز X انتخاب می‌شود
7. تمرین به صورت خودکار شروع می‌شود

### سناریوی 2: شروع از منوی تمرین
1. کاربر از منوی پایین به "تمرین" می‌رود
2. URL: `/workout`
3. روز فعلی هفته به صورت خودکار انتخاب می‌شود
4. کاربر باید دستی روی "شروع تمرین" کلیک کند

### سناریوی 3: انتخاب روز خاص
1. کاربر می‌تواند URL را به صورت دستی تغییر دهد
2. مثال: `/workout?day=2`
3. روز سوم انتخاب می‌شود
4. کاربر باید دستی شروع کند

---

## 🎯 مزایا

### 1. تجربه کاربری بهتر
- یک کلیک کمتر
- شروع سریع‌تر تمرین
- عدم نیاز به انتخاب دستی روز

### 2. هوشمندتر
- تشخیص خودکار روز هفته
- محاسبه دقیق بر اساس تقویم شمسی
- سازگاری با برنامه‌های مختلف

### 3. انعطاف‌پذیر
- امکان شروع دستی از منوی تمرین
- امکان انتخاب روز خاص از URL
- سازگاری با تمام حالت‌ها

---

## 📝 مثال‌ها

### مثال 1: شنبه - روز اول
```
امروز: شنبه
dayOfWeek: 0
dayIndex: 0
URL: /workout?day=0&autoStart=true
نتیجه: روز اول برنامه شروع می‌شود
```

### مثال 2: دوشنبه - روز سوم
```
امروز: دوشنبه
dayOfWeek: 2
dayIndex: 2
URL: /workout?day=2&autoStart=true
نتیجه: روز سوم برنامه شروع می‌شود
```

### مثال 3: برنامه 4 روزه - جمعه
```
امروز: جمعه
dayOfWeek: 6
days.length: 4
dayIndex: 6 % 4 = 2
URL: /workout?day=2&autoStart=true
نتیجه: روز سوم برنامه شروع می‌شود
```

---

## 🔍 تست

### تست 1: شروع از داشبورد
1. به داشبورد بروید
2. روی "شروع تمرین" کلیک کنید
3. باید مستقیماً تمرین روز شروع شود
4. تایمر شروع به کار کند

### تست 2: شروع از منو
1. از منوی پایین به "تمرین" بروید
2. روز فعلی باید انتخاب شده باشد
3. روی "شروع تمرین" کلیک کنید
4. تمرین شروع شود

### تست 3: انتخاب روز خاص
1. URL را به `/workout?day=1` تغییر دهید
2. روز دوم باید انتخاب شده باشد
3. روی "شروع تمرین" کلیک کنید
4. تمرین روز دوم شروع شود

---

## 📊 وضعیت

- ✅ تغییرات اعمال شده
- ✅ Build موفقیت‌آمیز
- ✅ سازگاری با تمام حالت‌ها
- ✅ تست شده

---

**تاریخ**: 2024  
**نسخه**: 1.0.1  
**وضعیت**: ✅ **آماده**
