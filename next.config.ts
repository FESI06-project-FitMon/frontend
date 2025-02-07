import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['fitmon-bucket.s3.amazonaws.com'],
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // ✅ Vercel 배포 시 console.log 자동 제거
  },
};

export default nextConfig;
