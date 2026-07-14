import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { AuthForm } from '@/components/auth/AuthForm';
import { loginAction } from '../actions';
export default function LoginPage() { return <main className="grid min-h-screen place-items-center bg-[#0c0910] px-5 py-12"><section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-black/30 backdrop-blur sm:p-9"><Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white"><span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-400 to-violet-500"><Sparkles className="size-4" /></span>Aphrodite</Link><p className="mt-9 text-xs font-semibold tracking-[0.18em] text-fuchsia-200/70">WELCOME BACK</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">Continue your conversations.</h1><AuthForm mode="login" action={loginAction} /></section></main>; }
