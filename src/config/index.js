const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  appName: import.meta.env.VITE_APP_NAME || 'Scheduling Automation',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
};

export default config;
