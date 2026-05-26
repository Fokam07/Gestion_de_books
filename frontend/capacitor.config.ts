import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: process.env.APP_ID || 'com.shelfio.app',
  appName: process.env.APP_NAME || 'Shelfio',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;