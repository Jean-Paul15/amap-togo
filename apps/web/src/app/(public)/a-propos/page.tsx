// Page A propos AMAP TOGO
// Presentation de l'association, histoire, mission et valeurs

import type { Metadata } from 'next'
import {
  Download
} from 'lucide-react'


export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez AMAP TOGO, association pionnière de l\'agriculture biologique au Togo. Depuis 2007, nous connectons producteurs et consommateurs pour une alimentation saine et locale.',
}

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <PDFViewerSection />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="bg-accent/30 border-b border-border">
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-3">
                À propos d'AMAP TOGO
              </h1>
              <p className="text-base text-muted-foreground">
                Découvrez notre brochure complète
              </p>
            </div>
            <a
              href="/documents/brochure-amap-togo.pdf"
              download="Brochure-AMAP-TOGO.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              <Download className="h-5 w-5" />
              Télécharger le PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function PDFViewerSection() {
  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-lg">
            {/* PDF Viewer */}
            <div className="relative w-full" style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
              <iframe
                src="/documents/brochure-amap-togo.pdf#view=FitH"
                className="w-full h-full"
                title="Brochure AMAP TOGO"
                style={{ border: 'none' }}
              />
            </div>

            {/* Fallback message for browsers that don't support PDF viewing */}
            <noscript>
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Votre navigateur ne peut pas afficher le PDF directement.
                </p>
                <a
                  href="/documents/brochure-amap-togo.pdf"
                  download="Brochure-AMAP-TOGO.pdf"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
                >
                  <Download className="h-5 w-5" />
                  Télécharger le PDF
                </a>
              </div>
            </noscript>
          </div>

          {/* Mobile-friendly message */}
          <div className="mt-4 p-4 bg-accent/20 rounded-lg border border-border md:hidden">
            <p className="text-sm text-muted-foreground text-center">
              💡 Pour une meilleure expérience sur mobile, téléchargez le PDF
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


