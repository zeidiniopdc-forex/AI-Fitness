# 📱 راهنمای ساخت APK

## روش ۱: ساخت خودکار با GitHub Actions (توصیه شده)

### مراحل:

1. **Push کد به GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ai-fitness-coach.git
git push -u origin main
```

2. **GitHub Actions به صورت خودکار اجرا می‌شود:**
   - وب اپلیکیشن build می‌شود
   - Capacitor sync می‌شود
   - APK debug ساخته می‌شود
   - APK در بخش Artifacts آپلود می‌شود

3. **دانلود APK:**
   - به تب Actions در ریپازیتوری بروید
   - روی آخرین workflow اجرا شده کلیک کنید
   - در بخش Artifacts، فایل APK را دانلود کنید

### ساخت Release (با امضا):

```bash
# 1. ساخت keystore
keytool -genkey -v -keystore release-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias ai-fitness-key

# 2. تبدیل به base64
base64 -i release-keystore.jks -o keystore-base64.txt

# 3. اضافه کردن secrets به GitHub:
# Settings → Secrets → Actions → New repository secret

# 4. ساخت release
git tag v1.0.0
git push origin v1.0.0
```

---

## روش ۲: ساخت محلی

### پیش‌نیازها:

```bash
# نصب Android Studio
# https://developer.android.com/studio

# نصب Java JDK 17
# https://adoptium.net/

# تنظیم environment variables
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### مراحل ساخت:

```bash
# 1. Clone و نصب dependencies
git clone https://github.com/YOUR-USERNAME/ai-fitness-coach.git
cd ai-fitness-coach
npm install

# 2. Build وب اپلیکیشن
npm run build

# 3. Sync با Capacitor
npx cap sync android

# 4. ساخت APK debug
cd android
./gradlew assembleDebug

# 5. APK در مسیر زیر قرار می‌گیرد:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### ساخت Release محلی:

```bash
# 1. کپی keystore به پروژه
cp release-keystore.jks android/app/

# 2. ساخت release APK
cd android
./gradlew assembleRelease

# 3. APK signed در مسیر زیر:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## روش ۳: استفاده از Android Studio

1. **باز کردن پروژه:**
```bash
npx cap open android
```

2. **در Android Studio:**
   - File → Open → پوشه android
   - صبر کنید تا Gradle sync شود

3. **ساخت APK:**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - یا Run → Run 'app' برای تست روی emulator/device

4. **پیدا کردن APK:**
   - پس از build، Android Studio لینک "locate" را نشان می‌دهد
   - یا در مسیر: `android/app/build/outputs/apk/debug/`

---

## نصب APK روی دستگاه

### فعال‌سازی نصب از منابع ناشناس:

1. Settings → Security → Unknown Sources → Enable
   یا
2. Settings → Apps → Special Access → Install Unknown Apps → Enable

### نصب APK:

```bash
# روش 1: انتقال فایل
# فایل APK را به دستگاه منتقل کنید و روی آن کلیک کنید

# روش 2: با ADB
adb install app-debug.apk
```

---

## عیب‌یابی

### خطای "SDK location not found"

فایل `android/local.properties` را ایجاد کنید:
```properties
sdk.dir=/path/to/Android/Sdk
```

### خطای Gradle

```bash
cd android
./gradlew clean
./gradlew --refresh-dependencies
```

### خطای Capacitor Sync

```bash
# حذف و اضافه مجدد platform
npx cap rm android
npx cap add android
npx cap sync android
```

### خطای Keystore

```bash
# بررسی keystore
keytool -list -v -keystore release-keystore.jks

# اگر رمز را فراموش کردید، keystore جدید بسازید
```

---

## حجم APK

- **Debug APK:** ~15-20 MB
- **Release APK (با ProGuard):** ~8-12 MB
- **Release APK (با App Bundle):** ~6-10 MB

---

## بهینه‌سازی APK

### کاهش حجم:

1. **ProGuard/R8:**
   - در `build.gradle` فعال شده است
   - کدهای استفاده نشده را حذف می‌کند

2. **Resource Shrinking:**
   - منابع استفاده نشده را حذف می‌کند
   - در build type release فعال است

3. **WebP Images:**
   - تصاویر را به فرمت WebP تبدیل کنید
   - حجم تا 30% کاهش می‌یابد

### App Bundle (AAB):

```bash
# ساخت App Bundle به جای APK
cd android
./gradlew bundleRelease

# خروجی: android/app/build/outputs/bundle/release/app-release.aab
```

App Bundle برای Google Play Store استفاده می‌شود و به صورت خودکار APK بهینه برای هر دستگاه می‌سازد.

---

## انتشار در Google Play

1. **ساخت App Bundle:**
```bash
./gradlew bundleRelease
```

2. **Google Play Console:**
   - حساب توسعه‌دهنده بسازید ($25 یکبار)
   - App جدید ایجاد کنید
   - AAB را آپلود کنید
   - اطلاعات اپلیکیشن را تکمیل کنید
   - Review و Publish

---

## پشتیبانی

در صورت بروز مشکل:
1. بخش Issues در GitHub را بررسی کنید
2. Issue جدید باز کنید
3. لاگ‌های کامل را ضمیمه کنید

---

**موفق باشید! 🚀**
