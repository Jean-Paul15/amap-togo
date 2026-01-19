// Composant qui affiche un toast quand l'acces est refuse
// Detecte le parametre access_denied dans l'URL

'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Affiche un toast d'erreur si l'URL contient ?access_denied=1
 * Nettoie ensuite le parametre de l'URL
 */
export function AccessDeniedToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    const accessDenied = searchParams.get('access_denied')
    
    if (accessDenied === '1') {
      // Afficher le toast d'erreur
      toast.error('Accès refusé', {
        description: 'Vous n\'avez pas les permissions pour accéder à cette page.',
        duration: 5000,
      })
      
      // Nettoyer l'URL en retirant le parametre
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete('access_denied')
      const newUrl = newParams.toString() 
        ? `${pathname}?${newParams.toString()}`
        : pathname
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, router, pathname])
  
  return null
}
