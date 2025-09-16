import { ApiService } from '@/services/api/base'

// Example: User service
export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export const userService = new ApiService('/users')

export const userApi = {
  getUsers: () => userService.get<User[]>(''),
  getUser: (id: number) => userService.get<User>(`/${id}`),
  createUser: (userData: Partial<User>) => userService.post<User>('', userData),
  updateUser: (id: number, userData: Partial<User>) =>
    userService.put<User>(`/${id}`, userData),
  deleteUser: (id: number) => userService.delete(`/${id}`)
}
