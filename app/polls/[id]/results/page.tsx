// app/polls/[id]/results/page.tsx
import PollChart from "@/app/components/PollChart";

type ResultsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const shortId = id.slice(0, 8);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Fondo propio de la página de resultados */}
        <main className="flex flex-1 justify-center px-4 py-10 sm:py-16 ">
          <div className="layout-content-container flex w-full max-w-3xl flex-1 flex-col">
            
            {/* Encabezado chico de la página */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-lg md:text-xl font-semibold text-off-white">
                Resultados de la encuesta
              </h1>
              <span className="rounded-full border border-border-color px-3 py-1 text-xs md:text-sm text-desaturated-teal">
                ID: {shortId}…
              </span>
            </div>

            {/* Card principal con el PollChart */}
            <div className="w-full rounded-2xl bg-[#3F5F5F] shadow-xl shadow-black/30 ring-1 ring-black/40">
              <div className="p-6 sm:p-8">
                <PollChart pollId={id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
