/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true, // Updated from experimental.typedRoutes
  images: {
    remotePatterns: [ // Updated from deprecated domains
      {
        protocol: 'https',
        hostname: 'api.abcz.workers.dev', // Using the API domain for images
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Explicitly enable Turbopack to resolve the conflict with webpack config
  experimental: {
    turbopack: {}, // Enable Turbopack explicitly
  },
};

module.exports = nextConfig;