# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Keep Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }

# Keep JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep custom plugin
-keep class com.aifitness.coach.** { *; }

# WebView
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebViewChromeClient {
    public *;
}

# General Android rules
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# React / Web app
-keep class com.aifitness.coach.MainActivity { *; }
