// Carte d'activite pour la page A propos
// Affiche une activite proposee par AMAP

interface ActivityCardProps {
  title: string
  description: string
}

export function ActivityCard({ title, description }: ActivityCardProps) {
  return (
    <div className="bg-white border border-border rounded-lg p-5 hover:border-primary/30 transition-colors">
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
