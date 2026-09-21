import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aifitness.coach',
  appName: 'دستیار هوشمند بدنسازی',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0d0d1a',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1a1a2e',
    }
  }
};

export default config;
