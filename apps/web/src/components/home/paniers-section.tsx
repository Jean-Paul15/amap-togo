// Section des paniers AMAP
// Affiche les 3 types de paniers avec prix

import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@amap-togo/utils'

/** Definition d'un type de panier */
interface PanierInfo {
  type: string
  nom: string
  prix: number
  description: string
  contenuExemple: string[]
}

const paniers: PanierInfo[] = [
  {
    type: 'petit',
    nom: 'Petit panier classique',
    prix: 4500,
    description: 'Ideal pour 1 a 2 personnes, une selection de legumes frais.',
    contenuExemple: ['Tomates', 'Oignons', 'Gombo', 'Piment'],
  },
  {
    type: 'grand',
    nom: 'Grand panier classique',
    prix: 8000,
    description: 'Pour les familles, une grande variete de legumes et fruits.',
    contenuExemple: ['Tomates', 'Carottes', 'Choux', 'Bananes', 'Ignames'],
  },
  {
    type: 'local',
    nom: 'Panier 100% local',
    prix: 4000,
    description: 'Uniquement des produits traditionnels togolais.',
    contenuExemple: ['Ademe', 'Gboma', 'Gombo', 'Gari'],
  },
]

/**
 * Section presentant les 3 types de paniers AMAP
 */
export function PaniersSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground">
            Nos paniers hebdomadaires
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Chaque semaine, recevez un panier compose par nos soins 
            avec les meilleurs produits de saison.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {paniers.map((panier) => (
            <PanierCard key={panier.type} {...panier} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/paniers"
            className="
              inline-flex items-center gap-2
              text-primary font-medium
              hover:underline
            "
          >
            Voir tous les paniers de la semaine
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Carte d'un type de panier */
function PanierCard({ nom, prix, description, contenuExemple }: PanierInfo) {
  return (
    <div 
      className="
        bg-background border border-border rounded-xl p-6
        hover:border-primary/50 transition-colors
      "
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="font-medium text-foreground">{nom}</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Exemple de contenu :</p>
        <p className="text-sm text-foreground">
          {contenuExemple.join(', ')}
        </p>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xl font-semibold text-primary">
          {formatPrice(prix)}
        </span>
        <Link
          href="/paniers"
          className="
            text-sm font-medium text-primary
            hover:underline
          "
        >
          Commander
        </Link>
      </div>
    </div>
  )
}
