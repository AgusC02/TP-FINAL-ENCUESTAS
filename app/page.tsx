// Server component por defecto
import CreatePollForm from "@/app/components/CreatePollForm"; // Importa formularios
import PollList from "@/app/components/PollList"; // Importa lista de encuestas

// Pagina de inicio
export default function HomePage() {
  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <CreatePollForm />
      
      {/* Separador visual */}
      <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #ccc' }} />
      
      {/* Lista de encuestas */}
      <PollList />
    </div>
  );
}
