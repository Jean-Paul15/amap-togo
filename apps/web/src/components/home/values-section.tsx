// Section des valeurs AMAP
// Presentation des engagements bio, local, solidaire

import { Leaf, MapPin, Users } from 'lucide-react'

/** Valeur avec icone et description */
interface Value {
  icon: typeof Leaf
  title: string
  description: string
}

const values: Value[] = [
  {
    icon: Leaf,
    title: 'Agriculture biologique',
    description: 
      'Nos produits sont cultives sans pesticides ni engrais chimiques, ' +
      'dans le respect de la terre et de votre sante.',
  },
  {
    icon: MapPin,
    title: 'Circuit court',
    description: 
      'Du producteur a votre table, sans intermediaire. ' +
      'Fraicheur garantie et prix justes pour les agriculteurs.',
  },
  {
    icon: Users,
    title: 'Economie solidaire',
    description: 
      'En choisissant AMAP, vous soutenez directement les paysans togolais ' +
      'et participez a une economie locale et durable.',
  },
]

/**
 * Section valeurs avec 3 piliers
 * Bio, local, solidaire
 */
export function ValuesSection() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground">
            Nos engagements
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            AMAP TOGO s'engage pour une agriculture paysanne 
            et une alimentation saine au Togo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Carte pour une valeur */
function ValueCard({ icon: Icon, title, description }: Value) {
  return (
    <div className="text-center">
      <div 
        className="
          w-14 h-14 mx-auto mb-4
          bg-accent rounded-xl
          flex items-center justify-center
        "
      >
        <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
      </div>

      <h3 className="text-lg font-medium text-foreground mb-2">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
