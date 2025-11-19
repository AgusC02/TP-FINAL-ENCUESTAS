//Para creacion y listado de encuestas
import { NextResponse } from "next/server";
import { db } from "@/app/lib/database"; // Importa DB
import { pollCreationSchema } from "@/app/validations/poll.schema"; // Esquema de validacion
import * as Yup from "yup"; // Importa Yup para validacion

// Devuelve lista
export async function GET() {
  try {
    const polls = await db.getAllPolls();
    return NextResponse.json(polls, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Crea encuesta
export async function POST(request: Request) {
  try {
    const body = await request.json(); // Lee cuerpo del json 

    // Validaciones del esquema de Yup
    let validatedData;
    try {
      validatedData = await pollCreationSchema.validate(body, {
        abortEarly: false, // Muestra todos los errores
        stripUnknown: true // Limpia toda la basura que pueda enviar el usuario
      });
    } catch (error) {
      // Si falla la validacion, 400 (Bad Request + detalles)
      return NextResponse.json(
        { error: "Datos inválidos", details: (error as Yup.ValidationError).errors }, 
        { status: 400 }
      );
    }
    
    // Se agrega ID unico a cada pregunta y opcion antes de guardar
    const pollDataWithIds = {
      title: validatedData.title,
      questions: validatedData.questions.map(q => ({
        ...q,
        id: crypto.randomUUID(),
        options: q.options.map(o => ({
          ...o,
          id: crypto.randomUUID(),
        })),
      })),
    };

    const newPoll = await db.createPoll(pollDataWithIds); // Guarda
    return NextResponse.json(newPoll, { status: 201 }); // Todo bien
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 }); // Todo mal
  }
}