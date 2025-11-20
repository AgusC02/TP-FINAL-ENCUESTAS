/* "use client"; // Grafico de barras
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
} */

// app/components/PollChart.tsx
"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useRouter } from "next/navigation";
import { useGetPollResults } from "@/app/hooks/usePoll";
import type { PollResults } from "@/app/api/polls/[id]/results/route";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type PollChartProps = {
  pollId: string;
};

// Colores deterministas (no cambian en cada render)
function generateColors(numColors: number) {
  const colors: string[] = [];
  for (let i = 0; i < numColors; i++) {
    const hue = Math.floor((360 / Math.max(numColors, 1)) * i);
    colors.push(`hsla(${hue}, 70%, 50%, 0.6)`);
  }
  return colors;
}

function formatChartData(question: PollResults["questions"][0]) {
  return {
    labels: question.options.map((o) => o.optionText),
    datasets: [
      {
        label: "Votos",
        data: question.options.map((o) => o.votes),
        backgroundColor: generateColors(question.options.length),
      },
    ],
  };
}

export default function PollChart({ pollId }: PollChartProps) {
  const router = useRouter();
  const { data: results, isLoading, isError } = useGetPollResults(pollId);

  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/polls/${pollId}`
      : "";

  if (isLoading) {
    return (
      <div className="flex justify-center py-6 text-sm text-desaturated-teal">
        Cargando resultados en vivo...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-6 text-sm text-red-400">
        Error al cargar los resultados.
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex justify-center py-6 text-sm text-desaturated-teal">
        Datos no encontrados.
      </div>
    );
  }

  const hasVotes = results.totalVotes > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header: título encuesta */}
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold leading-tight text-off-white">
          {results.pollTitle || "Resultados de la encuesta"}
        </h2>
        <p className="text-sm text-desaturated-teal">
          Visualizá las respuestas en tiempo real.
        </p>
      </header>

      {/* Panel info general */}
      <section className="rounded-lg border border-border-color bg-[#3F5F5F] px-4 py-3 text-sm text-off-white">
        {shareLink && (
          <p className="mb-2">
            <span className="font-semibold">Enlace para compartir:</span>{" "}
            <a
              href={shareLink}
              className="break-all text-primary underline-offset-2 hover:underline"
            >
              {shareLink}
            </a>
          </p>
        )}
        <p>
          <span className="font-semibold">Total de votos:</span>{" "}
          {results.totalVotes}
        </p>
      </section>

      {/* Caso sin votos */}
      {!hasVotes && (
        <div className="rounded-lg border border-border-color px-4 py-6 text-center text-sm text-desaturated-teal">
          Todavía no hay respuestas para esta encuesta.
        </div>
      )}

      {/* Gráficos por pregunta (solo si hay votos) */}
      {hasVotes &&
        results.questions.map((q) => {
          const questionTotal = q.options.reduce(
            (acc, opt) => acc + opt.votes,
            0
          );

          return (
            <section
              key={q.questionId}
              className="rounded-lg border border-border-color bg-[#3F5F5F] p-4"
            >
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-off-white">
                  {q.questionText}
                </h3>
                <span className="text-[11px] text-desaturated-teal">
                  Votos en esta pregunta: {questionTotal}
                </span>
              </div>

              <div className="h-64">
                <Bar
                  data={formatChartData(q)}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => {
                            const votes = ctx.parsed.y || 0;
                            return `Votos: ${votes}`;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>

              {/* Resumen textual con porcentajes */}
              {questionTotal > 0 && (
                <ul className="mt-4 space-y-1 text-xs text-desaturated-teal">
                  {q.options.map((opt) => {
                    const pct = Math.round(
                      (opt.votes / questionTotal) * 100
                    );

                    return (
                      <li
                        key={opt.optionId}
                        className="flex justify-between gap-2"
                      >
                        <span className="truncate text-off-white">
                          {opt.optionText}
                        </span>
                        <span>
                          {opt.votes} voto
                          {opt.votes !== 1 ? "s" : ""} ({pct}%)
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}

      {/* Botón volver a la votación */}
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => router.push(`/polls/${pollId}`)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <span>Ir a la página de votación</span>
          <span className="material-symbols-outlined text-sm">how_to_vote</span>
        </button>
      </div>
    </div>
  );
}
