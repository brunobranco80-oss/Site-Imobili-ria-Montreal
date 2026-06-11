"use client";

import { useRealtime } from "./useRealtime";

// Indicador de conexão em tempo real exibido no rodapé do menu lateral.
export function RealtimeStatus() {
  const { conectado } = useRealtime();

  return (
    <div className="flex items-center gap-2 text-[11px] text-slate-500">
      <span
        className={`h-2 w-2 rounded-full ${
          conectado ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
        }`}
      />
      {conectado ? "Tempo real ativo" : "Conectando…"}
    </div>
  );
}
