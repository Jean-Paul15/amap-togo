/* Robots.txt pour SEO */

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amaptogo.org'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/catalogue', '/paniers', '/produit/', '/categorie/', '/apropos', '/contact'],
        disallow: ['/admin', '/compte', '/api', '/auth', '/_next', '/static'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
