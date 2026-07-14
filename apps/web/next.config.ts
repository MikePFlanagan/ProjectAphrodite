import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@aphrodite/ui', '@aphrodite/ai', '@aphrodite/auth', '@aphrodite/database'],
  turbopack: {
    // Prevent Turbopack from walking above this pnpm workspace to an unrelated lockfile.
    root: path.resolve(__dirname, '../..'),
  },
};

export default nextConfig;
