import CreatePollForm from "../components/CreatePollForm";

export default function CreatePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#2F4F4F] text-[#F8F8F8]">
      {/* Acá podrías poner tu header Poll.inc brutalista */}
      {/* ...header con logo, botones Previsualizar / Guardar borrador, etc... */}

      <main className="flex-1">
        <CreatePollForm />
      </main>
    </div>
  );
}
