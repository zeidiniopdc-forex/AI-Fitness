# 🏋️ AI Fitness Coach | دستیار هوشمند بدنسازی

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-D4AF37?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Android-14B8A6?style=for-the-badge)
![Min Android](https://img.shields.io/badge/min%20android-7.0-0D9488?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-22C55E?style=for-the-badge)

**Professional AI-Powered Bodybuilding Assistant**

*An intelligent app for coaches and athletes*

[📥 Download APK](#-download) • [📖 Documentation](#-documentation) • [🇮🇷 مستندات فارسی](README_FA.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Download](#-download)
- [Installation](#-installation)
- [Build from Source](#-build-from-source)
- [Release Process](#-release-process)
- [Cafe Bazaar](#-cafe-bazaar-publishing)
- [Tech Stack](#-tech-stack)

---

## 🎯 Overview

AI Fitness Coach is a professional application that uses artificial intelligence to generate personalized workout programs for athletes. This app helps coaches and athletes:

- 📊 Collect and manage athlete information
- 🧠 Generate professional AI prompts
- 📋 Import and manage workout programs
- 🏃 Track daily workouts
- 📈 Analyze long-term progress
- 📅 Plan with Persian calendar

---

## ✨ Features

### 🤖 AI Integration
- **Professional Prompt Generation**: Creates scientific prompts based on athlete data
- **Compatible with ChatGPT, Gemini, Claude**: JSON output for all AI models
- **Scientific Principles**: Based on Schoenfeld, Helms, Israetel research

### 👥 Multi-Profile Management
- **Unlimited Profiles**: Separate profile for each athlete
- **Quick Switch**: Change between profiles with one click
- **Independent Data**: Each profile has its own programs and stats

### 🏋️ Professional Workout Tracker
- **Today's Workout**: Auto-display of daily workout
- **Rest Timer**: Auto-start after each set
- **Weight & Rep Logging**: Accurate performance tracking
- **Cancel Session**: Cancel without saving to history
- **Live Progress**: Progress bar during workout

### 📊 Professional Dashboard
- **Complete Stats**: Sessions, volume, streak, weekly goal
- **Weight Chart**: Weight trend visualization
- **Last Session**: Complete last workout info
- **Weekly Progress**: Progress bar with 7-day view

### 📅 Persian Calendar
- **Jalali Calendar**: Fully Persian
- **Session Display**: Workout days marked
- **Weekly Schedule**: View training program

### 📈 Progress & Analytics
- **Body Measurements**: Weight, waist, arms, etc.
- **Radar Chart**: Muscle analysis
- **Complete History**: All measurements

### 🎨 Professional Design
- **Dark Theme**: Gold and blue
- **Light Theme**: Green and teal
- **Full RTL**: Complete Persian support
- **Vazirmatn Font**: Professional typography

---

## 📥 Download

### Latest Release
Download the latest APK from [GitHub Releases](../../releases/latest)

### All Versions
All versions are available at [Releases Page](../../releases)

### Build from Source
See [Build from Source](#-build-from-source) section

---

## 📱 Installation

### Method 1: Direct APK Installation
1. Download APK file from GitHub
2. Tap on the APK file
3. Grant "Install from Unknown Sources" permission
4. Complete installation

### Method 2: Using ADB
```bash
adb install AI-Fitness-Coach-v1.0.0.apk
```

### Enable Unknown Sources
**Android 8.0+:**
- Settings → Apps → Special Access → Install Unknown Apps
- Select browser or File Manager
- Enable "Allow from this source"

**Android 7.0:**
- Settings → Security → Unknown Sources → Enable

---

## 🛠 Build from Source

### Prerequisites
- Node.js 18+
- npm 9+
- Android Studio (for local build)
- Java JDK 21

### Build Steps

```bash
# Clone repository
git clone https://github.com/your-username/ai-fitness-coach.git
cd ai-fitness-coach

# Install dependencies
npm install

# Build web app
npm run build

# Sync with Capacitor
npx cap sync android

# Build APK
cd android
./gradlew assembleDebug

# APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Build Release APK

```bash
# Generate signing key
keytool -genkey -v -keystore release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias ai-fitness-key

# Build release
cd android
./gradlew assembleRelease
```

---

## 🚀 Release Process

### 1. Update Version
```bash
# Update version in package.json
npm version 1.0.1
```

### 2. Create Tag
```bash
git tag v1.0.1
git push origin v1.0.1
```

### 3. GitHub Actions
- GitHub Actions runs automatically
- Release APK is built
- GitHub Release is created
- APK is attached to Release

### 4. Download from Releases
- Go to Releases tab
- Download latest version

---

## 📱 Cafe Bazaar Publishing

See [CAFE_BAZAAR.md](CAFE_BAZAAR.md) for complete guide on publishing to Cafe Bazaar.

### Quick Steps
1. Build signed release APK
2. Prepare 512x512 icon
3. Take screenshots
4. Write Persian description
5. Upload to Cafe Bazaar developer console

---

## 🛠 Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Recharts** - Charts
- **Lucide React** - Icons
- **Jalaali JS** - Persian Calendar

### Android
- **Capacitor 5** - Native bridge
- **Kotlin** - Native code
- **Material Design 3** - UI
- **Android SDK 34** - Target

### Build & CI/CD
- **GitHub Actions** - Automated builds
- **Gradle 8.13** - Build system
- **Java 21** - Runtime

---

## 📊 Technical Information

| Item | Value |
|---|---|
| Min Android | 7.0 (API 24) |
| Target Android | 14 (API 34) |
| APK Size | ~15 MB |
| Architecture | Universal |
| Language | Persian (RTL) |
| Font | Vazirmatn |

---

## 🎨 Design

### Dark Theme
```
Background: #0A0A15 → #0D0D1A
Card: #1A1A2E → #16213E
Accent: #D4AF37 (Gold)
Secondary: #4A90D9 (Blue)
Success: #22C55E (Green)
```

### Light Theme
```
Background: #F0FDFA → #FFFFFF → #ECFDF5
Card: #FFFFFF → #F0FDFA
Accent: #14B8A6 (Teal)
Secondary: #0D9488 (Dark Teal)
Text: #134E4A (Dark Green)
```

---

## 🤝 Contributing

Contributions are welcome!

### How to Contribute
1. Fork the repository
2. Create new branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Report Issues
- Use [Issues](../../issues)
- Write detailed description
- Add screenshots

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Contact

- 📧 Email: info@aifitness-coach.com
- 🌐 Website: aifitness-coach.com
- 💬 Telegram: @aifitnesscoach

---

## 🙏 Acknowledgments

- **Vazirmatn Font** - Saber Rastikerdar
- **Lucide Icons** - Lucide Contributors
- **Capacitor** - Ionic Team
- **React** - Meta

---

<div align="center">

**Made with ❤️ for the Iranian bodybuilding community**

⭐ If this project is useful to you, give it a star!

[⬆ Back to Top](#-ai-fitness-coach---)

</div>
