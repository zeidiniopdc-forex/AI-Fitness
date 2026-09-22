# 🚀 راهنمای سریع ایجاد Release

## ⚡ دستورات سریع

### ایجاد Release v1.0.0
```bash
# 1. Commit تغییرات (اگر دارید)
git add .
git commit -m "Release v1.0.0"
git push origin main

# 2. ایجاد tag
git tag v1.0.0

# 3. Push tag
git push origin v1.0.0
```

### تمام! 🎉
- به تب **Actions** در GitHub بروید
- workflow "Create Release" را ببینید
- منتظر بمانید تا تکمیل شود
- به تب **Releases** بروید
- APK را دانلود کنید

---

## 📋 مراحل گام به گام

### مرحله 1: آماده‌سازی کد
```bash
# بررسی وضعیت
git status

# اگر تغییراتی دارید
git add .
git commit -m "Prepare for release v1.0.0"
git push origin main
```

### مرحله 2: ایجاد Tag
```bash
# ایجاد tag
git tag v1.0.0

# بررسی tag
git tag -l
```

### مرحله 3: Push Tag
```bash
# push tag به GitHub
git push origin v1.0.0
```

### مرحله 4: بررسی GitHub Actions
1. به GitHub بروید
2. به تب **Actions** بروید
3. workflow "Create Release" را ببینید
4. روی آن کلیک کنید
5. منتظر بمانید تا build تکمیل شود

### مرحله 5: دانلود APK
1. به تب **Releases** بروید
2. روی release v1.0.0 کلیک کنید
3. فایل `AI-Fitness-Coach-v1.0.0.apk` را دانلود کنید

---

## ❌ اشتباهات رایج

### اشتباه: اجرای release بدون tag
```bash
# ❌ اشتباه
git push origin main  # این فقط build.yml را اجرا می‌کند

# ✅ صحیح
git tag v1.0.0
git push origin v1.0.0  # این release.yml را اجرا می‌کند
```

### اشتباه: فراموش کردن push tag
```bash
# ❌ اشتباه
git tag v1.0.0
# فراموش کردن push!

# ✅ صحیح
git tag v1.0.0
git push origin v1.0.0
```

---

## 🔍 عیب‌یابی سریع

### مشکل: "GitHub Releases requires a tag"
**راه‌حل**:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### مشکل: Workflow اجرا نمی‌شود
**راه‌حل**:
```bash
# بررسی tag
git tag -l

# push مجدد
git push origin v1.0.0
```

### مشکل: Release ایجاد نمی‌شود
**راه‌حل**:
1. به **Settings** → **Actions** → **General** بروید
2. **Read and write permissions** را فعال کنید

---

## 🔄 حذف و ایجاد مجدد Release

```bash
# حذف tag local
git tag -d v1.0.0

# حذف tag remote
git push origin :refs/tags/v1.0.0

# ایجاد مجدد
git tag v1.0.0
git push origin v1.0.0
```

---

## 📊 چه اتفاقی می‌افتد؟

### وقتی push به main می‌کنید:
- ✅ workflow `build.yml` اجرا می‌شود
- ✅ Debug APK ساخته می‌شود
- ✅ در Artifacts قابل دانلود است
- ❌ Release ایجاد نمی‌شود

### وقتی tag push می‌کنید:
- ✅ workflow `release.yml` اجرا می‌شود
- ✅ Release APK ساخته می‌شود
- ✅ GitHub Release ایجاد می‌شود
- ✅ APK به Release اضافه می‌شود

---

## 🎯 خلاصه

### برای Build معمولی (Debug):
```bash
git push origin main
```
**نتیجه**: Debug APK در Artifacts

### برای Release رسمی:
```bash
git tag v1.0.0
git push origin v1.0.0
```
**نتیجه**: Release APK + GitHub Release

---

## 📞 نیاز به کمک؟

فایل `GITHUB_ACTIONS_FIX.md` را مطالعه کنید.

---

**وضعیت**: ✅ **آماده برای Release**

**دستور نهایی**:
```bash
git tag v1.0.0
git push origin v1.0.0
```
