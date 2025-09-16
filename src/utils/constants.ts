// API Configuration
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://jsonplaceholder.typicode.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
} as const

// Query Keys
export const QUERY_KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  USER_POSTS: 'user-posts'
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme'
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#1677ff',
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#ff4d4f',
  INFO: '#1677ff'
} as const

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100']
} as const

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`
} as const
