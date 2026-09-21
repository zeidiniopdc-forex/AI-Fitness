# 🚀 راهنمای سریع شروع کار

## ساخت APK با GitHub Actions

### مرحله ۱: ایجاد ریپازیتوری GitHub

```bash
# ایجاد ریپازیتوری جدید در GitHub
# سپس:
git init
git add .
git commit -m "🏋️ Initial commit - AI Fitness Coach"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ai-fitness-coach.git
git push -u origin main
```

### مرحله ۲: GitHub Actions خودکار اجرا می‌شود!

پس از push، GitHub Actions به صورت خودکار:
1. ✅ وب اپلیکیشن را build می‌کند
2. ✅ Capacitor sync انجام می‌دهد
3. ✅ APK debug می‌سازد
4. ✅ APK را در Artifacts آپلود می‌کند

### مرحله ۳: دانلود APK

1. به ریپازیتوری GitHub بروید
2. تب **Actions** را انتخاب کنید
3. روی آخرین workflow کلیک کنید
4. در بخش **Artifacts** فایل APK را دانلود کنید
5. APK را روی دستگاه Android نصب کنید

---

## ساخت Release APK (با امضا)

### ۱. ساخت Keystore

```bash
keytool -genkey -v \
  -keystore release-keystore.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias ai-fitness-key
```

### ۲. تبدیل به Base64

```bash
# Linux/Mac
base64 -i release-keystore.jks > keystore-base64.txt

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release-keystore.jks")) | Out-File keystore-base64.txt
```

### ۳. اضافه کردن Secrets به GitHub

به مسیر `Settings → Secrets and variables → Actions` بروید و این secrets را اضافه کنید:

| نام Secret | مقدار |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | محتوای فایل base64 |
| `ANDROID_KEYSTORE_PATH` | `app/release-keystore.jks` |
| `ANDROID_KEYSTORE_PASSWORD` | رمز keystore |
| `ANDROID_KEY_ALIAS` | `ai-fitness-key` |
| `ANDROID_KEY_PASSWORD` | رمز key |

### ۴. ساخت Release

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions به صورت خودکار:
- ✅ Release APK signed می‌سازد
- ✅ GitHub Release ایجاد می‌کند
- ✅ APK را به Release اضافه می‌کند

---

## ساخت محلی (بدون GitHub)

```bash
# نصب dependencies
npm install

# Build وب
npm run build

# Sync با Capacitor
npx cap sync android

# ساخت APK
cd android
./gradlew assembleDebug

# APK در مسیر:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## ساختار فایل‌های مهم

```
├── .github/workflows/build-apk.yml  ← GitHub Actions
├── android/                          ← پروژه Android
│   ├── app/build.gradle             ← تنظیمات build
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       └── java/com/aifitness/coach/
├── src/                              ← کد React
├── capacitor.config.ts              ← تنظیمات Capacitor
├── README.md                        ← راهنمای کامل
└── BUILD_APK.md                     ← راهنمای ساخت APK
```

---

## خلاصه سریع

| عمل | دستور |
|---|---|
| Build وب | `npm run build` |
| Sync Capacitor | `npx cap sync android` |
| ساخت Debug APK | `cd android && ./gradlew assembleDebug` |
| ساخت Release APK | `cd android && ./gradlew assembleRelease` |
| نصب روی دستگاه | `adb install app-debug.apk` |

---

**آماده‌اید! 🎉**

APK شما از طریق GitHub Actions به صورت خودکار ساخته می‌شود.
