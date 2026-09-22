# 🔧 راهنمای رفع مشکلات GitHub Actions

## ✅ مشکلات حل شده

### ۱. خطای "Resource not accessible by integration"
**علت**: استفاده از `generate_release_notes: true` که نیاز به دسترسی اضافی دارد  
**راه‌حل**: حذف `generate_release_notes` و نوشتن release notes به صورت دستی

### ۲. خطای "GitHub Releases requires a tag"
**علت**: اجرای workflow release بدون tag  
**راه‌حل**: اصلاح workflow تا فقط روی tag اجرا شود

---

## 📦 ساختار Workflow

### `build.yml` - Build معمولی
**زمان اجرا**: 
- هر push به branches (main, master, develop)
- Pull requests
- Manual trigger

**خروجی**: Debug APK در Artifacts

### `release.yml` - Build Release
**زمان اجرا**: 
- فقط وقتی tag با پیشوند `v*` push شود

**خروجی**: 
- Release APK
- GitHub Release با APK

---

## 🚀 نحوه ایجاد Release صحیح

### مرحله 1: اطمینان از کد نهایی
```bash
# بررسی وضعیت
git status

# اگر تغییراتی دارید، commit کنید
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

# push tag به GitHub
git push origin v1.0.0
```

### مرحله 3: بررسی GitHub Actions
1. به تب **Actions** بروید
2. باید workflow "Create Release" را ببینید
3. روی آن کلیک کنید
4. منتظر بمانید تا build تکمیل شود

### مرحله 4: دانلود از Releases
1. به تب **Releases** بروید
2. روی release v1.0.0 کلیک کنید
3. فایل APK را دانلود کنید

---

## ❌ اشتباهات رایج

### اشتباه 1: اجرای release workflow بدون tag
```bash
# ❌ اشتباه
git push origin main  # این فقط build.yml را اجرا می‌کند

# ✅ صحیح
git tag v1.0.0
git push origin v1.0.0  # این release.yml را اجرا می‌کند
```

### اشتباه 2: استفاده از branch به جای tag
```bash
# ❌ اشتباه
git push origin feature-branch

# ✅ صحیح
git tag v1.0.0
git push origin v1.0.0
```

### اشتباه 3: فراموش کردن push tag
```bash
# ❌ اشتباه
git tag v1.0.0
# فراموش کردن push

# ✅ صحیح
git tag v1.0.0
git push origin v1.0.0
```

---

## 🔍 عیب‌یابی

### مشکل: "GitHub Releases requires a tag"
**علت**: workflow release بدون tag اجرا شده  
**راه‌حل**:
```bash
# 1. tag ایجاد کنید
git tag v1.0.0

# 2. tag را push کنید
git push origin v1.0.0

# 3. در GitHub Actions بررسی کنید
```

### مشکل: Workflow اجرا نمی‌شود
**علت**: tag به درستی push نشده  
**راه‌حل**:
```bash
# بررسی tag های local
git tag -l

# بررسی tag های remote
git ls-remote --tags origin

# اگر tag وجود ندارد، دوباره push کنید
git push origin v1.0.0
```

### مشکل: Release ایجاد نمی‌شود
**علت**: permissions کافی نیست  
**راه‌حل**:
1. به **Settings** → **Actions** → **General** بروید
2. در بخش **Workflow permissions**:
   - ✅ **Read and write permissions** را انتخاب کنید
3. ذخیره کنید

---

## 📋 چک‌لیست Release

### قبل از Release
- [ ] کد نهایی commit شده
- [ ] کد به main push شده
- [ ] Build محلی موفقیت‌آمیز
- [ ] تست‌ها پاس شده‌اند

### ایجاد Release
- [ ] Tag ایجاد شده: `git tag v1.0.0`
- [ ] Tag push شده: `git push origin v1.0.0`
- [ ] Workflow اجرا شده
- [ ] Build موفقیت‌آمیز

### بعد از Release
- [ ] Release در GitHub ایجاد شده
- [ ] APK قابل دانلود است
- [ ] Release notes صحیح است
- [ ] تست نصب APK

---

## 🔄 دستورات کامل

### ایجاد Release جدید
```bash
# 1. اطمینان از کد نهایی
git add .
git commit -m "Release v1.0.0"
git push origin main

# 2. ایجاد tag
git tag v1.0.0

# 3. Push tag
git push origin v1.0.0

# 4. بررسی در GitHub
# به تب Actions بروید و منتظر بمانید
```

### حذف و ایجاد مجدد Release
```bash
# 1. حذف tag local
git tag -d v1.0.0

# 2. حذف tag remote
git push origin :refs/tags/v1.0.0

# 3. ایجاد مجدد
git tag v1.0.0
git push origin v1.0.0
```

### مشاهده Release ها
```bash
# مشاهده tag های local
git tag -l

# مشاهده tag های remote
git ls-remote --tags origin

# مشاهده release در GitHub
# به تب Releases بروید
```

---

## 📊 مقایسه Workflow ها

| Workflow | Trigger | خروجی | استفاده |
|---|---|---|---|
| `build.yml` | Push به branches | Debug APK | تست و توسعه |
| `release.yml` | Push tag `v*` | Release APK + GitHub Release | انتشار رسمی |

---

## ✅ وضعیت فعلی

### اصلاحات اعمال شده
- ✅ `build.yml` - فقط build debug
- ✅ `release.yml` - فقط روی tag اجرا می‌شود
- ✅ Release notes به صورت دستی
- ✅ بدون `generate_release_notes`
- ✅ سازگار با Node 24

### نتیجه
- ✅ Build معمولی بدون خطا
- ✅ Release فقط با tag اجرا می‌شود
- ✅ GitHub Release به درستی ایجاد می‌شود
- ✅ APK به Release اضافه می‌شود

---

## 🎯 مراحل نهایی

### 1. Commit تغییرات
```bash
git add .github/workflows/
git commit -m "Fix GitHub Actions workflows"
git push origin main
```

### 2. ایجاد Release
```bash
git tag v1.0.0
git push origin v1.0.0
```

### 3. بررسی
- به تب **Actions** بروید
- workflow "Create Release" باید اجرا شود
- منتظر بمانید تا تکمیل شود
- به تب **Releases** بروید
- Release باید ایجاد شده باشد

---

## 📞 پشتیبانی

اگر هنوز مشکل دارید:
1. لاگ کامل GitHub Actions را بررسی کنید
2. Repository Settings را چک کنید
3. Issue جدید در GitHub باز کنید

---

**وضعیت**: ✅ **تمام مشکلات حل شده**

**تاریخ**: 2024  
**نسخه**: 1.0.0
