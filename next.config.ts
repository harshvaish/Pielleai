import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mzmigzmqxpmypbmvklfh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }, // prod filli bucket
      {
        protocol: 'https',
        hostname: 'gtngzgymtzhrmtyoidxr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }, // stage filli bucket
      {
        protocol: 'https',
        hostname: 'jgjrbqnrktvderpshwvt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }, // prod bucket
      {
        protocol: 'https',
        hostname: 'jausinxleymssicnplvv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }, // stage bucket
    ],
  },
};

export default nextConfig;
