/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  reactStrictMode: false, // !DANGER
  swcMinify: true,
};

module.exports = nextConfig;
