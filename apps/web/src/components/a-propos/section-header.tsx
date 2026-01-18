// En-tete de section pour la page A propos
// Titre avec icone dans un cercle

interface SectionHeaderProps {
  icon: React.ReactNode
  title: string
}

export function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-3xl font-semibold text-foreground">{title}</h2>
    </div>
  )
}
