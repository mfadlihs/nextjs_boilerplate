import { ApiService } from '@/services/api/base'

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export interface CreatePostRequest {
  title: string
  body: string
  userId: number
}

export interface UpdatePostRequest {
  id: number
  title: string
  body: string
  userId: number
}

// Post API service
export const postService = new ApiService('/posts')

export const postApi = {
  getPosts: () => postService.get<Post[]>(''),
  getPost: (id: number) => postService.get<Post>(`/${id}`),
  getPostsByUser: (userId: number) =>
    postService.get<Post[]>(`?userId=${userId}`),
  createPost: (postData: CreatePostRequest) =>
    postService.post<Post>('', postData),
  updatePost: (id: number, postData: UpdatePostRequest) =>
    postService.put<Post>(`/${id}`, postData),
  deletePost: (id: number) => postService.delete(`/${id}`)
}
