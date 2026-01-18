/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@amap-togo/ui', '@amap-togo/database', '@amap-togo/utils'],
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
}

module.exports = nextConfig
