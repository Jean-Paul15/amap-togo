// Composant Sidebar moderne bleu fonce
// Navigation avec tous les items visibles

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Package,
  ShoppingCart,
  Users,
  ShoppingBag,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Leaf,
  ExternalLink,
  Shield,
  UserCog
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabaseClient } from '@/lib/supabase'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

interface SidebarProps {
  onNavigate?: () => void
}

// Navigation complete - routes du groupe (admin)
const navItems: NavItem[] = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Produits', href: '/produits-admin', icon: Package },
  { name: 'Catégories', href: '/categories', icon: Layers },
  { name: 'Paniers', href: '/paniers-admin', icon: ShoppingBag },
  { name: 'Types paniers', href: '/paniers-types', icon: ShoppingBag },
  { name: 'Commandes', href: '/commandes', icon: ShoppingCart },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Emails', href: '/diffusion', icon: Mail },
  { name: 'Rôles', href: '/roles', icon: Shield },
  { name: 'Utilisateurs', href: '/utilisateurs', icon: UserCog },
]

/**
 * Sidebar moderne bleu fonce avec support mobile
 */
export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    window.location.href = siteUrl
  }

  const handleLinkClick = () => {
    onNavigate?.()
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-56 h-screen bg-slate-900 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={handleLinkClick}>
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm block">AMAP TOGO</span>
            <span className="text-[10px] text-slate-400 font-medium">Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Actions bas */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <a
          href={process.env.NEXT_PUBLIC_SITE_URL || '/'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Voir le site
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
