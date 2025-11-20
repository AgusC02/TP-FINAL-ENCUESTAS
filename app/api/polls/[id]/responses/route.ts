//
// Maneja el envio de los votos
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/lib/database";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: pollId } = await params; // Obtiene el id de la encuesta
  try {
    // Identifica ip del usuario
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

    //Esta comentado para poder votar varias veces desde el mismo IP
    /*const alreadyVoted = await db.hasVoted(pollId, ip);
    if (alreadyVoted) {
      return NextResponse.json({ error: "Ya votaste" }, { status: 409 });
    }*/

    const body = await request.json();
    const { answers } = body;

    // Validacion de envio de respuestas
    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: "Sin respuestas" }, { status: 400 });
    }

    // Guarda el voto con la ip
    const newResponse = await db.addResponse({
      pollId,
      answers,
      voterIdentifier: ip,
    });

    return NextResponse.json(newResponse, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}