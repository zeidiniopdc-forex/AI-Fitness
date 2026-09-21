# 🏋️ دستیار هوشمند بدنسازی | AI Fitness Coach

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-D4AF37?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Android-4A90D9?style=for-the-badge)
![Build](https://github.com/your-username/ai-fitness-coach/actions/workflows/build-apk.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-22C55E?style=for-the-badge)

**دستیار هوشمند بدنسازی با هوش مصنوعی**

*یک اپلیکیشن حرفه‌ای برای مربیان و ورزشکاران بدنسازی*

</div>

---

## 📋 فهرست مطالب

- [معرفی](#-معرفی)
- [ویژگی‌ها](#-ویژگی‌ها)
- [تکنولوژی‌ها](#-تکنولوژی‌ها)
- [نصب و راه‌اندازی](#-نصب-و-راه‌اندازی)
- [ساخت APK](#-ساخت-apk)
- [ساختار پروژه](#-ساختار-پروژه)
- [مشارکت](#-مشارکت)

---

## 🎯 معرفی

دستیار هوشمند بدنسازی یک اپلیکیشن حرفه‌ای است که با استفاده از هوش مصنوعی، برنامه‌های تمرینی شخصی‌سازی شده برای ورزشکاران تولید می‌کند. این اپلیکیشن به مربیان و ورزشکاران کمک می‌کند تا:

- 📊 اطلاعات ورزشکار را جمع‌آوری و مدیریت کنند
- 🧠 پرامپت‌های حرفه‌ای برای مدل‌های هوش مصنوعی تولید کنند
- 📋 برنامه‌های تمرینی را وارد و مدیریت کنند
- 🏃 تمرینات روزانه را ردیابی کنند
- 📈 پیشرفت بلندمدت را تحلیل کنند
- 📅 تقویم شمسی برای برنامه‌ریزی داشته باشند

---

## ✨ ویژگی‌ها

### 📝 پروفایل ورزشکار
- اطلاعات پایه (نام، سن، قد، وزن)
- سطح تجربه و سابقه تمرینی
- تجهیزات موجود و محل تمرین
- آسیب‌دیدگی‌ها و محدودیت‌ها
- اهداف (عضله‌سازی، قدرت، چربی‌سوزی و...)
- عضلات هدف و زمان‌بندی

### 🧠 تولید پرامپت هوش مصنوعی
- تولید خودکار پرامپت علمی و حرفه‌ای
- سازگار با ChatGPT، Gemini، Claude
- بر اساس اصول علمی (Schoenfeld, Helms, Israetel)
- خروجی JSON ساختاریافته

### 📥 ورود برنامه تمرینی
- اعتبارسنجی JSON
- پیش‌نمایش قبل از ذخیره
- مدیریت چندین برنامه
- فعال‌سازی برنامه مورد نظر

### 🏋️ ردیاب تمرین
- اجرای زنده تمرین
- تایمر استراحت خودکار
- ثبت وزن و تکرار واقعی
- امکان رد کردن ست
- گزارش پایان جلسه

### 📊 داشبورد پیشرفت
- نمودار روند وزن
- آمار جلسات و حجم تمرین
- تحلیل اندازه‌گیری بدن
- نمودار رادار عضلات

### 📅 تقویم شمسی
- تقویم جلالی کامل
- نمایش جلسات تمرینی
- برنامه هفتگی

---

## 🛠 تکنولوژی‌ها

### Frontend (Web)
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Recharts** - Charts & Graphs
- **Lucide React** - Icons
- **Jalaali JS** - Persian Calendar
- **Framer Motion** - Animations

### Android
- **Capacitor 5** - Native bridge
- **Kotlin** - Native code
- **Material Design 3** - UI components
- **AndroidX** - Support libraries

### Build & CI/CD
- **GitHub Actions** - Automated builds
- **Gradle 8.5** - Android build system
- **Android SDK 34** - Target platform

---

## 📦 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- npm 9+
- Android Studio (برای build محلی)
- Java JDK 17

### مراحل نصب

```bash
# Clone repository
git clone https://github.com/your-username/ai-fitness-coach.git
cd ai-fitness-coach

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### ساخت APK محلی

```bash
# Build web app
npm run build

# Sync with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android

# Or build directly
cd android
./gradlew assembleDebug
```

APK خروجی در مسیر زیر قرار می‌گیرد:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🤖 ساخت APK با GitHub Actions

### ساخت خودکار (بدون نیاز به تنظیمات)

فقط کافیست کد را به ریپازیتوری push کنید. GitHub Actions به صورت خودکار:

1. ✅ وب اپلیکیشن را build می‌کند
2. ✅ با Capacitor sync می‌کند
3. ✅ APK debug را می‌سازد
4. ✅ APK را به عنوان artifact آپلود می‌کند

### دریافت APK

1. به تب **Actions** در ریپازیتوری بروید
2. آخرین workflow اجرا شده را انتخاب کنید
3. در بخش **Artifacts**، فایل APK را دانلود کنید

### ساخت Release APK (با امضا)

برای ساخت نسخه release با امضای دیجیتال:

#### ۱. ساخت Keystore

```bash
keytool -genkey -v -keystore release-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias ai-fitness-key
```

#### ۲. اضافه کردن Secrets به GitHub

به مسیر `Settings → Secrets and variables → Actions` بروید و موارد زیر را اضافه کنید:

| Secret Name | Description |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | محتوای keystore به صورت base64 |
| `ANDROID_KEYSTORE_PATH` | `app/release-keystore.jks` |
| `ANDROID_KEYSTORE_PASSWORD` | رمز keystore |
| `ANDROID_KEY_ALIAS` | `ai-fitness-key` |
| `ANDROID_KEY_PASSWORD` | رمز key |

#### ۳. تبدیل Keystore به Base64

```bash
base64 -i release-keystore.jks -o keystore-base64.txt
```

محتوای فایل `keystore-base64.txt` را در secret مربوطه وارد کنید.

#### ۴. ساخت Release

```bash
# Create a new tag
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions به صورت خودکار:
- Release APK signed می‌سازد
- GitHub Release ایجاد می‌کند
- APK را به Release اضافه می‌کند

### ساخت دستی با workflow_dispatch

1. به تب **Actions** بروید
2. **Build Android APK** را انتخاب کنید
3. **Run workflow** را بزنید
4. نوع build (debug/release) را انتخاب کنید

---

## 📁 ساختار پروژه

```
ai-fitness-coach/
├── .github/
│   └── workflows/
│       └── build-apk.yml      # GitHub Actions workflow
├── android/                     # Android project
│   ├── app/
│   │   ├── build.gradle        # App-level build config
│   │   ├── proguard-rules.pro  # ProGuard rules
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/aifitness/coach/
│   │       │   ├── MainActivity.kt
│   │       │   └── NotificationPlugin.kt
│   │       └── res/
│   │           ├── mipmap-anydpi-v26/
│   │           ├── values/
│   │           └── xml/
│   ├── build.gradle            # Root build config
│   ├── gradle/
│   │   └── wrapper/
│   ├── gradlew                 # Gradle wrapper (Unix)
│   ├── gradlew.bat            # Gradle wrapper (Windows)
│   ├── gradle.properties
│   └── settings.gradle
├── public/
│   └── vite.svg               # App icon
├── src/
│   ├── components/
│   │   └── Layout.tsx         # Main layout with navigation
│   ├── context/
│   │   └── AppContext.tsx     # Global state management
│   ├── pages/
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── Profile.tsx        # Athlete profile
│   │   ├── PromptGenerator.tsx # AI prompt generator
│   │   ├── ProgramImport.tsx  # JSON import
│   │   ├── WorkoutTracker.tsx # Workout execution
│   │   ├── Calendar.tsx       # Persian calendar
│   │   └── Progress.tsx       # Progress tracking
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   ├── utils/
│   │   ├── jalali.ts         # Persian calendar utils
│   │   ├── promptGenerator.ts # AI prompt engine
│   │   └── storage.ts        # LocalStorage utils
│   ├── App.tsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.tsx              # Entry point
├── capacitor.config.ts        # Capacitor configuration
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── vite.config.js             # Vite configuration
```

---

## 🧪 تست‌ها

### چک‌لیست تست

- [ ] ✅ نصب اپلیکیشن روی دستگاه
- [ ] ✅ نمایش صحیح RTL
- [ ] ✅ فونت Vazirmatn
- [ ] ✅ تقویم شمسی
- [ ] ✅ اعداد فارسی
- [ ] ✅ ثبت پروفایل
- [ ] ✅ تولید پرامپت
- [ ] ✅ ورود JSON
- [ ] ✅ اجرای تمرین
- [ ] ✅ تایمر استراحت
- [ ] ✅ ثبت پیشرفت
- [ ] ✅ نمودارها
- [ ] ✅ ذخیره‌سازی محلی

---

## 🎨 طراحی

### تم رنگی
| رنگ | کد | کاربرد |
|---|---|---|
| پس‌زمینه | `#0D0D1A` | پس‌زمینه اصلی |
| کارت | `#1A1A2E` | کارت‌ها و پنل‌ها |
| طلا | `#D4AF37` | عناوین و دکمه‌ها |
| آبی | `#4A90D9` | لینک‌ها و highlights |
| سبز | `#22C55E` | موفقیت و تکمیل |

### فونت
- **Vazirmatn** - فونت اصلی فارسی
- وزن‌های: 100 تا 900

---

## 📱 اسکرین‌شات‌ها

| داشبورد | پروفایل | تمرین |
|---|---|---|
| داشبورد اصلی | پروفایل ورزشکار | ردیاب تمرین |

---

## 🤝 مشارکت

مشارکت شما باعث خوشحالی ماست! لطفاً مراحل زیر را دنبال کنید:

1. Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. Commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing-feature`)
5. Pull Request باز کنید

---

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

---

## 📞 ارتباط

- 📧 Email: info@aifitness-coach.com
- 🌐 Website: aifitness-coach.com
- 💬 Telegram: @aifitnesscoach

---

<div align="center">

**ساخته شده با ❤️ برای جامعه بدنسازی ایران**

⭐ اگر این پروژه برایتان مفید بود، ستاره بدهید!

</div>
