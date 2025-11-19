// Server component
import RespondPollForm from "@/app/components/RespondPollForm";

export default async function RespondPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <RespondPollForm pollId={id} /> // Renderiza el componente cliente pasandole el id
  );
}