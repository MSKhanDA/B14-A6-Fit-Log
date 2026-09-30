/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['localhost', 'your-api-domain.com'], // Add your image domains here
  },
};

module.exports = nextConfig;