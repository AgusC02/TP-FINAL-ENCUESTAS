// app/page.tsx
import Link from "next/link";
import PollList from "@/app/components/PollList";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5 md:px-10 lg:px-20 xl:px-40">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <main className="flex flex-col w-full gap-10">
              {/* Hero Poll.inc */}
            <div className="flex flex-col items-center justify-center pt-8 pb-4 text-center">
            <Link
              href="/"
              className="mb-4 flex items-center gap-4 text-primary transition hover:opacity-90"
            >
              <svg
                className="h-16 w-16"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                      </svg>
              <span className="text-5xl font-black tracking-tighter text-off-white dark:text-off-white">
                Poll.inc
              </span>
            </Link>
            </div>

              {/* Sección Crear Nueva Encuesta */}
              <section className="flex flex-col gap-6 rounded-xl border border-[#4F6F6F] bg-[#3F5F5F] p-6 shadow-sm dark:border-[#4F6F6F] dark:bg-[#3F5F5F] sm:p-8">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-off-white dark:text-off-white">
                      Crear Nueva Encuesta
                    </h2>
                    <p className="mt-1 text-base font-normal leading-normal text-desaturated-teal dark:text-desaturated-teal">
                      Comienza a recolectar feedback en minutos.
                    </p>
                  </div>

                  <Link
                    href="/create"
                    className="flex h-12 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 text-base font-bold leading-normal tracking-[0.015em] text-off-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:bg-primary/90"
                  >
                    <span className="material-symbols-outlined">
                      add_circle
                    </span>
                    <span className="truncate">Crear Encuesta</span>
                  </Link>
                </div>
              </section>

              {/* Sección Encuestas Creadas */}
              <section className="mt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-off-white dark:text-off-white">
                    Encuestas Creadas
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3F5F5F] text-off-white transition-colors hover:bg-[#4F6F6F] dark:bg-[#3F5F5F] dark:text-off-white dark:hover:bg-[#4F6F6F]">
                      <span className="material-symbols-outlined text-xl">
                        search
                      </span>
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3F5F5F] text-off-white transition-colors hover:bg-[#4F6F6F] dark:bg-[#3F5F5F] dark:text-off-white dark:hover:bg-[#4F6F6F]">
                      <span className="material-symbols-outlined text-xl">
                        filter_list
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 px-1 sm:px-0">
                  <PollList />
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
