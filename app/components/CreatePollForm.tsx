"use client";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { useRouter } from "next/navigation";
import {
  PollFormValues,
  pollCreationSchema,
} from "@/app/validations/poll.schema";
import { useCreatePoll } from "@/app/hooks/usePoll";

export default function CreatePollForm() {
  const router = useRouter();
  const createPollMutation = useCreatePoll();

  const initialValues: PollFormValues = {
    title: "",
    questions: [{ text: "", options: [{ text: "" }, { text: "" }] }],
  };

  const handleSubmit = (values: PollFormValues) => {
    createPollMutation.mutate(values, {
      onSuccess: (data) => {
        router.push(`/polls/${data.id}/results`);
      },
      onError: (error: Error) => {
        alert(`Error: ${error.message}`);
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Título general */}
      <h1 className="mb-2 text-center text-3xl font-black tracking-tight text-[#F8F8F8] sm:text-4xl">
        Crear Nueva Encuesta
      </h1>
      <p className="mb-6 text-center text-sm text-[#6A8A8A]">
        Define el título y agrega preguntas con sus opciones de respuesta.
      </p>

      <Formik<PollFormValues>
        initialValues={initialValues}
        validationSchema={pollCreationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, isValid, dirty }) => (
          <Form className="space-y-6">
            {/* Bloque Título de la encuesta */}
            <div className="rounded-lg border border-[#475F5F] bg-[#374F4F] p-5 shadow-sm">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-[#F8F8F8]"
              >
                Título de la Encuesta
              </label>
              <Field
                id="title"
                name="title"
                placeholder="Ej: Feedback de la nueva interfaz"
                className="w-full border-0 border-b-2 border-[#475F5F] bg-transparent p-0 text-xl font-bold tracking-tight text-[#F8F8F8] placeholder-[#6A8A8A] focus:border-[#CC5500] focus:ring-0"
              />
              <div className="mt-1 text-sm text-red-400">
                <ErrorMessage name="title" component="div" />
              </div>
            </div>

            {/* Lista dinámica de preguntas */}
            <FieldArray name="questions">
              {({ push: pushQuestion, remove: removeQuestion }) => (
                <div className="space-y-6">
                  {values.questions?.map((question, qIndex) => (
                    <div
                      key={qIndex}
                      className="rounded-lg border border-[#475F5F] bg-[#374F4F] p-5 shadow-sm"
                    >
                      {/* Header de la pregunta */}
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div className="w-full">
                          <div className="flex items-center">
                            <span className="mr-2 text-xl font-bold text-[#CC5500]">
                              {qIndex + 1}.
                            </span>
                            <Field
                              name={`questions.${qIndex}.text`}
                              placeholder="Escribí la pregunta"
                              className="w-full rounded-md border border-transparent bg-[#2F4F4F] p-2 text-base font-semibold text-[#F8F8F8] placeholder-[#6A8A8A] focus:border-[#CC5500] focus:ring-0"
                            />
                          </div>
                          <div className="ml-7 mt-1 text-xs text-[#6A8A8A]">
                            Pregunta de opción múltiple
                          </div>
                          <div className="ml-7 mt-1 text-sm text-red-400">
                            <ErrorMessage
                              name={`questions.${qIndex}.text`}
                              component="div"
                            />
                          </div>
                        </div>

                        {/* Botón eliminar pregunta */}
                        {values.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="flex h-8 items-center justify-center rounded-md bg-[#5c1f1f] px-3 text-xs font-semibold text-[#F8F8F8] shadow-sm transition-colors hover:bg-[#8b1f1f]"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>

                      {/* Opciones de la pregunta (sin radios) */}
                      <FieldArray name={`questions.${qIndex}.options`}>
                        {({ push: pushOption, remove: removeOption }) => (
                          <div className="ml-7 space-y-3">
                            <p className="text-xs font-semibold text-[#F8F8F8]">
                              Opciones
                            </p>
                            {values.questions[qIndex]?.options?.map(
                              (_, oIndex) => (
                                <div
                                  key={oIndex}
                                  className="flex items-center gap-2"
                                >
                                  {/* Etiqueta pequeña con el índice */}
                                  <span className="w-20 text-xs font-medium text-[#6A8A8A]">
                                    Opción {oIndex + 1}
                                  </span>

                                  {/* Input de texto de la opción */}
                                  <Field
                                    name={`questions.${qIndex}.options.${oIndex}.text`}
                                    placeholder={`Texto de la opción`}
                                    className="flex-1 border-0 border-b border-dashed border-[#475F5F] bg-transparent py-1 text-sm text-[#F8F8F8] placeholder-[#6A8A8A] focus:border-[#CC5500] focus:border-solid focus:ring-0"
                                  />

                                  {/* Botón eliminar opción (si hay más de 2) */}
                                  {values.questions[qIndex].options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => removeOption(oIndex)}
                                      className="flex h-7 w-7 items-center justify-center rounded bg-[#5c1f1f] text-xs font-bold text-[#F8F8F8] transition-colors hover:bg-[#8b1f1f]"
                                    >
                                      X
                                    </button>
                                  )}
                                </div>
                              )
                            )}

                            {/* Botón añadir opción */}
                            <button
                              type="button"
                              onClick={() => pushOption({ text: "" })}
                              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#6A8A8A] transition-colors hover:text-[#CC5500]"
                            >
                              <span className="material-symbols-outlined text-sm">
                                add
                              </span>
                              Añadir opción
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  ))}

                  {/* Botón añadir nueva pregunta */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        pushQuestion({
                          text: "",
                          options: [{ text: "" }, { text: "" }],
                        })
                      }
                      className="flex items-center gap-2 rounded-full border border-[#475F5F] bg-[#374F4F] px-4 py-2 text-sm font-semibold text-[#F8F8F8] shadow-md transition-transform transition-colors hover:scale-105 hover:border-[#CC5500]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CC5500] text-[#F8F8F8]">
                        <span className="material-symbols-outlined text-base">
                          add
                        </span>
                      </span>
                      <span>Añadir Otra Pregunta</span>
                    </button>
                  </div>
                </div>
              )}
            </FieldArray>

            <hr className="border-[#475F5F]" />

            {/* Botón submit principal */}
            <button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty}
              className={`mt-2 w-full rounded-md px-4 py-3 text-lg font-bold text-[#F8F8F8] shadow-lg shadow-[#CC5500]/30 transition-all ${
                isSubmitting || !isValid || !dirty
                  ? "cursor-not-allowed bg-[#555555] opacity-70"
                  : "bg-[#CC5500] hover:bg-[#CC5500]/90"
              }`}
            >
              {isSubmitting
                ? "Creando encuesta..."
                : "Finalizar y Crear Encuesta"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
