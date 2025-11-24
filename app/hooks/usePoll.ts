"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Poll, PollResponse } from "@/app/lib/database";
import type { PollResults } from "@/app/api/polls/[id]/results/route";
import type { PollFormValues } from "@/app/validations/poll.schema";
import axios, { AxiosError } from "axios"; 

// Contiene llamadas a axios
const pollService = {
  createPoll: async (pollData: PollFormValues): Promise<Poll> => {
    const { data } = await axios.post("/api/polls", pollData);
    return data;
  },
  getPoll: async (id: string): Promise<Poll> => {
    const { data } = await axios.get(`/api/polls/${id}`);
    return data;
  },
  submitResponse: async ({ pollId, answers }: { pollId: string; answers: Record<string, string> }): Promise<PollResponse> => {
    const { data } = await axios.post(`/api/polls/${pollId}/responses`, { answers });
    return data;
  },
  getPollResults: async (id: string): Promise<PollResults> => {
    const { data } = await axios.get(`/api/polls/${id}/results`);
    return data;
  },

  getAllPolls: async (): Promise<Poll[]> => {
    const { data } = await axios.get("/api/polls");
    return data;
  },
};

// Hook para crear votacion (mutacion)
export function useCreatePoll() {
  return useMutation({
    mutationFn: pollService.createPoll,
  });
}

export function useGetPoll(id: string) {
  return useQuery({
    queryKey: ["poll", id],
    queryFn: () => pollService.getPoll(id),
    enabled: !!id,
  });
}

// Hook para votar (mutacion)
export function useSubmitResponse() {
  const queryClient = useQueryClient();
  
  return useMutation<PollResponse, AxiosError, { pollId: string; answers: Record<string, string> }>({
    mutationFn: pollService.submitResponse,
    onSuccess: (data) => {
      // Fuerza recarga automatica de resultados
      queryClient.invalidateQueries({ queryKey: ["pollResults", data.pollId] });
    },
  });
}

// Obtiene resultados en tiempo real
export function useGetPollResults(id: string) {
  return useQuery({
    queryKey: ["pollResults", id], // Identificador unico en caché
    queryFn: () => pollService.getPollResults(id),
    enabled: !!id,
    refetchInterval: 3000, // Pooling cada 3 segundos
  });
}

export function useGetAllPolls() {
  return useQuery({
    queryKey: ["polls"],
    queryFn: pollService.getAllPolls,
  });
}[];