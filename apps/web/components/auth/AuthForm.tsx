'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { LoaderCircle } from 'lucide-react';
import type { AuthState } from '@/app/(auth)/actions';

type Props = { mode: 'login' | 'signup'; action: (state: AuthState, formData: FormData) => Promise<AuthState> };
const initialState: AuthState = {};
export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const signup = mode === 'signup';
  const fieldError = (name: string) => state.fieldErrors?.[name]?.[0];
  return <form action={formAction} className="mt-8 space-y-4" noValidate>
    {signup && <Field label="Name" name="name" error={fieldError('name')} autoComplete="name" />}
    <Field label="Email" name="email" type="email" error={fieldError('email')} autoComplete="email" />
    <Field label="Password" name="password" type="password" error={fieldError('password')} autoComplete={signup ? 'new-password' : 'current-password'} hint={signup ? 'At least 8 characters.' : undefined} />
    {signup && <Field label="Confirm password" name="confirmPassword" type="password" error={fieldError('confirmPassword')} autoComplete="new-password" />}
    {state.error && <p className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">{state.error}</p>}
    <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#170d20] disabled:opacity-60">{pending && <LoaderCircle className="size-4 animate-spin" />}{signup ? 'Create account' : 'Login'}</button>
    <p className="text-center text-sm text-white/50">{signup ? 'Already have an account?' : 'New to Aphrodite?'} <Link href={signup ? '/login' : '/signup'} className="font-medium text-fuchsia-200 hover:text-white">{signup ? 'Login' : 'Create an account'}</Link></p>
  </form>;
}
function Field({ label, name, type = 'text', error, hint, autoComplete }: { label: string; name: string; type?: string; error?: string; hint?: string; autoComplete: string }) { return <label className="block text-sm text-white/75"><span>{label}</span><input required name={name} type={type} autoComplete={autoComplete} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-300/50" />{error ? <span className="mt-1 block text-xs text-rose-200">{error}</span> : hint ? <span className="mt-1 block text-xs text-white/35">{hint}</span> : null}</label>; }
