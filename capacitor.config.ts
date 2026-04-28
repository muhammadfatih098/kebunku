import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kebunku.app',
  appName: 'Kebunku',
  webDir: 'www',
  // No server.url = fully offline, loads from local assets
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: '#1C5C2E',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#1C5C2E',
      sound: 'beep.wav'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1C5C2E'
    }
  }
};

export default config;
