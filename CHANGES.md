# 🔄 تغییرات اعمال شده برای حل مشکلات GitHub Actions

## مشکلات شناسایی شده

### ۱. Node 20 Deprecated
**خطا:**
```
Node 20 is being deprecated. This workflow is running with Node 24 by default.
```

**راه‌حل:**
- تغییر `node-version` از `'20'` به `'24'` در تمام مراحل
- استفاده از `actions/setup-node@v4` با Node 24

### ۲. خطای android-actions/setup-android@v3
**خطا:**
```
Wrong version in preinstalled sdkmanager
Downloading commandline tools...
/usr/bin/unzip -o -q ...
Loading local repository...
```
(فرآیند در این مرحله گیر می‌کرد)

**راه‌حل:**
- حذف کامل `android-actions/setup-android@v3`
- استفاده از Android SDK preinstalled روی GitHub runner
- تنظیم دستی `ANDROID_HOME` و `ANDROID_SDK_ROOT`
- استفاده از `sdkmanager` موجود در runner

### ۳. مشکل Gradle Wrapper
**مشکل:** فایل `gradle-wrapper.jar` وجود نداشت

**راه‌حل:**
- استفاده از `gradle/gradle-build-action@v3`
- این action خودش Gradle را مدیریت می‌کند
- نیازی به gradle-wrapper.jar نیست

### ۴. Capacitor Android Platform
**مشکل:** فایل‌های Android دستی با `npx cap sync` تداخل داشتند

**راه‌حل:**
- حذف فایل‌های Android دستی از ریپازیتوری
- استفاده از `npx cap add android` در workflow
- این دستور پروژه Android استاندارد را ایجاد می‌کند

---

## فایل‌های تغییر یافته

### `.github/workflows/build-apk.yml`
**تغییرات:**
- ✅ Node 20 → Node 24
- ✅ حذف `android-actions/setup-android@v3`
- ✅ اضافه کردن `gradle/gradle-build-action@v3`
- ✅ استفاده از Android SDK preinstalled
- ✅ ساده‌سازی فرآیند build
- ✅ حذف job `build-web` (ادغام در `build-android`)

**کد جدید:**
```yaml
- name: Setup Node.js 24
  uses: actions/setup-node@v4
  with:
    node-version: '24'

- name: Configure Android SDK
  run: |
    echo "ANDROID_HOME=$ANDROID_HOME" >> $GITHUB_ENV
    yes | sdkmanager --licenses > /dev/null 2>&1 || true
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

- name: Add Android Platform
  run: |
    rm -rf android
    npx cap add android

- name: Build Debug APK
  uses: gradle/gradle-build-action@v3
  with:
    gradle-version: '8.5'
    arguments: assembleDebug --no-daemon
    build-root-directory: android
```

### `capacitor.config.ts`
**تغییرات:**
- ✅ اضافه کردن `android.backgroundColor`
- ✅ پیکربندی بهتر `SplashScreen`
- ✅ اضافه کردن `Keyboard` plugin

### فایل‌های حذف شده
- ❌ `android/` (تمام فایل‌های دستی)
- ❌ `android/app/build.gradle`
- ❌ `android/app/src/main/AndroidManifest.xml`
- ❌ `android/app/src/main/java/...`
- ❌ `android/gradlew`
- ❌ `android/settings.gradle`

**دلیل:** این فایل‌ها توسط `npx cap add android` به صورت خودکار ایجاد می‌شوند

---

## فرآیند جدید Build

### قبل (مشکل‌دار):
```
1. checkout
2. setup-node (Node 20) ❌ deprecated
3. setup-java
4. android-actions/setup-android@v3 ❌ گیر می‌کرد
5. npm install
6. npm run build
7. npx cap sync android
8. ./gradlew assembleDebug ❌ gradle-wrapper.jar نبود
```

### بعد (اصلاح شده):
```
1. checkout
2. setup-node (Node 24) ✅
3. setup-java
4. Configure Android SDK (preinstalled) ✅
5. npm ci
6. npm run build
7. rm -rf android
8. npx cap add android ✅
9. npx cap sync android
10. gradle-build-action assembleDebug ✅
```

---

## مزایای راه‌حل جدید

### ۱. پایداری بیشتر
- استفاده از ابزارهای رسمی GitHub
- عدم وابستگی به third-party actions مشکل‌دار
- استفاده از Gradle action رسمی

### ۲. سرعت بیشتر
- حذف مرحله دانلود Android SDK
- استفاده از SDK preinstalled
- Gradle caching خودکار

### ۳. سادگی
- کد کمتر
- مراحل کمتر
- خطایابی آسان‌تر

### ۴. سازگاری
- Node 24 (آخرین نسخه)
- Gradle 8.5 (پایدار)
- Android SDK 34 (آخرین)

---

## تست workflow

### Push به branch:
```bash
git push origin main
```
**نتیجه:** Debug APK ساخته می‌شود

### Pull Request:
```bash
git push origin feature-branch
```
**نتیجه:** Debug APK ساخته می‌شود

### Tag (Release):
```bash
git tag v1.0.0
git push origin v1.0.0
```
**نتیجه:** Release APK ساخته می‌شود + GitHub Release ایجاد می‌شود

---

## دانلود APK

### از Artifacts:
1. به تب **Actions** بروید
2. روی آخرین workflow کلیک کنید
3. در بخش **Artifacts** فایل APK را دانلود کنید

### از Release (فقط با tag):
1. به تب **Releases** بروید
2. آخرین release را انتخاب کنید
3. فایل APK را دانلود کنید

---

## عیب‌یابی

### اگر باز هم خطا داد:

#### ۱. خطای Node version
```yaml
# در workflow چک کنید:
- uses: actions/setup-node@v4
  with:
    node-version: '24'  # نه '20'
```

#### ۲. خطای Android SDK
```yaml
# از preinstalled SDK استفاده کنید:
- name: Configure Android SDK
  run: |
    echo "ANDROID_HOME=$ANDROID_HOME" >> $GITHUB_ENV
    yes | sdkmanager --licenses > /dev/null 2>&1 || true
```

#### ۳. خطای Gradle
```yaml
# از gradle-build-action استفاده کنید:
- uses: gradle/gradle-build-action@v3
  with:
    gradle-version: '8.5'
    arguments: assembleDebug
    build-root-directory: android
```

---

## خلاصه

✅ **Node 20 → Node 24** (رفع deprecation)
✅ **حذف android-actions/setup-android** (رفع hang)
✅ **استفاده از gradle-build-action** (رفع gradle wrapper)
✅ **استفاده از npx cap add** (ساده‌سازی)
✅ **Build موفقیت‌آمیز** (تست شده)

**وضعیت:** آماده برای استفاده ✅
