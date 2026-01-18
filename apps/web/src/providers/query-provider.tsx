// Provider TanStack Query pour les composants client
// Gere le cache et les mutations cote client

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'

interface QueryProviderProps {
  children: ReactNode
}

/**
 * Provider TanStack Query
 * Configure le cache avec des valeurs adaptees a un site e-commerce
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Donnees produits valides 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache conserve 30 minutes
            gcTime: 30 * 60 * 1000,
            // Pas de refetch auto sur focus (evite les requetes inutiles)
            refetchOnWindowFocus: false,
            // Retry une fois en cas d'erreur
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
