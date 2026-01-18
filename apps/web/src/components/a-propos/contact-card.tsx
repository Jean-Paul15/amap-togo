// Carte de contact pour la page A propos
// Affiche une information de contact

interface ContactCardProps {
  icon: React.ReactNode
  title: string
  lines: string[]
}

export function ContactCard({ icon, title, lines }: ContactCardProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <div className="pl-11 space-y-1">
        {lines.map((line, i) => (
          <p key={i} className="text-sm text-foreground/80">{line}</p>
        ))}
      </div>
    </div>
  )
}
