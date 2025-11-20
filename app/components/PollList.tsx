"use client";

import Link from "next/link";
import { useGetAllPolls } from "@/app/hooks/usePoll";

export default function PollList() {
  const { data: polls, isLoading, isError } = useGetAllPolls();

  if (isLoading) {
    return (
      <div className="flex justify-center py-6 text-sm text-desaturated-teal">
        Cargando encuestas...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-6 text-sm text-red-400">
        Error al cargar encuestas.
      </div>
    );
  }

  if (!polls || polls.length === 0) {
    return (
      <div className="flex justify-center py-6 text-sm text-desaturated-teal">
        Todavía no hay encuestas creadas.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Subtítulo */}
      <div className="pb-1 text-center text-xs font-semibold uppercase tracking-[0.16em] text-desaturated-teal">
        Encuestas Recientes
      </div>

      {polls.map((poll) => (
        <div
          key={poll.id}
          className="grid gap-4 rounded-xl border border-[#4F6F6F] bg-[#3F5F5F] p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-lg sm:grid-cols-[1fr_auto]"
        >
          {/* Info principal */}
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-off-white">
              {poll.title || "Encuesta sin título"}
            </p>
            <div className="mt-1 text-[11px] text-desaturated-teal">
              ID: {poll.id?.slice(0, 8)}...
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-start gap-2 sm:justify-end">
            {/* Botón Votar - naranja sólido */}
            <Link
              href={`/polls/${poll.id}`}
              className="flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-off-white shadow-lg shadow-primary/30 transition-colors hover:bg-primary/90"
            >
              🗳️ Votar
            </Link>

            {/* Botón Resultados - variante suave naranja */}
            <Link
              href={`/polls/${poll.id}/results`}
              className="flex h-9 items-center justify-center rounded-lg border border-primary bg-primary/15 px-4 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-primary/25"
            >
              📊 Resultados
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
