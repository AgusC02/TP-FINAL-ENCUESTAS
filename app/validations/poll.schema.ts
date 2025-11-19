import * as Yup from "yup"; // Yup para validacion de esquemas

// Esquema para una sola opcion
const optionSchema = Yup.object().shape({
  text: Yup.string().min(1, "La opción no puede estar vacía") // Minimo 1 caracter
  .required("Requerido"), // Campo obligatorio
});

// Esqwuema para una pregunta 
const questionSchema = Yup.object().shape({
  text: Yup.string()
    .min(5, "La pregunta es muy corta") // Regla generica
    .required("Requerido"), // Campo obligatorio
  options: Yup.array()
    .of(optionSchema) // Indica que es un array de objetos optionSchema
    .min(2, "Debe haber al menos 2 opciones") // Minimo 2 opciones
    .required("Se requieren opciones"), 
});

// Encuesta completa
export const pollCreationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "El título es muy corto")
    .required("El título es obligatorio"),
  questions: Yup.array()
    .of(questionSchema)
    .min(1, "Debe haber al menos 1 pregunta")
    .required("Se requieren preguntas"),
});

export type PollFormValues = Yup.InferType<typeof pollCreationSchema>;