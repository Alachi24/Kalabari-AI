/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a self-contained build (.next/standalone) for a minimal Docker runtime image.
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
