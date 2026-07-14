import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@aphrodite/database';
import { loginSchema } from '@/lib/validations/auth';
import { env } from '@/lib/env';

void env;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [Credentials({
    name: 'Email and password',
    credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Password', type: 'password' } },
    authorize: async (credentials) => {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;
      const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
      if (!user?.passwordHash || !(await compare(parsed.data.password, user.passwordHash))) return null;
      return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
    },
  })],
  callbacks: {
    jwt: ({ token, user }) => user ? { ...token, id: user.id, role: user.role } : token,
    session: ({ session, token }) => {
      session.user.id = token.id as string;
      session.user.role = token.role as 'USER' | 'CREATOR' | 'ADMIN';
      return session;
    },
  },
});
