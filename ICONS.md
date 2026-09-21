# 📱 آیکون‌های اپلیکیشن

## آیکون‌های موجود

### 1. `public/icon.svg`
- **کاربرد**: Favicon برای وب اپلیکیشن
- **فرمت**: SVG (قابل مقیاس)
- **اندازه**: 512x512
- **طراحی**: دمبل طلایی با پترن مدار AI روی پس‌زمینه تیره

### 2. `public/vite.svg`
- **کاربرد**: آیکون پیش‌فرض Vite (می‌تواند حذف شود)
- **توصیه**: استفاده از `icon.svg` به جای این فایل

### 3. Android Icons
- **مسیر**: `android/app/src/main/res/`
- **فرمت‌ها**:
  - `mipmap-anydpi-v26/ic_launcher.xml` - Adaptive icon
  - `mipmap-anydpi-v26/ic_launcher_round.xml` - Adaptive icon گرد
  - `drawable/ic_launcher_foreground.xml` - لایه جلویی
  - `drawable/ic_launcher_monochrome.xml` - نسخه تک‌رنگ
  - `values/ic_launcher_colors.xml` - رنگ‌های آیکون

## طراحی آیکون

### رنگ‌ها
- **پس‌زمینه**: `#0D0D1A` (تیره)
- **آیکون اصلی**: `#D4AF37` (طلایی)
- **هایلایت**: `#F0D060` (طلایی روشن)

### عناصر
- **دمبل**: نماد بدنسازی
- **مدار AI**: نشان‌دهنده هوش مصنوعی
- **متن "AI"**: شناسایی برند

## نحوه استفاده

### وب اپلیکیشن
آیکون به صورت خودکار در `index.html` استفاده می‌شود:
```html
<link rel="icon" type="image/svg+xml" href="/icon.svg" />
```

### Android APK
آیکون‌ها به صورت خودکار در build process استفاده می‌شوند:
1. Capacitor آیکون‌ها را از `public/` به Android project کپی می‌کند
2. Android build system از `mipmap` resources استفاده می‌کند
3. Adaptive icon برای Android 8.0+ فعال است

## به‌روزرسانی آیکون

### برای وب
فقط `public/icon.svg` را ویرایش کنید.

### برای Android
1. آیکون‌های جدید را در مسیرهای مناسب قرار دهید
2. `npx cap sync android` را اجرا کنید
3. APK جدید بسازید

## ساخت آیکون‌های مختلف

### با استفاده از ابزار آنلاین
1. به [realfavicongenerator.net](https://realfavicongenerator.net/) بروید
2. تصویر `icon.svg` را آپلود کنید
3. تمام فرمت‌ها را دانلود کنید
4. در پوشه‌های مناسب قرار دهید

### با استفاده از Android Studio
1. روی `res` راست‌کلیک کنید
2. New > Image Asset را انتخاب کنید
3. تصویر را انتخاب و تنظیم کنید
4. Finish را بزنید

## تست آیکون

### وب
- مرورگر را باز کنید
- تب باید آیکون طلایی دمبل را نشان دهد

### Android
- APK را نصب کنید
- آیکون باید در launcher نمایش داده شود
- باید با تم تیره و روشن سازگار باشد

---

**نکته**: آیکون‌ها باید در اندازه‌های مختلف برای دستگاه‌های مختلف وجود داشته باشند. Android build system به صورت خودکار این کار را انجام می‌دهد.
