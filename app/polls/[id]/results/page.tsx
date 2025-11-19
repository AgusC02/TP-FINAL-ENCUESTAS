import PollChart from "@/app/components/PollChart";

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PollChart pollId={id} />
  );
}