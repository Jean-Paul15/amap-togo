/* Composant pour les breadcrumbs structurés (SEO Google) */

'use client'

import { usePathname } from 'next/navigation'
import { COMPANY, CONTACT } from '@amap-togo/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amap-togo.vercel.app'

interface BreadcrumbItem {
  name: string
  url: string
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname
    .split('/')
    .filter((p) => p)
    .slice(0, 3) // Limiter à 3 niveaux pour éviter la pollution

  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: 'Accueil',
      url: SITE_URL,
    },
  ]

  let currentPath = ''
  paths.forEach((path) => {
    currentPath += `/${path}`

    const labels: Record<string, string> = {
      produits: 'Produits',
      'produits-admin': 'Gestion Produits',
      paniers: 'Paniers',
      'paniers-admin': 'Gestion Paniers',
      'paniers-types': 'Types de Paniers',
      categories: 'Catégories',
      commandes: 'Commandes',
      clients: 'Clients',
      utilisateurs: 'Utilisateurs',
      roles: 'Rôles',
      dashboard: 'Tableau de Bord',
      diffusion: 'Diffusion Email',
      compte: 'Mon Compte',
      'a-propos': 'À Propos',
      faq: 'FAQ',
      informations: 'Informations',
    }

    const label = labels[path] || path.charAt(0).toUpperCase() + path.slice(1)

    breadcrumbs.push({
      name: label,
      url: `${SITE_URL}${currentPath}`,
    })
  })

  return breadcrumbs
}

export function StructuredBreadcrumbs() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema),
      }}
    />
  )
}

export function StructuredOrganization() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    description: COMPANY.shortDescription,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      CONTACT.socialMedia.facebook,
      CONTACT.socialMedia.instagram,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: CONTACT.contactEmail,
      availableLanguage: ['fr', 'en'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: COMPANY.country,
      addressLocality: COMPANY.city,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema),
      }}
    />
  )
}
