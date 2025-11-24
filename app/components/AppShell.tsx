// app/components/AppShell.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No mostramos el header global en la homepage "/"
  const showHeader = pathname !== "/";

  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && (
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#4F6F6F] bg-[#2F4F4F]/90 px-4 backdrop-blur-sm md:px-10 lg:px-20 xl:px-40">
          <Link href="/" className="flex items-center gap-2">
            <svg
              className="h-7 w-7 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
            <span className="text-lg font-black tracking-tight">
              Poll.inc
            </span>
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              className="rounded-md px-3 py-1 font-medium text-desaturated-teal transition-colors hover:bg-[#3F5F5F] hover:text-off-white"
            >
              Dashboard
            </Link>
            <Link
              href="/create"
              className="flex items-center gap-1 rounded-md bg-primary px-3 py-1 font-semibold text-off-white shadow-lg shadow-primary/30 transition-colors hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-base">
                add_circle
              </span>
              <span>Crear encuesta</span>
            </Link>
          </nav>
        </header>
      )}

      {/* Contenido de cada página */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
