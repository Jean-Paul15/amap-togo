// Carte de mission pour la page A propos
// Affiche un pilier de la mission AMAP

interface MissionCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function MissionCard({ icon, title, description }: MissionCardProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
