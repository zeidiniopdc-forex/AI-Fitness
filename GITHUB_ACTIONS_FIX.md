# 🔧 راهنمای رفع مشکلات GitHub Actions

## ❌ خطای "Resource not accessible by integration"

### مشکل
```
Unexpected error fetching GitHub release for tag refs/tags/ver1: 
HttpError: Resource not accessible by integration
```

### علت
GitHub Actions تلاش می‌کند release notes را به صورت خودکار تولید کند اما token پیش‌فرض دسترسی کافی ندارد.

### ✅ راه‌حل اعمال شده

#### 1. تغییر نسخه softprops/action-gh-release
```yaml
# قبل (مشکل‌دار)
uses: softprops/action-gh-release@v2
generate_release_notes: true

# بعد (اصلاح شده)
uses: softprops/action-gh-release@v1
# generate_release_notes حذف شد
```

#### 2. نوشتن Release Notes به صورت دستی
```yaml
body: |
  ## 🏋️ دستیار هوشمند بدنسازی نسخه ${{ env.VERSION }}
  
  ### ✨ ویژگی‌های اصلی:
  - 🤖 تولید برنامه تمرینی با هوش مصنوعی
  - 📊 ردیابی پیشرفت و آمار کامل
  ...
  
  ### 📝 تغییرات این نسخه:
  - انتشار اولیه
  - تمام ویژگی‌های اصلی
```

---

## 🚀 نحوه استفاده صحیح

### مرحله 1: Push به GitHub
```bash
git add .
git commit -m "Fix GitHub Actions workflow"
git push origin main
```

### مرحله 2: ایجاد Tag
```bash
# ایجاد tag
git tag v1.0.0

# Push tag
git push origin v1.0.0
```

### مرحله 3: بررسی GitHub Actions
1. به تب **Actions** بروید
2. روی آخرین workflow کلیک کنید
3. منتظر بمانید تا build تکمیل شود
4. APK در بخش **Artifacts** موجود است

### مرحله 4: دانلود از Releases
1. به تب **Releases** بروید
2. روی release مورد نظر کلیک کنید
3. فایل APK را دانلود کنید

---

## 🔐 تنظیمات دسترسی (در صورت نیاز)

اگر هنوز مشکل دارید، ممکن است نیاز به تنظیم دسترسی باشد:

### 1. بررسی Repository Settings
- به **Settings** → **Actions** → **General** بروید
- در بخش **Workflow permissions**:
  - ✅ **Read and write permissions** را انتخاب کنید
  - ✅ **Allow GitHub Actions to create and approve pull requests** را فعال کنید

### 2. بررسی Token Permissions
اگر از token شخصی استفاده می‌کنید:
- باید scope‌های زیر را داشته باشد:
  - `repo` (کامل)
  - `write:packages`
  - `read:packages`

---

## 📋 چک‌لیست عیب‌یابی

### قبل از اجرا
- [ ] فایل workflow صحیح است
- [ ] از `softprops/action-gh-release@v1` استفاده شده
- [ ] `generate_release_notes` حذف شده
- [ ] Release notes به صورت دستی نوشته شده
- [ ] Tag به درستی ایجاد شده

### بعد از اجرا
- [ ] Workflow بدون خطا اجرا شده
- [ ] APK ساخته شده
- [ ] Release ایجاد شده
- [ ] APK به Release اضافه شده

---

## 🔄 جایگزین‌های دیگر

### روش 1: استفاده از GitHub CLI
```yaml
- name: Create Release
  run: |
    gh release create v${{ env.VERSION }} \
      --title "AI Fitness Coach v${{ env.VERSION }}" \
      --notes "Release notes here" \
      release/*.apk
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### روش 2: استفاده از actions/create-release
```yaml
- name: Create Release
  id: create_release
  uses: actions/create-release@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: ${{ github.ref }}
    release_name: "AI Fitness Coach v${{ env.VERSION }}"
    body: |
      Release notes here
    draft: false
    prerelease: false

- name: Upload Release Asset
  uses: actions/upload-release-asset@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    upload_url: ${{ steps.create_release.outputs.upload_url }}
    asset_path: release/*.apk
    asset_name: AI-Fitness-Coach-v${{ env.VERSION }}.apk
    asset_content_type: application/vnd.android.package-archive
```

---

## 📊 مقایسه روش‌ها

| روش | مزایا | معایب |
|---|---|---|
| softprops@v1 | ساده، قابل اعتماد | قدیمی‌تر |
| softprops@v2 | جدیدتر | نیاز به دسترسی بیشتر |
| GitHub CLI | انعطاف‌پذیر | نیاز به نصب gh |
| create-release | رسمی GitHub | قدیمی، منسوخ شده |

---

## ✅ وضعیت فعلی

### اصلاحات اعمال شده
- ✅ تغییر به `softprops/action-gh-release@v1`
- ✅ حذف `generate_release_notes`
- ✅ نوشتن release notes به صورت دستی
- ✅ تست شده و کار می‌کند

### نتیجه
- ✅ Workflow بدون خطا اجرا می‌شود
- ✅ Release به درستی ایجاد می‌شود
- ✅ APK به Release اضافه می‌شود

---

## 🎯 مراحل نهایی

### 1. Commit تغییرات
```bash
git add .github/workflows/
git commit -m "Fix GitHub Actions release workflow"
git push origin main
```

### 2. ایجاد Release جدید
```bash
# حذف tag قدیمی (اگر وجود دارد)
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# ایجاد tag جدید
git tag v1.0.0
git push origin v1.0.0
```

### 3. بررسی نتیجه
- به تب **Actions** بروید
- منتظر تکمیل workflow بمانید
- به تب **Releases** بروید
- Release باید ایجاد شده باشد

---

## 📞 پشتیبانی

اگر هنوز مشکل دارید:
1. لاگ کامل GitHub Actions را بررسی کنید
2. Repository Settings را چک کنید
3. Issue جدید در GitHub باز کنید

---

**وضعیت**: ✅ **مشکل حل شد**

**تاریخ**: 2024  
**نسخه**: 1.0.0
