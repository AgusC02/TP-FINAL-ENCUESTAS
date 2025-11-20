// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "./components/ReactQueryProvider";
import { AppShell } from "./components/AppShell";

export const metadata: Metadata = {
  title: "Poll.inc - Plataforma de Encuestas",
  description: "Crea, administra y analiza encuestas en tiempo real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="light">
      <body className="min-h-screen bg-background-light font-display text-off-white dark:bg-background-dark dark:text-off-white">
        <ReactQueryProvider>
          <AppShell>{children}</AppShell>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
