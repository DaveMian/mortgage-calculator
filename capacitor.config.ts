import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'et.combanketh.diasporamortgage',
  appName: 'CBE Diaspora Mortgage',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#501344',
      showSpinner: false,
    }
  }
};

export default config;
