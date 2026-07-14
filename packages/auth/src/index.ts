import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthConfig } from 'next-auth';
import { db } from '@aphrodite/database';

export const authConfig = {
  adapter: PrismaAdapter(db),
  pages: { signIn: '/sign-in' },
  providers: [],
  session: { strategy: 'database' },
} satisfies NextAuthConfig;

// Add OAuth and email providers in the web app once their environment variables are configured.
