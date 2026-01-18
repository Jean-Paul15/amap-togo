// Layout principal du back-office
// Sidebar fixe sur desktop + menu mobile responsive

'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

/**
 * Layout moderne avec sidebar responsive
 * Desktop : sidebar fixe a gauche
 * Mobile : menu hamburger avec overlay
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Bouton hamburger mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 h-14 flex items-center justify-between px-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-white hover:bg-slate-800 transition-colors"
          aria-label="Menu"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        <span className="font-bold text-white text-sm">AMAP TOGO Admin</span>
        <div className="w-10" /> {/* Spacer pour centrer le titre */}
      </div>

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onNavigate={closeSidebar} />
      </div>
      
      {/* Contenu principal scrollable */}
      <main className="lg:ml-56 min-h-screen pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
