/** @type {import('next').NextConfig} */
const nextConfig = {
  // We're using the serverless functions, but we don't need SSR for the frontend
  reactStrictMode: true,
  // Only export the public directory on build
  output: 'standalone',
  // Configure headers to allow Telegram webhooks
  async headers() {
    return [
      {
        source: '/api/webhook/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 