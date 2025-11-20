"use client";

import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { useGetPoll, useSubmitResponse } from "@/app/hooks/usePoll";
import { AxiosError } from "axios";

export default function RespondPollForm({ pollId }: { pollId: string }) {
  const router = useRouter();
  const pollQuery = useGetPoll(pollId);
  const submitMutation = useSubmitResponse();

  // Estados de carga/error antes de renderizar el formulario
  if (pollQuery.isLoading) {
    return (
      <div className="flex justify-center py-6 text-sm text-desaturated-teal">
        Cargando encuesta...
      </div>
    );
  }

  if (pollQuery.isError) {
    return (
      <div className="flex justify-center py-6 text-sm text-red-400">
        Error al cargar la encuesta.
      </div>
    );
  }

  if (!pollQuery.data) {
    return (
      <div className="flex justify-center py-6 text-sm text-desaturated-teal">
        Encuesta no encontrada.
      </div>
    );
  }

  const poll = pollQuery.data;

  // Un campo por pregunta: { [questionId]: optionId }
  const initialValues = poll.questions.reduce(
    (acc: Record<string, string>, q: { id: string }) => {
      acc[q.id] = "";
      return acc;
    },
    {}
  );

  const handleSubmit = (values: Record<string, string>) => {
    const todasRespondidas = poll.questions.every(
      (q: { id: string }) => values[q.id]
    );

    if (!todasRespondidas) {
      alert("Por favor respondé todas las preguntas.");
      return;
    }

    submitMutation.mutate(
      { pollId, answers: values },
      {
        onSuccess: () => {
          router.push(`/polls/${pollId}/results`);
        },
        onError: (error: AxiosError) => {
          if (error.response?.status === 409) {
            alert("Ya respondiste esta encuesta.");
            router.push(`/polls/${pollId}/results`);
          } else {
            alert("Error al enviar.");
          }
        },
      }
    );
  };

  return (
    // El ancho lo controla la card del page.tsx, acá solo centramos un poco
    <div className="mx-auto w-full max-w-[720px]">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-6">
            {/* Header dentro del shadowbox, igual estilo que el HTML */}
            <header className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold leading-tight text-off-white">
                {poll.title || "Encuesta"}
              </h2>
              <div className="flex items-center gap-2 text-desaturated-teal">
                <span className="material-symbols-outlined text-base">
                  lock
                </span>
                <p className="text-sm">
                  Tu respuesta es 100% anónima. Solo se verán resultados
                  agregados.
                </p>
              </div>
            </header>

            {/* Preguntas, mismo fondo que la card, separadas por <hr> */}
            <div className="flex flex-col gap-6">
              {poll.questions.map(
                (
                  q: { id: string; text: string; options: any[] },
                  index: number
                ) => (
                  <div key={q.id} className="flex flex-col gap-4">
                    {/* Título de la pregunta con número en naranja */}
                    <h3 className="text-left text-xl font-bold leading-tight text-off-white">
                      <span className="mr-2 font-semibold text-primary">
                        {index + 1}.
                      </span>
                      {q.text}
                    </h3>

                    {/* Opciones tipo card, como en tu HTML */}
                    <div className="flex flex-col gap-3">
                      {q.options.map((opt: { id: string; text: string }) => (
                        <label
                          key={opt.id}
                          className="flex cursor-pointer items-center gap-4 rounded-lg border border-border-color p-4 transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                        >
                          <Field
                            type="radio"
                            name={q.id}
                            value={opt.id}
                            className="h-5 w-5 rounded-full border-2 border-border-color bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#3F5F5F]"
                          />
                          <p className="text-base font-medium leading-normal text-off-white">
                            {opt.text}
                          </p>
                        </label>
                      ))}
                    </div>

                    {/* Separador entre preguntas, mismo estilo que el HTML */}
                    {index < poll.questions.length - 1 }
                  </div>
                )
              )}
            </div>

            {/* Zona de botón con borde superior y botón a la derecha (como tu diseño) */}
            <div className="mt-2 border-t border-border-color pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || submitMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-primary py-2.5 px-6 text-base font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>
                  {isSubmitting || submitMutation.isPending
                    ? "Enviando respuestas..."
                    : "Enviar respuestas"}
                </span>
                <span className="material-symbols-outlined text-base">
                  send
                </span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
