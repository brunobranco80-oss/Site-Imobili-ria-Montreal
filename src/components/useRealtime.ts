"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

export type RealtimeEvento = {
  recurso: string;
  acao: string;
  id?: string;
  em: string;
};

// Hook de tempo real do CRM.
//
// - Em produção (Vercel): usa o **Supabase Realtime** — escuta as mudanças da
//   tabela "Imovel" no Postgres via websocket e dispara o callback.
// - Em desenvolvimento sem Supabase: usa o fallback **SSE** em /api/realtime.
//
// Reconecta automaticamente em ambos os casos.
export function useRealtime(aoReceber?: (evento: RealtimeEvento) => void) {
  const [conectado, setConectado] = useState(false);
  const callbackRef = useRef(aoReceber);

  useEffect(() => {
    callbackRef.current = aoReceber;
  }, [aoReceber]);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    // --- Caminho 1: Supabase Realtime (produção) ---
    if (supabase) {
      const canal = supabase
        .channel("crm-imoveis")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "Imovel" },
          (payload) => {
            const acao =
              payload.eventType === "INSERT"
                ? "criado"
                : payload.eventType === "UPDATE"
                  ? "atualizado"
                  : "removido";
            const linha = (payload.new ?? payload.old) as { id?: string } | null;
            callbackRef.current?.({
              recurso: "imovel",
              acao,
              id: linha?.id,
              em: new Date().toISOString(),
            });
          },
        )
        .subscribe((status) => setConectado(status === "SUBSCRIBED"));

      return () => {
        supabase.removeChannel(canal);
      };
    }

    // --- Caminho 2: fallback SSE (desenvolvimento) ---
    const fonte = new EventSource("/api/realtime");
    fonte.onopen = () => setConectado(true);
    fonte.onerror = () => setConectado(false);
    fonte.onmessage = (e) => {
      try {
        const evento = JSON.parse(e.data) as RealtimeEvento;
        if (evento.recurso === "conexao") {
          setConectado(true);
          return;
        }
        callbackRef.current?.(evento);
      } catch {
        // ignora heartbeats / mensagens malformadas
      }
    };

    return () => fonte.close();
  }, []);

  return { conectado };
}
