import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bookRecipe.app',
  appName: 'myRecipe',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
