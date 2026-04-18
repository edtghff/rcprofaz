/** @type {import('next').NextConfig} */
const { URL } = require('node:url')

function supabaseStorageRemotePatterns() {
  const raw = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!raw) return []
  try {
    const { hostname, protocol } = new URL(raw)
    if (!hostname) return []
    const proto = protocol === 'https:' ? 'https' : 'http'
    return [
      {
        protocol: proto,
        hostname,
        pathname: '/storage/v1/object/public/**',
      },
    ]
  } catch {
    return []
  }
}

const nextConfig = {
  images: {
    // Env-based (SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL) + fallback for any Supabase project public bucket
    remotePatterns: [
      ...supabaseStorageRemotePatterns(),
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: false,
    minimumCacheTTL: 0,
  },
}

module.exports = nextConfig
