import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { Button } from '@/components/ui/button';

export async function SiteHeader() {
  const profile = await getCurrentProfile();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-green-800">
          PTSP Kemenag Barito Utara
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/layanan" className="text-slate-700 hover:text-green-700">
            Layanan
          </Link>
          {profile ? (
            <>
              <Link
                href={profile.role === 'admin' ? '/admin' : '/dashboard'}
                className="text-slate-700 hover:text-green-700"
              >
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-700 hover:text-green-700">
                Login
              </Link>
              <Link href="/register">
                <Button>Daftar</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
