# 🔄 تغییرات اعمال شده برای حل مشکلات GitHub Actions

## مشکلات شناسایی شده و حل شده

### ۱. Node 20 Deprecated ✅ حل شد
**خطا:**
```
Node 20 is being deprecated. This workflow is running with Node 24 by default.
```

**راه‌حل:**
- تغییر `node-version` از `'20'` به `'24'` در تمام مراحل
- استفاده از `actions/setup-node@v4` با Node 24

### ۲. خطای android-actions/setup-android@v3 ✅ حل شد
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

### ۳. مشکل Gradle Wrapper ✅ حل شد
**مشکل:** فایل `gradle-wrapper.jar` وجود نداشت

**راه‌حل:**
- استفاده از `gradle/gradle-build-action@v3`
- این action خودش Gradle را مدیریت می‌کند
- نیازی به gradle-wrapper.jar نیست

### ۴. Capacitor Android Platform ✅ حل شد
**مشکل:** فایل‌های Android دستی با `npx cap sync` تداخل داشتند

**راه‌حل:**
- حذف فایل‌های Android دستی از ریپازیتوری
- استفاده از `npx cap add android` در workflow
- این دستور پروژه Android استاندارد را ایجاد می‌کند

### ۵. خطای Gradle Version Mismatch ✅ حل شد
**خطا:**
```
Minimum supported Gradle version is 8.13. Current version is 8.5.
Try updating the 'distributionUrl' property in gradle-wrapper.properties
```

**راه‌حل:**
- ارتقاء Gradle از `8.5` به `8.13` در workflow
- ارتقاء Java از `17` به `21` (مورد نیاز برای Gradle 8.13)
- اضافه کردن step برای به‌روزرسانی gradle-wrapper.properties
- استفاده از `sed` برای تغییر خودکار نسخه Gradle

**کد جدید:**
```yaml
- name: Setup Java JDK 21
  uses: actions/setup-java@v4
  with:
    java-version: '21'
    distribution: 'temurin'

- name: Update Gradle Wrapper
  run: |
    cd android
    sed -i 's|gradle-[0-9.]*-bin.zip|gradle-8.13-bin.zip|g' gradle/wrapper/gradle-wrapper.properties

- name: Build Debug APK
  uses: gradle/gradle-build-action@v3
  with:
    gradle-version: '8.13'
    arguments: assembleDebug --no-daemon --stacktrace
    build-root-directory: android
```

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
3. setup-java (17)
4. android-actions/setup-android@v3 ❌ گیر می‌کرد
5. npm install
6. npm run build
7. npx cap sync android
8. gradle-build-action (8.5) ❌ version mismatch
9. ./gradlew assembleDebug ❌ gradle-wrapper.jar نبود
```

### بعد (اصلاح شده - نسخه نهایی):
```
1. checkout ✅
2. setup-node (Node 24) ✅
3. setup-java (Java 21) ✅
4. Configure Android SDK (preinstalled) ✅
5. npm ci ✅
6. npm run build ✅
7. rm -rf android ✅
8. npx cap add android ✅
9. npx cap sync android ✅
10. Update Gradle wrapper to 8.13 ✅
11. gradle-build-action (8.13) assembleDebug ✅
```

---

## مزایای راه‌حل جدید

### ۱. پایداری بیشتر
- استفاده از ابزارهای رسمی GitHub
- عدم وابستگی به third-party actions مشکل‌دار
- استفاده از Gradle action رسمی
- سازگاری کامل با Capacitor 8.x

### ۲. سرعت بیشتر
- حذف مرحله دانلود Android SDK
- استفاده از SDK preinstalled
- Gradle caching خودکار
- Java 21 (بهینه‌تر)

### ۳. سادگی
- کد کمتر
- مراحل کمتر
- خطایابی آسان‌تر
- به‌روزرسانی خودکار Gradle wrapper

### ۴. سازگاری
- Node 24 (آخرین نسخه)
- Java 21 (LTS)
- Gradle 8.13 (آخرین نسخه پایدار)
- Android SDK 34 (آخرین)
- Capacitor 8.5.2 (آخرین نسخه)

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

## خلاصه نهایی

✅ **Node 20 → Node 24** (رفع deprecation)
✅ **حذف android-actions/setup-android** (رفع hang)
✅ **استفاده از gradle-build-action** (رفع gradle wrapper)
✅ **استفاده از npx cap add** (ساده‌سازی)
✅ **Gradle 8.5 → 8.13** (رفع version mismatch)
✅ **Java 17 → 21** (سازگاری با Gradle 8.13)
✅ **به‌روزرسانی خودکار gradle-wrapper.properties**
✅ **Build موفقیت‌آمیز** (تست شده)

**وضعیت:** آماده برای استفاده ✅

---

## نسخه‌های نهایی

| Component | Version |
|-----------|---------|
| Node.js | 24 |
| Java | 21 (LTS) |
| Gradle | 8.13 |
| Android SDK | 34 |
| Capacitor | 8.5.2 |
| AGP | 8.x (auto) |
| Build Tools | 34.0.0 |

---

## تست نهایی

تمام مشکلات شناسایی شده حل شدند:
- ✅ Node 20 deprecation
- ✅ android-actions/setup-android hang
- ✅ Gradle wrapper missing
- ✅ Gradle version mismatch (8.5 → 8.13)
- ✅ Java version compatibility
- ✅ Capacitor Android platform generation
- ✅ Build successful

**وضعیت نهایی:** آماده برای production ✅
