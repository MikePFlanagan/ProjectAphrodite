import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MobileDashboardNav } from '@/components/dashboard/MobileDashboardNav';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { requireUser } from '@/lib/require-auth';
export default async function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) { const user = await requireUser(); return <div className="min-h-screen bg-[#0c0910] text-white lg:flex"><DashboardSidebar /><div className="min-w-0 flex-1 pb-20 lg:pb-0"><header className="flex h-20 items-center justify-between border-b border-white/10 px-5 sm:px-8"><p className="text-sm text-white/45">Your private space</p><UserMenu name={user.name ?? 'Member'} email={user.email} /></header><main className="mx-auto max-w-7xl p-5 sm:p-8">{children}</main></div><MobileDashboardNav /></div>; }
