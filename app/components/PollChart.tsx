// app/components/PollChart.tsx
"use client";

import { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useRouter } from "next/navigation";
import { useGetPollResults } from "@/app/hooks/usePoll";
import type { PollResults } from "@/app/api/polls/[id]/results/route";

// Registro de módulos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Defaults globales para mejorar contraste y tamaño
ChartJS.defaults.color = "#E5E7EB"; // gris muy claro (casi blanco)
ChartJS.defaults.font.size = 12;

type PollChartProps = {
  pollId: string;
};

// Paleta fija
const COLORS = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
  "#003f5c",
  "#58508d",
  "#bc5090",
  "#ff6361",
  "#ffa600",
  "#2f4b7c",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
];

// HISTOGRAMA
function formatChartData(question: PollResults["questions"][0]) {
  return {
    labels: question.options.map(function (o) {
      return o.optionText;
    }),
    datasets: [
      {
        label: "Votos",
        data: question.options.map(function (o) {
          return o.votes;
        }),
        backgroundColor: question.options.map(function (_, i) {
          return COLORS[i % COLORS.length];
        }),
        borderColor: "#FFFFFF",
        borderWidth: 1.5,
      },
    ],
  };
}

// TORTA
function formatPieData(question: PollResults["questions"][0]) {
  return {
    labels: question.options.map(function (o) {
      return o.optionText;
    }),
    datasets: [
      {
        data: question.options.map(function (o) {
          return o.votes;
        }),
        backgroundColor: question.options.map(function (_, i) {
          return COLORS[i % COLORS.length];
        }),
        borderWidth: 1,
        borderColor: "#FFFFFF",
      },
    ],
  };
}

export default function PollChart(props: PollChartProps) {
  var pollId = props.pollId;
  var router = useRouter();
  var query = useGetPollResults(pollId);
  var results = query.data;

  var chartTypeInitial: "bar" | "pie" = "bar";
  var _a = useState(chartTypeInitial),
    chartType = _a[0],
    setChartType = _a[1];

  var shareLink =
    typeof window !== "undefined"
      ? window.location.origin + "/polls/" + pollId
      : "";

  if (query.isLoading) {
    return (
      <div className="flex justify-center py-6 text-sm text-desaturated-teal">
        Cargando resultados en vivo...
      </div>
    );
  }

  if (query.isError) {
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

  var hasVotes = results.totalVotes > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header: título encuesta */}
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight text-off-white">
            {results.pollTitle || "Resultados de la encuesta"}
         </h2>
          <p className="text-sm md:text-base text-desaturated-teal">
            Visualizá las respuestas en tiempo real.
          </p>
        </header>

      {/* Panel info general */}
<section className="rounded-xl border border-border-color bg-black/30 px-5 py-4 text-sm md:text-base text-off-white shadow-inner">
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
          onClick={function () {
            setChartType(chartType === "bar" ? "pie" : "bar");
          }}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Ver como: {chartType === "bar" ? "torta" : "histograma"}
        </button>

        <span className="text-sm text-off-white">
          Vista actual:{" "}
          <span className="font-semibold">
            {chartType === "bar" ? "Histograma" : "Torta"}
          </span>
        </span>
      </div>

      {/* Caso sin votos */}
      {!hasVotes && (
        <div className="rounded-lg border border-border-color px-4 py-6 text-center text-sm md:text-base text-desaturated-teal">
          Todavía no hay respuestas para esta encuesta.
        </div>
      )}

      {/* Gráficos por pregunta (solo si hay votos) */}
      {hasVotes &&
        results.questions.map(function (q) {
          var questionTotal = q.options.reduce(function (acc, opt) {
            return acc + opt.votes;
          }, 0);

          return (
            <section
              key={q.questionId}
              className="mt-2 rounded-xl border border-border-color bg-black/40 p-5 shadow-md"
            >
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <h3 className="text-base md:text-lg font-semibold text-off-white">
  {q.questionText}
</h3>
<span className="text-xs md:text-sm text-desaturated-teal">
  Votos en esta pregunta: {questionTotal}
</span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4">
                {chartType === "bar" && (
                  <div className="h-72 rounded-lg bg-slate-950/60 px-3 py-3">
                    <Bar
                      data={formatChartData(q)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                            labels: {
                              color: "#F9FAFB",
                              font: {
                                size: 12,
                              },
                            },
                          },
                          tooltip: {
                            bodyColor: "#F9FAFB",
                            titleColor: "#F9FAFB",
                            titleFont: {
                              size: 14,
                            },
                            bodyFont: {
                              size: 13,
                            },
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              color: "#E5E7EB",
                              font: {
                                size: 11,
                              },
                            },
                            grid: {
                              color: "rgba(148,163,184,0.3)",
                            },
                          },
                          y: {
                            ticks: {
                              color: "#E5E7EB",
                              font: {
                                size: 11,
                              },
                            },
                            grid: {
                              color: "rgba(148,163,184,0.3)",
                            },
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                )}

                {chartType === "pie" && (
                  <div className="flex h-72 items-center justify-center rounded-lg bg-slate-950/60 px-3 py-3">
                    <Pie
                      data={formatPieData(q)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              color: "#E5E7EB",
                              font: {
                                size: 12,
                              },
                            },
                          },
                          tooltip: {
                            bodyColor: "#F9FAFB",
                            titleColor: "#F9FAFB",
                            titleFont: {
                              size: 14,
                            },
                            bodyFont: {
                              size: 13,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Resumen textual con porcentajes */}
              {questionTotal > 0 && (
                <ul className="mt-4 space-y-1 text-sm text-desaturated-teal">
                  {q.options.map(function (opt) {
                    var pct = Math.round((opt.votes / questionTotal) * 100);

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
          onClick={function () {
            router.push("/polls/" + pollId);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <span>Ir a la página de votación</span>
          <span className="material-symbols-outlined text-sm">how_to_vote</span>
        </button>
      </div>
    </div>
  );
}
