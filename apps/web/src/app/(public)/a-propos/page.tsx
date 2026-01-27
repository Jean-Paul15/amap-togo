// Page A propos AMAP TOGO
// Presentation de l'association, histoire, mission et valeurs

import type { Metadata } from 'next'
import {
  Leaf,
  Users,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Heart,
  Sprout,
  Handshake
} from 'lucide-react'
import { COMPANY, CONTACT } from '@amap-togo/utils'
import {
  MissionCard,
  ActivityCard,
  ContactCard,
  SectionHeader
} from '@/components/a-propos'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez AMAP TOGO, association pionnière de l\'agriculture biologique au Togo. Depuis 2007, nous connectons producteurs et consommateurs pour une alimentation saine et locale.',
}

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <HistoireSection />
      <MissionSection />
      <ProductionSection />
      <ActivitesSection />
      <ContactSection />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="bg-accent/30 border-b border-border">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            À propos d'AMAP TOGO
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            L'Association pour le Maintien d'une Agriculture Paysanne au Togo,
            pionnière de l'agriculture biologique et solidaire depuis 2007.
          </p>
        </div>
      </div>
    </section>
  )
}

function HistoireSection() {
  return (
    <section className="py-16 lg:py-20 border-b border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            icon={<Calendar className="h-6 w-6 text-primary" />}
            title="Notre histoire"
          />

          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              AMAP TOGO a été créée en <strong>{COMPANY.registeredAs} par {COMPANY.founder}</strong>, avec une vision claire :
              créer un partenariat local et solidaire entre les producteurs biologiques et les consommateurs.
              Nos activités dans la région d'Amlame ont débuté dès <strong>{COMPANY.founded}</strong>.
            </p>

            <p>
              En <strong>2019</strong>, nous avons franchi une nouvelle étape en nous transformant
              en coopérative (SCOOPS AMAP-TOGO), renforçant ainsi notre engagement envers
              nos producteurs et nos membres.
            </p>

            <p>
              Sous la direction de <strong>Pierre Kpébou</strong>, qui apporte plus de 15 ans d'expérience
              en production maraîchère biologique, notre réseau s'est développé pour inclure
              <strong> 77 producteurs biologiques</strong>, principalement dans la région des Plateaux,
              à l'ouest d'Atakpamé.
            </p>

            <p>
              Membre du réseau international <strong>URGENCI</strong>, nous travaillons aujourd'hui
              avec environ 19 producteurs et 155 consommateurs à Lomé, et notre siège est situé
              au Centre de Production Agroécologique et de Formation (CFAPE-TOGO).
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function MissionSection() {
  return (
    <section className="py-16 lg:py-20 bg-accent/20 border-b border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            icon={<Leaf className="h-6 w-6 text-primary" />}
            title="Notre mission"
          />

          <div className="grid md:grid-cols-3 gap-6">
            <MissionCard
              icon={<Sprout className="h-6 w-6" />}
              title="Agriculture biologique"
              description="Promouvoir une agriculture respectueuse de l'environnement et de la santé, sans pesticides ni engrais chimiques."
            />

            <MissionCard
              icon={<Handshake className="h-6 w-6" />}
              title="Commerce équitable"
              description="Connecter directement producteurs et consommateurs pour une juste rémunération et des prix transparents."
            />

            <MissionCard
              icon={<Heart className="h-6 w-6" />}
              title="Solidarité locale"
              description="Soutenir l'économie locale et créer des liens de confiance au sein de notre communauté."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductionSection() {
  return (
    <section className="py-16 lg:py-20 border-b border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            icon={<MapPin className="h-6 w-6 text-primary" />}
            title="Nos zones de production"
          />

          <div className="bg-white border border-border rounded-xl p-6 lg:p-8">
            <p className="text-foreground/80 leading-relaxed mb-6">
              AMAP TOGO opère sur <strong>4 zones de production</strong> situées à Kpalimé
              et ses environs, caractérisées par une grande diversité de produits biologiques.
            </p>

            <div className="space-y-4">
              <ProductionZone
                title="Région des Plateaux"
                description="Principal bassin de production avec 77 producteurs"
              />
              <ProductionZone
                title="Kpalimé et environs"
                description="4 zones de production diversifiées"
              />
              <ProductionZone
                title="Gonoé"
                description="Siège du réseau, à 45 km d'Atakpamé"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductionZone({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ActivitesSection() {
  return (
    <section className="py-16 lg:py-20 bg-accent/20 border-b border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            icon={<Users className="h-6 w-6 text-primary" />}
            title="Nos activités"
          />

          <div className="space-y-4">
            <ActivityCard
              title="Paniers hebdomadaires"
              description="Distribution de paniers de fruits et légumes bio (8-10 kg) avec engagement de 3, 6 ou 12 mois."
            />
            <ActivityCard
              title="Point de retrait"
              description={`Retrait des paniers à l'${CONTACT.address}, chaque ${CONTACT.deliveryDay}.`}
            />
            <ActivityCard
              title="Ateliers de cuisine"
              description="Sessions découverte pour apprendre à cuisiner nos produits locaux et de saison."
            />
            <ActivityCard
              title="Visites de fermes"
              description="Rencontrez nos producteurs et découvrez leurs pratiques agricoles biologiques."
            />
            <ActivityCard
              title="Projections et débats"
              description="Échanges sur les enjeux alimentaires et agricoles au Togo et en Afrique."
            />
            <ActivityCard
              title="Commandes groupées"
              description="Accès à d'autres produits fermiers : viandes, œufs, miel et produits transformés."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Nous contacter
            </h2>
            <p className="text-muted-foreground">
              Une question ? Besoin d'informations ? Notre équipe est à votre écoute.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ContactCard
              icon={<Phone className="h-5 w-5" />}
              title="Téléphone"
              lines={[
                '+228 92 71 95 96',
                '+228 92 64 70 61',
                '+228 91 67 87 40'
              ]}
            />

            <ContactCard
              icon={<Mail className="h-5 w-5" />}
              title="Email"
              lines={['amap.togo@gmail.com']}
            />

            <ContactCard
              icon={<MapPin className="h-5 w-5" />}
              title="Adresse"
              lines={[
                'Ancien Centre Mytro Nunya',
                'Adidogomé (près de l\'OTR)',
                'Lomé, Togo'
              ]}
            />

            <ContactCard
              icon={<Calendar className="h-5 w-5" />}
              title="Livraison"
              lines={[
                'Chaque mercredi',
                'À partir de 11h30',
                'Point de retrait : Adidogomé'
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
