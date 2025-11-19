"use client"; // Formulario que ve el usuario
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { useGetPoll, useSubmitResponse } from "@/app/hooks/usePoll";
import { AxiosError } from "axios";

export default function RespondPollForm({ pollId }: { pollId: string }) {
  const router = useRouter();
  const pollQuery = useGetPoll(pollId); // Trae la encuesta y prepara la funcion de envio
  const submitMutation = useSubmitResponse();

  // Manejo de estados de carga/error antes de renderizar el formulario
  if (pollQuery.isLoading) return <p style={{textAlign:'center'}}>Cargando encuesta...</p>;
  if (pollQuery.isError) return <p style={{color: 'red', textAlign:'center'}}>Error al cargar.</p>;
  if (!pollQuery.data) return <p style={{textAlign:'center'}}>Encuesta no encontrada.</p>;

  const poll = pollQuery.data;
  
  const initialValues = poll.questions.reduce((acc, q) => {
    acc[q.id] = "";
    return acc;
  }, {} as Record<string, string>);

  // Manejo de envio
  const handleSubmit = (values: Record<string, string>) => {
    const todasRespondidas = poll.questions.every(q => values[q.id]); // Verifica que todas las preguntas esten respondidas
    if(!todasRespondidas) {
        alert("Por favor responda todas las preguntas");
        return;
    }

    submitMutation.mutate({ pollId, answers: values }, {
      onSuccess: () => {
        // Si esta todo bien, redirige al resultado
        router.push(`/polls/${pollId}/results`);
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 409) {
           alert("Ya respondiste esta encuesta.");
           router.push(`/polls/${pollId}/results`);
        } else {
           alert("Error al enviar.");
        }
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{textAlign: 'center'}}>{poll.title}</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            {poll.questions.map(q => (
              <div key={q.id} style={{ marginBottom: '20px', padding: '15px', borderBottom: '1px solid #eee' }}>
                <h3 style={{margin: '0 0 10px 0'}}>{q.text}</h3>
                <div role="group" aria-labelledby={`question-${q.id}`}>
                  {q.options.map(opt => (
                    <label key={opt.id} style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
                      <Field type="radio" name={q.id} value={opt.id} style={{ marginRight: '10px' }} />
                      {opt.text}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button type="submit" disabled={isSubmitting} style={{ padding: '15px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer', width: '100%', fontSize: '1.1em', borderRadius: '4px' }}>
              {isSubmitting ? "Enviando Respuestas..." : "Enviar Voto"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}