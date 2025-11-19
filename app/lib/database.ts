import fs from "fs/promises";
import path from "path";

// Definen la forma exacta que deben tener los objetos
export interface PollOption {
  id: string;
  text: string;
}

export interface PollQuestion {
  id: string;
  text: string;
  options: PollOption[];
}

export interface Poll {
  id: string;
  title: string;
  questions: PollQuestion[];
}

export interface PollResponse {
  id: string;
  pollId: string;
  answers: Record<string, string>; 
  voterIdentifier: string;
  createdAt: string;
}

//Estructura del json
interface DbSchema {
  polls: Poll[];
  responses: PollResponse[];
}

const DB_PATH = path.join(process.cwd(), "database.json"); // Define la ruta fisica del archivo (process.cwd() es la raiz del proyecto)

class Database {

  //Lee de la DB
  private async readDB(): Promise<DbSchema> {
    try {
      const data = await fs.readFile(DB_PATH, "utf-8"); //Lee archivo
      return JSON.parse(data) as DbSchema; // Parsea el json
    } catch (error) {
      return { polls: [], responses: [] }; // Si falla devuelve estructura vacia
    }
  }

  // Guarda en la DB
  private async writeDB(data: DbSchema): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2)); // De objeto a json
  }

  // Obtiene todas las encuestas
  async getAllPolls(): Promise<Poll[]> {
    const db = await this.readDB(); //Lee la DB
    return [...db.polls].reverse(); // Devuelve las encuestas (de las mas nuevas a las mas viejas)
  }

  // Crea una nueva encuesta
  async createPoll(poll: Omit<Poll, "id">): Promise<Poll> {
    const db = await this.readDB();
    const newPoll: Poll = {
      ...poll, // Copia los datos que llegaron: titulo, preguntas, ...
      id: crypto.randomUUID(), //Genera ID unico
    };
    db.polls.push(newPoll); //Agrega array a memoria
    await this.writeDB(db); //Guarda
    return newPoll;
  }

  // Busca una encuesta por ID
  async getPollById(id: string): Promise<Poll | undefined> {
    const db = await this.readDB();
    return db.polls.find((p) => p.id === id);
  }

  // Genera voto nuevo
  async addResponse(response: Omit<PollResponse, "id" | "createdAt">): Promise<PollResponse> {
    const db = await this.readDB();
    const newResponse: PollResponse = {
      ...response,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(), // Marca de tiempo
    };
    db.responses.push(newResponse);
    await this.writeDB(db);
    return newResponse;
  }

  // Filtra las respuestas que pertenecen a una encuesta específica (para obtener resultados)
  async getResponsesByPollId(pollId: string): Promise<PollResponse[]> {
    const db = await this.readDB();
    return db.responses.filter((r) => r.pollId === pollId);
  }

  async hasVoted(pollId: string, voterIdentifier: string): Promise<boolean> {
    const db = await this.readDB();
    return db.responses.some(
      (r) => r.pollId === pollId && r.voterIdentifier === voterIdentifier
    );
  }
}

// Singleton de la DB
export const db = new Database();