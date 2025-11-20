/* import PollChart from "@/app/components/PollChart";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PollChart pollId={id} />
  );
} */
// app/polls/[id]/results/page.tsx
import PollChart from "@/app/components/PollChart";

type ResultsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center px-4 py-10 sm:py-16">
          <div className="layout-content-container flex w-full max-w-2xl flex-1 flex-col">
            
            <div className="w-full rounded-xl bg-[#3F5F5F] shadow-lg shadow-black/20">
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