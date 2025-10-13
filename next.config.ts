import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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
