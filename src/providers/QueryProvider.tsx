'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Create a client
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Time in milliseconds after data is considered stale
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Time in milliseconds after which inactive queries will be removed from cache
        gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
        // Retry failed requests 3 times
        retry: 3,
        // Retry delay that increases exponentially
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus
        refetchOnWindowFocus: false,
        // Refetch on reconnect
        refetchOnReconnect: true,
        // Refetch on mount if data is stale
        refetchOnMount: true
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
        // Retry delay for mutations
        retryDelay: 1000,
        // Global error handler for mutations
        onError: error => {
          console.error('Mutation error:', error)
          // You can add global error handling here (toast notifications, etc.)
        }
      }
    }
  })
}

interface QueryProviderProps {
  children: React.ReactNode
}

let clientSingleton: QueryClient | undefined = undefined

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!clientSingleton) clientSingleton = createQueryClient()
    return clientSingleton
  }
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
          position="bottom"
        />
      )}
    </QueryClientProvider>
  )
}
