import { inscrever } from "@/lib/realtime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Endpoint SSE: mantém uma conexão aberta e transmite os eventos do CRM em
// tempo real para o navegador. O cliente escuta via EventSource.
export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const enviar = (dado: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(dado)}\n\n`));
      };

      // Evento inicial confirmando a conexão.
      enviar({ recurso: "conexao", acao: "aberta", em: new Date().toISOString() });

      const cancelar = inscrever((evento) => enviar(evento));

      // Heartbeat para manter a conexão viva através de proxies.
      const ping = setInterval(() => {
        controller.enqueue(encoder.encode(": ping\n\n"));
      }, 25000);

      request.signal.addEventListener("abort", () => {
        clearInterval(ping);
        cancelar();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
