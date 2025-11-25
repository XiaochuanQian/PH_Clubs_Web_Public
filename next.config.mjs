/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['101.34.211.174'],
      },
      reactStrictMode: true,
      output: "standalone",
      // eslint: {
      //   // Warning: This allows production builds to successfully complete even if
      //   // your project has ESLint errors.
      //   ignoreDuringBuilds: true,
      // },
};


export default nextConfig;
