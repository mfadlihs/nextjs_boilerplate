import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/axios'
import { userApi, User } from '@/services/api'

// Query Keys - centralized for consistency
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const
}

// Custom hook for fetching all users
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: userApi.getUsers,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

// Custom hook for fetching a single user
export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

// Custom hook for creating a user
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: Partial<User>) => userApi.createUser(userData),
    onSuccess: newUser => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })

      // Optionally add the new user to the cache
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser)

      console.log('User created successfully:', newUser)
    },
    onError: (error: ApiError) => {
      console.error('Failed to create user:', error.message)
    }
  })
}

// Custom hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<User> }) =>
      userApi.updateUser(id, userData),
    onSuccess: (updatedUser, { id }) => {
      // Update the user in cache
      queryClient.setQueryData(userKeys.detail(id), updatedUser)

      // Invalidate users list to reflect changes
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })

      console.log('User updated successfully:', updatedUser)
    },
    onError: (error: ApiError) => {
      console.error('Failed to update user:', error.message)
    }
  })
}

// Custom hook for deleting a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
    onSuccess: (_, id) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(id) })

      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })

      console.log('User deleted successfully')
    },
    onError: (error: ApiError) => {
      console.error('Failed to delete user:', error.message)
    }
  })
}

// Optimistic update hook for better UX
export const useOptimisticUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<User> }) =>
      userApi.updateUser(id, userData),
    onMutate: async ({ id, userData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) })

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(userKeys.detail(id))

      // Optimistically update to the new value
      queryClient.setQueryData(
        userKeys.detail(id),
        (old: User | undefined) =>
          ({
            ...old,
            ...userData
          } as User)
      )

      // Return a context object with the snapshotted value
      return { previousUser, id }
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUser) {
        queryClient.setQueryData(
          userKeys.detail(context.id),
          context.previousUser
        )
      }
      console.error('Failed to update user:', error)
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    }
  })
}
