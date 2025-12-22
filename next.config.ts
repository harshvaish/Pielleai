import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  serverExternalPackages: ['docusign-esign','axios', '@devhigley/parse-proxy',
    'jsonwebtoken',
    'passport-oauth2',
    'safe-buffer',
    'csv-stringify'],
  experimental: {
    serverComponentsExternalPackages: ['docusign-esign','axios','@devhigley/parse-proxy',
      'jsonwebtoken',
      'passport-oauth2',
      'safe-buffer',
      'csv-stringify'],
  },
   outputFileTracingIncludes: {
    '*': ['node_modules/docusign-esign/**','node_modules/axios/**','node_modules/@devhigley/parse-proxy/**',
      'node_modules/jsonwebtoken/**',
      'node_modules/passport-oauth2/**',
      'node_modules/safe-buffer/**',
      'node_modules/csv-stringify/**'],
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
