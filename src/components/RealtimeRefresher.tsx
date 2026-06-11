"use client";

import { useRouter } from "next/navigation";
import { useRealtime } from "./useRealtime";

// Componente invisível: quando recebe um evento de tempo real do recurso
// informado, atualiza os dados da página (router.refresh) sem recarregar tudo.
export function RealtimeRefresher({ recurso = "imovel" }: { recurso?: string }) {
  const router = useRouter();

  useRealtime((evento) => {
    if (evento.recurso === recurso) {
      router.refresh();
    }
  });

  return null;
}
