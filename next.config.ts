import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['fitmon-bucket.s3.amazonaws.com'],
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],

  swcMinify: true, // SWC 최적화 활성화
  experimental: {
    swcPlugins: [['next-remove-console', {}]], // 콘솔 제거 플러그인
  },
};

export default nextConfig;
