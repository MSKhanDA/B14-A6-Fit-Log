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
  // Enable compression to reduce bundle size
  webpack: (config, { isServer }) => {
    // Further optimize the build
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Disable fs module for client-side builds
      };
    }
    return config;
  },
};

module.exports = nextConfig;