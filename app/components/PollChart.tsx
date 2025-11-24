// app/components/PollChart.tsx
"use client";

import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { ArcElement } from "chart.js";
import { useState } from "react";

ChartJS.register(ArcElement);


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



// HISTOGRAMA -> Paleta fija de colores con bordes blancos
function formatChartData(question: PollResults["questions"][0]) {
  const colors = [
    "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
    "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab",
    "#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600",
    "#2f4b7c", "#a05195", "#d45087", "#f95d6a", "#ff7c43"
  ];

  return {
    labels: question.options.map(o => o.optionText),
    datasets: [
      {
        label: "Votos",
        data: question.options.map(o => o.votes),
        backgroundColor: question.options.map((_, i) => colors[i % colors.length]),
        borderColor: "#ffffff",
        borderWidth: 1.5,
      },
    ],
  };
}

// Torta -> Paleta fija de colores con bordes blancos

function formatPieData(question: PollResults["questions"][0]) {
  const colors = [
    "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
    "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab",
    "#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600",
    "#2f4b7c", "#a05195", "#d45087", "#f95d6a", "#ff7c43"
  ];

  return {
    labels: question.options.map(o => o.optionText),
    datasets: [
      {
        data: question.options.map(o => o.votes),
        backgroundColor: question.options.map((_, i) => colors[i % colors.length]),
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };
}


export default function PollChart({ pollId }: PollChartProps) {
  const router = useRouter();
  const { data: results, isLoading, isError } = useGetPollResults(pollId);

  // Estado para cambiar entre histograma y torta
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

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

      {/* Control para alternar tipo de gráfico */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setChartType(chartType === "bar" ? "pie" : "bar")}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Ver como: {chartType === "bar" ? "torta" : "histograma"}
        </button>

      {/* Mostrar tipo activo */}
        <span className="text-xs text-desaturated-teal">
          {chartType === "bar" ? "Histograma" : "Torta"}
        </span>
      </div>

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

              <div className="grid grid-cols-1 gap-4 mt-4">
                {chartType === "bar" && (
                  <div className="h-64">
                    <Bar
                       data={formatChartData(q)}
                       options={{
                          responsive: true,
                          maintainAspectRatio: false,
                           plugins: {
                             legend: { display: false }, 
                             title: {
                                display: true,
                                text: "Votos",
                                font: {
                                  size: 16,
                                  weight: "bold",
                                },
                                padding: 10,
                             }
                          },
                          scales: {
                             y: {
                               beginAtZero: true,
                               ticks: { stepSize: 1 },
                             },
                          },
                        }}
                     />
                  </div>
                )}

                {chartType === "pie" && (
                  <div className="h-64 flex items-center justify-center">
                    <Pie
                       data={formatPieData(q)}
                       options={{
                          plugins: {
                          legend: { position: "bottom" },
                          },
                       }}
                    />
                  </div>
                )}

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
