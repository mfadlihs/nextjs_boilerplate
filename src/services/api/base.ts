import { apiClient, ApiResponse } from '@/lib/axios'

// Generic API service class
export class ApiService {
  private baseEndpoint: string

  constructor(baseEndpoint: string) {
    this.baseEndpoint = baseEndpoint
  }

  // GET request
  async get<T>(
    endpoint: string = '',
    params?: Record<string, any>
  ): Promise<T> {
    const response = await apiClient.get<T>(`${this.baseEndpoint}${endpoint}`, {
      params
    })
    return response.data
  }

  // POST request
  async post<T>(endpoint: string = '', data?: any): Promise<T> {
    const response = await apiClient.post<T>(
      `${this.baseEndpoint}${endpoint}`,
      data
    )
    return response.data
  }

  // PUT request
  async put<T>(endpoint: string = '', data?: any): Promise<T> {
    const response = await apiClient.put<T>(
      `${this.baseEndpoint}${endpoint}`,
      data
    )
    return response.data
  }

  // PATCH request
  async patch<T>(endpoint: string = '', data?: any): Promise<T> {
    const response = await apiClient.patch<T>(
      `${this.baseEndpoint}${endpoint}`,
      data
    )
    return response.data
  }

  // DELETE request
  async delete<T>(endpoint: string = ''): Promise<T> {
    const response = await apiClient.delete<T>(
      `${this.baseEndpoint}${endpoint}`
    )
    return response.data
  }
}
