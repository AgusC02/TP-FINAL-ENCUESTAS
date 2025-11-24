import CreatePollForm from "../components/CreatePollForm";

export default function CreatePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#2F4F4F] text-[#F8F8F8]">
           <main className="flex-1">
        <CreatePollForm />
      </main>
    </div>
  );
}
