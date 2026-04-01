/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dehkon-tj.onrender.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
  },
  async rewrites() {
    return [];
  },
};
export default nextConfig;
