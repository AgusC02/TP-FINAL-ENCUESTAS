// app/polls/[id]/page.tsx

import RespondPollForm from "@/app/components/RespondPollForm";

type RespondPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RespondPage({ params }: RespondPageProps) {
  const { id } = await params;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center px-4 py-10 sm:py-16">
          <div className="layout-content-container flex w-full max-w-2xl flex-1 flex-col">
            {/* 🔶 Solo la card central con sombra */}
            <div className="w-full rounded-xl bg-[#3F5F5F] shadow-lg shadow-black/20">
              <div className="p-6 sm:p-8">
                <RespondPollForm pollId={id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
