/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [`raw.githubusercontent.com`, "metadata.jito.network"],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
    env: {
      BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY,
      PRIVATE_KEY: process.env.PRIVATE_KEY
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
  
  module.exports = nextConfig;
  