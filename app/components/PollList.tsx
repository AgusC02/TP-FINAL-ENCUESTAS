"use client";
import { useGetAllPolls } from "@/app/hooks/usePoll";
import Link from "next/link"; // Para navegacion SPA sin recarga completa

// Estilos tipados para evitar errores
const cardStyle: React.CSSProperties = {
  background: 'white',
  padding: '15px',
  marginBottom: '10px',
  borderRadius: '8px',
  border: '1px solid #eee',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '10px'
};

const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  fontSize: '0.9em',
  fontWeight: 'bold',
};

export default function PollList() {
  const { data: polls, isLoading, isError } = useGetAllPolls();

  if (isLoading) return <p style={{textAlign: 'center'}}>Cargando historial...</p>;
  if (isError) return <p style={{color: 'red', textAlign: 'center'}}>Error al cargar historial.</p>;
  
  if (!polls || polls.length === 0) {
    return <p style={{textAlign:'center', color: '#666'}}>Todavía no hay encuestas creadas.</p>;
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Encuestas Recientes</h2>
      {polls.map((poll) => (
        <div key={poll.id} style={cardStyle}>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '1.1em' }}>{poll.title}</strong>
            <div style={{ fontSize: '0.8em', color: '#888' }}>ID: {poll.id.slice(0, 8)}...</div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Botón para votar */}
            <Link href={`/polls/${poll.id}`} style={{...linkStyle, background: '#eee', color: '#333'}}>
              🗳️ Votar
            </Link>

            {/* Botón para resultados */}
            <Link href={`/polls/${poll.id}/results`} style={{...linkStyle, background: '#e3f2fd', color: '#0070f3'}}>
              📊 Resultados
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}