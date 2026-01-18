// Layout principal du back-office
// Sidebar fixe + contenu scrollable

'use client'

import { Sidebar } from './sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

/**
 * Layout moderne avec sidebar fixe
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Sidebar fixe */}
      <Sidebar />
      
      {/* Contenu principal scrollable */}
      <main className="ml-56 min-h-screen">
        <div className="p-8 max-w-[1600px] animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
