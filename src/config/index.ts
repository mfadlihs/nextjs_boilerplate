// Application Configuration
export const appConfig = {
  // App Information
  name: 'Next.js Boilerplate',
  version: '1.0.0',
  description:
    'A comprehensive Next.js boilerplate with React Query, Ant Design, and Axios',

  // API Configuration
  api: {
    baseURL:
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://jsonplaceholder.typicode.com',
    timeout: 10000,
    retries: 3
  },

  // React Query Configuration
  reactQuery: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cache time)
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  },

  // UI Configuration
  ui: {
    theme: {
      primaryColor: '#1677ff',
      borderRadius: 8
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100']
    }
  },

  // Feature Flags
  features: {
    enableDevtools: process.env.NODE_ENV === 'development',
    enableErrorBoundary: true,
    enableAuthentication: true
  },

  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test'
  }
} as const

export default appConfig
