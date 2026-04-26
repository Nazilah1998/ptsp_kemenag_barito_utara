"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function ConditionalShell({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // For admin routes: no header, no footer, no ptsp-shell padding — just raw full-screen
    return <>{children}</>;
  }

  const isHome = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {header}
      <main
        className={`w-full flex-1 ${!isHome ? "pt-[76px] md:pt-[84px]" : ""}`}
      >
        {children}
      </main>
      {!isDashboard && footer}
      {isDashboard && (
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-[11px] font-medium text-slate-400">
          © {new Date().getFullYear()} PTSP Kantor Kementerian Agama Kab. Barito
          Utara
        </footer>
      )}
    </>
  );
}
