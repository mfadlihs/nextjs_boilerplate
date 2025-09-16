import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  postApi,
  Post,
  CreatePostRequest,
  UpdatePostRequest
} from '@/services/api'
import { ApiError } from '@/lib/axios'

// Query Keys for posts
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: string) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
  byUser: (userId: number) => [...postKeys.all, 'byUser', userId] as const
}

// Hook for fetching all posts
export const usePosts = () => {
  return useQuery({
    queryKey: postKeys.lists(),
    queryFn: postApi.getPosts,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

// Hook for fetching a single post
export const usePost = (id: number) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postApi.getPost(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  })
}

// Hook for fetching posts by user
export const usePostsByUser = (userId: number) => {
  return useQuery({
    queryKey: postKeys.byUser(userId),
    queryFn: () => postApi.getPostsByUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000
  })
}

// Hook for creating a post
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postData: CreatePostRequest) => postApi.createPost(postData),
    onSuccess: newPost => {
      // Invalidate posts lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: postKeys.byUser(newPost.userId)
      })

      // Add new post to cache
      queryClient.setQueryData(postKeys.detail(newPost.id), newPost)

      console.log('Post created successfully:', newPost)
    },
    onError: (error: ApiError) => {
      console.error('Failed to create post:', error.message)
    }
  })
}

// Hook for updating a post
export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      postData
    }: {
      id: number
      postData: UpdatePostRequest
    }) => postApi.updatePost(id, postData),
    onSuccess: (updatedPost, { id }) => {
      // Update post in cache
      queryClient.setQueryData(postKeys.detail(id), updatedPost)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: postKeys.byUser(updatedPost.userId)
      })

      console.log('Post updated successfully:', updatedPost)
    },
    onError: (error: ApiError) => {
      console.error('Failed to update post:', error.message)
    }
  })
}

// Hook for deleting a post
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onMutate: async id => {
      // Get the post data before deletion for rollback
      const post = queryClient.getQueryData(postKeys.detail(id)) as Post
      return { post }
    },
    onSuccess: (_, id, context) => {
      // Remove post from cache
      queryClient.removeQueries({ queryKey: postKeys.detail(id) })

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      if (context?.post) {
        queryClient.invalidateQueries({
          queryKey: postKeys.byUser(context.post.userId)
        })
      }

      console.log('Post deleted successfully')
    },
    onError: (error: ApiError) => {
      console.error('Failed to delete post:', error.message)
    }
  })
}

// Infinite query hook for posts (useful for pagination)
export const useInfinitePosts = () => {
  return useQuery({
    queryKey: [...postKeys.lists(), 'infinite'],
    queryFn: ({ pageParam = 1 }) => {
      // This is a mock implementation - adjust based on your API
      return postApi.getPosts()
    },
    staleTime: 5 * 60 * 1000
  })
}
