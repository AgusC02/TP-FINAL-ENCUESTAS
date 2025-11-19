import { NextResponse } from "next/server";
import { db } from "@/app/lib/database";

export interface PollResults {
  pollTitle: string;
  totalVotes: number;
  questions: Array<{
    questionId: string;
    questionText: string;
    options: Array<{
      optionId: string;
      optionText: string;
      votes: number;
    }>;
  }>;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: pollId } = await params;
  try {
    const [poll, responses] = await Promise.all([
      db.getPollById(pollId),
      db.getResponsesByPollId(pollId),
    ]);

    if (!poll) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }

    const results: PollResults = {
      pollTitle: poll.title,
      totalVotes: responses.length,
      questions: poll.questions.map(q => {
        const optionVotes = q.options.map(opt => {
          const voteCount = responses.filter(
            r => r.answers[q.id] === opt.id
          ).length;
          
          return {
            optionId: opt.id,
            optionText: opt.text,
            votes: voteCount,
          };
        });

        return {
          questionId: q.id,
          questionText: q.text,
          options: optionVotes,
        };
      }),
    };

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}