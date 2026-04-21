import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[calc(100dvh-80px)] overflow-hidden pt-2 pb-1 md:min-h-[calc(100dvh-88px)] md:pt-3 md:pb-2">
      {children}
    </main>
  );
}
