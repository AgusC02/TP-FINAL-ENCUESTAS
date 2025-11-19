"use client"; // Layout que envuelve a todas las paginas
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' }}>
        <QueryClientProvider client={queryClient}>
          <header style={{ padding: '15px 20px', background: '#fff', borderBottom: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Link href="/" style={{ color: '#333', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
              📊 Encuestas en Vivo
            </Link>
          </header>
          <main style={{ padding: '30px 20px' }}>
            {children}
          </main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
