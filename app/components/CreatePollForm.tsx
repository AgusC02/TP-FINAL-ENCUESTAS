"use client"; // Formulario
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { useRouter } from "next/navigation";
import { PollFormValues, pollCreationSchema } from "@/app/validations/poll.schema";
import { useCreatePoll } from "@/app/hooks/usePoll";

// Define los estilos con el tipo correcto para React
const inputStyle: React.CSSProperties = { 
  padding: '8px', 
  width: '100%', 
  boxSizing: 'border-box', 
  marginBottom: '5px', 
  border: '1px solid #ccc', 
  borderRadius: '4px' 
};
const errorStyle: React.CSSProperties = { color: 'red', fontSize: '0.9em' };
const buttonStyle: React.CSSProperties = { padding: '10px 15px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' };
const smallButton: React.CSSProperties = { ...buttonStyle, background: '#555', padding: '5px 10px', fontSize: '0.8em', marginLeft: '10px' };

export default function CreatePollForm() {
  const router = useRouter(); // Hook para navegar
  const createPollMutation = useCreatePoll(); // Hook personalizado

  // Valores iniciales para Formik
  const initialValues: PollFormValues = {
    title: "",
    questions: [
      { text: "", options: [{ text: "" }, { text: "" }] },
    ],
  };

  // Funcion que se ejecuta al hacer submit si pasa la validacion
  const handleSubmit = (values: PollFormValues) => {
    createPollMutation.mutate(values, {
      onSuccess: (data) => {
        // Si esta todo bien, redirige a la pagina de resultados
        router.push(`/polls/${data.id}/results`);
      },
      onError: (error: Error) => {
        alert(`Error: ${error.message}`);
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{textAlign: 'center'}}>Crear Nueva Encuesta</h1>
      
      <Formik<PollFormValues>
        initialValues={initialValues}
        validationSchema={pollCreationSchema} // Conecta con Yup para validar
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, isValid, dirty }) => (
          <Form>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="title"><strong>--- Título de la Encuesta ---</strong></label>
              <Field id="title" name="title" style={inputStyle} placeholder="Título" />
              
              <div style={errorStyle}>
                <ErrorMessage name="title" component="div" />
              </div>
            </div>
            {/* Lista dinamica con Formik */}
            <FieldArray name="questions">
              {({ push: pushQuestion, remove: removeQuestion }) => (
                <div>
                  {values.questions?.map((_, qIndex) => (
                    <div key={qIndex} style={{ background: '#f9f9f9', padding: '15px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Pregunta {qIndex + 1}</h3>
                        {values.questions.length > 1 && (
                            <button type="button" style={{...smallButton, background: '#d32f2f'}} onClick={() => removeQuestion(qIndex)}>
                            Eliminar Pregunta
                            </button>
                        )}
                      </div>
                      <Field name={`questions.${qIndex}.text`} placeholder="Escribí la pregunta" style={inputStyle} />
                      
                      <div style={errorStyle}>
                        <ErrorMessage name={`questions.${qIndex}.text`} component="div" />
                      </div>
                      {/* Opciones anidadas para cada pregunta */}
                      <FieldArray name={`questions.${qIndex}.options`}>
                        {({ push: pushOption, remove: removeOption }) => (
                          <div style={{ paddingLeft: '20px', marginTop: '10px' }}>
                            <label><strong>Opciones:</strong></label>
                            {values.questions[qIndex]?.options?.map((_, oIndex) => (
                              <div key={oIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                <Field name={`questions.${qIndex}.options.${oIndex}.text`} placeholder={`Opción ${oIndex + 1}`} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                                {values.questions[qIndex].options.length > 2 && (
                                    <button type="button" style={{...smallButton, background: '#c00'}} onClick={() => removeOption(oIndex)}>X</button>
                                )}
                              </div>
                            ))}
                            <button type="button" style={{...smallButton, marginTop: '5px'}} onClick={() => pushOption({ text: "" })}>
                              + Opción
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  ))}
                  <button type="button" style={{...buttonStyle, background: '#28a745', marginBottom: '20px'}} onClick={() => pushQuestion({ text: "", options: [{ text: "" }, { text: "" }] })}>
                    + Añadir Otra Pregunta
                  </button>
                </div>
              )}
            </FieldArray>
            <hr />
            {/* Boton para crear encuesta */}
            <button type="submit" disabled={isSubmitting || !isValid || !dirty} style={{ ...buttonStyle, marginTop: '20px', width: '100%', fontSize: '1.2em' }}>
              {isSubmitting ? "Creando encuesta..." : "Finalizar y Crear Encuesta"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}