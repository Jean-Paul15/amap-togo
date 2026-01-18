// Layout de l'espace client
// Navigation laterale

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClientServer } from '@amap-togo/database/server'
import { User, Package, CreditCard, Settings } from 'lucide-react'

const menuItems = [
  { href: '/compte', label: 'Mon compte', icon: User },
  { href: '/compte/commandes', label: 'Mes commandes', icon: Package },
  { href: '/compte/credits', label: 'Mes credits', icon: CreditCard },
  { href: '/compte/profil', label: 'Parametres', icon: Settings },
]

export default async function CompteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verifier l'authentification
  const supabase = await createClientServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/?auth=required')
  }

  // Recuperer le profil
  const { data: profileData } = await supabase
    .from('profils')
    .select('nom, prenom')
    .eq('id', user.id)
    .single()

  const profile = profileData as { nom: string | null; prenom: string | null } | null

  return (
    <div className="container mx-auto px-6 lg:px-12 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          {/* En-tete profil */}
          <div className="p-4 bg-accent rounded-xl mb-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold mb-3">
              {profile?.prenom?.charAt(0) || 'U'}
              {profile?.nom?.charAt(0) || ''}
            </div>
            <p className="font-semibold text-foreground">
              {profile?.prenom} {profile?.nom}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    flex items-center gap-3 px-4 py-3
                    text-sm font-medium text-foreground
                    hover:bg-muted rounded-lg transition-colors
                  "
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
