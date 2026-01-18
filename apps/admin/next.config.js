/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@amap-togo/ui', '@amap-togo/database', '@amap-togo/utils', '@refinedev/nextjs-router'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Désactiver le static export car Refine nécessite SSR
  output: 'standalone',
}

module.exports = nextConfig
