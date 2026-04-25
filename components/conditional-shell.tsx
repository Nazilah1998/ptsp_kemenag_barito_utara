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

  return (
    <>
      {header}
      <main
        className={`w-full flex-1 ${!isHome ? "pt-[76px] md:pt-[84px]" : ""}`}
      >
        {children}
      </main>
      {footer}
    </>
  );
}
