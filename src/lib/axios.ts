import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'

// Types for API responses
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
  success: boolean
}

export interface ApiError {
  message: string
  error?: any
  status?: number
  code?: string
}

// Create axios instance with default config
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://jsonplaceholder.typicode.com',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add auth token if available
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('auth_token')
          : null
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          params: config.params
        })
      }

      return config
    },
    (error: AxiosError) => {
      console.error('Request interceptor error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
          {
            status: response.status,
            data: response.data
          }
        )
      }

      return response
    },
    (error: AxiosError<ApiError>) => {
      // Handle common error scenarios
      if (error.response) {
        const { status, data } = error.response

        // Handle authentication errors
        if (status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
            // Redirect to login page or dispatch logout action
            window.location.href = '/login'
          }
        }

        // Handle server errors
        if (status >= 500) {
          console.error(
            'Server error:',
            data?.message || 'Internal server error'
          )
        }

        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error(
            `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
            {
              status,
              message: data?.message || error.message,
              data
            }
          )
        }

        // Return formatted error
        return Promise.reject({
          message: data?.message || 'An error occurred',
          status,
          code: data?.code
        } as ApiError)
      }

      // Network or other errors
      if (error.request) {
        console.error('Network error:', error.message)
        return Promise.reject({
          message: 'Network error. Please check your connection.',
          status: 0
        } as ApiError)
      }

      // Other errors
      console.error('Request setup error:', error.message)
      return Promise.reject({
        message: error.message || 'An unexpected error occurred'
      } as ApiError)
    }
  )

  return instance
}

// Export the configured axios instance
export const apiClient = createAxiosInstance()

// Export default axios instance
export default apiClient
