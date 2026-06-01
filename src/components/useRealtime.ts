"use client";

import { useEffect, useRef, useState } from "react";

export type RealtimeEvento = {
  recurso: string;
  acao: string;
  id?: string;
  em: string;
};

// Hook que abre uma conexão SSE com /api/realtime e dispara o callback a cada
// evento recebido. Reconecta automaticamente em caso de queda.
export function useRealtime(aoReceber?: (evento: RealtimeEvento) => void) {
  const [conectado, setConectado] = useState(false);
  const callbackRef = useRef(aoReceber);

  useEffect(() => {
    callbackRef.current = aoReceber;
  }, [aoReceber]);

  useEffect(() => {
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
        // ignora mensagens malformadas (ex.: heartbeat)
      }
    };

    return () => fonte.close();
  }, []);

  return { conectado };
}
