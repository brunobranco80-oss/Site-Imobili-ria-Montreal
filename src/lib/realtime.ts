import { EventEmitter } from "node:events";

// Barramento de eventos em tempo real do CRM.
//
// Sempre que um imóvel é criado/atualizado/removido, emitimos um evento que é
// transmitido para todos os clientes conectados via SSE (Server-Sent Events).
// Assim, qualquer aba/usuário vê a mudança instantaneamente, sem recarregar.
//
// Arquitetura preparada para evoluir: ao migrar para o Supabase, este módulo é
// substituído pelo Realtime nativo do Postgres (mesmo formato de evento).

export type RealtimeEvent = {
  recurso: "imovel";
  acao: "criado" | "atualizado" | "removido";
  id: string;
  em: string; // ISO timestamp
};

const globalForBus = globalThis as unknown as {
  crmBus: EventEmitter | undefined;
};

export const bus =
  globalForBus.crmBus ??
  (() => {
    const e = new EventEmitter();
    e.setMaxListeners(0); // sem limite de conexões SSE simultâneas
    return e;
  })();

if (process.env.NODE_ENV !== "production") globalForBus.crmBus = bus;

const CANAL = "crm";

export function publicar(evento: Omit<RealtimeEvent, "em">) {
  bus.emit(CANAL, { ...evento, em: new Date().toISOString() } satisfies RealtimeEvent);
}

export function inscrever(ouvinte: (evento: RealtimeEvent) => void) {
  bus.on(CANAL, ouvinte);
  return () => bus.off(CANAL, ouvinte);
}
