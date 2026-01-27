// Footer du site AMAP TOGO
// Informations de contact, liens et copyright

import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Logo } from './logo'
import { COMPANY, CONTACT } from '@amap-togo/utils'

/**
 * Footer avec coordonnees et liens utiles
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo et description */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Association pour le Maintien d'une Agriculture Paysanne au Togo.
              Des produits bio et locaux, du producteur à votre table.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink href="/">Accueil</FooterLink>
              </li>
              <li>
                <FooterLink href="/produits">Produits</FooterLink>
              </li>
              <li>
                <FooterLink href="/paniers">Paniers AMAP</FooterLink>
              </li>
              <li>
                <FooterLink href="/a-propos">À propos</FooterLink>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Informations</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink href="/informations">Informations</FooterLink>
              </li>
              <li>
                <FooterLink href="/faq">FAQ</FooterLink>
              </li>
              <li>
                <FooterLink href="/mentions-legales">Mentions légales</FooterLink>
              </li>
              <li>
                <FooterLink href="/politique-confidentialite">Confidentialité</FooterLink>
              </li>
              <li>
                <FooterLink href="/conditions-generales">CGV</FooterLink>
              </li>
              <li>
                <FooterLink href="/parametres-cookies">Cookies</FooterLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3">
              <ContactItem icon={MapPin}>
                {CONTACT.address}
              </ContactItem>
              <ContactItem icon={Phone}>
                {CONTACT.primaryPhone}
              </ContactItem>
              <ContactItem icon={Mail}>
                {CONTACT.email}
              </ContactItem>
              <ContactItem icon={Clock}>
                Livraisons : {CONTACT.deliveryDay}
              </ContactItem>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            {currentYear} {COMPANY.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

/** Lien stylise pour le footer */
function FooterLink({ 
  href, 
  children 
}: { 
  href: string
  children: React.ReactNode 
}) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      {children}
    </Link>
  )
}

/** Element de contact avec icone */
function ContactItem({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <Icon className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
      <span>{children}</span>
    </li>
  )
}
