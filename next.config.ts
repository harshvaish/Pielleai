import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mzmigzmqxpmypbmvklfh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }, // prod bucket
      {
        protocol: 'https',
        hostname: 'gtngzgymtzhrmtyoidxr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }, // stage bucket
    ],
  },
};

export default nextConfig;
