"use client"; // Grafico de barras
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useGetPollResults } from '@/app/hooks/usePoll';
import type { PollResults } from '@/app/api/polls/[id]/results/route';
import { useRouter } from 'next/navigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Genera colores aleatorios para las barras
const generateColors = (numColors: number) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(`hsla(${Math.floor(Math.random() * 360)}, 70%, 50%, 0.6)`);
  }
  return colors;
};

const formatChartData = (question: PollResults['questions'][0]) => {
  return {
    labels: question.options.map(o => o.optionText),
    datasets: [
      {
        label: 'Votos',
        data: question.options.map(o => o.votes),
        backgroundColor: generateColors(question.options.length),
      },
    ],
  };
};

export default function PollChart({ pollId }: { pollId: string }) {
  const router = useRouter();
  const resultsQuery = useGetPollResults(pollId);
  
  // Genera el link para compartir en el cliente
  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/polls/${pollId}` : '';

  if (resultsQuery.isLoading) return <p style={{textAlign:'center'}}>Cargando resultados en vivo...</p>;
  if (resultsQuery.isError) return <p style={{color: 'red', textAlign:'center'}}>Error al cargar.</p>;
  if (!resultsQuery.data) return <p style={{textAlign:'center'}}>Datos no encontrados.</p>;

  const { data: results } = resultsQuery;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{textAlign:'center'}}>{results.pollTitle}</h1>
      <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #c8e6c9' }}>
        <p style={{margin: '5px 0'}}><strong>Enlace para compartir:</strong> <a href={shareLink} style={{color:'#0070f3'}}>{shareLink}</a></p>
        <p style={{margin: '5px 0'}}><strong>Total de Votos:</strong> {results.totalVotes}</p>
      </div>

      {results.questions.map(q => (
        <div key={q.questionId} style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>{q.questionText}</h3>
          <Bar
            data={formatChartData(q)}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { ticks: { stepSize: 1 } } }
            }}
          />
        </div>
      ))}
      <button 
        onClick={() => router.push(`/polls/${pollId}`)} 
        style={{ padding: '10px 15px', background: '#333', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
        Ir a la página de votación
      </button>
    </div>
  );
}