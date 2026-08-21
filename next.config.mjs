/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ESLint is verified via dedicated npm run audit:i18n & lint scripts in CI/CD pipeline
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
