'use server';

import { hash } from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { db } from '@aphrodite/database';
import { signIn, signOut } from '@/auth';
import { loginSchema, signupSchema } from '@/lib/validations/auth';

export type AuthState = { error?: string; fieldErrors?: Record<string, string[] | undefined> };

export async function signupAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const email = parsed.data.email.toLowerCase();
  if (await db.user.findUnique({ where: { email } })) {
    return { error: 'An account already exists for this email.' };
  }

  try {
    await db.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash: await hash(parsed.data.password, 12),
      },
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return { error: 'An account already exists for this email.' };
    }
    console.error('Account creation failed.');
    return { error: 'Could not create your account. Please try again.' };
  }

  redirect('/login?created=1');
}

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Email or password was not recognized.' };
    throw error;
  }
  return {};
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
