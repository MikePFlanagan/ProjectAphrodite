'use client';

import { useActionState } from 'react';

import { updateProfileAction, type ProfileState } from '@/app/(protected)/settings/actions';

const initialState: ProfileState = {};

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={action} className="mt-5 space-y-4">
      <label className="block text-sm text-white/70">
        <span>Name</span>
        <input
          name="name"
          required
          minLength={2}
          maxLength={60}
          defaultValue={name}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-fuchsia-200/40"
        />
      </label>
      <label className="block text-sm text-white/45">
        <span>Email</span>
        <input
          value={email}
          readOnly
          aria-readonly="true"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-white/45 outline-none"
        />
      </label>
      {state.error ? <p className="text-sm text-rose-200">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-200">{state.success}</p> : null}
      <button
        disabled={pending}
        className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#170d20] transition hover:bg-fuchsia-100 disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  );
}
