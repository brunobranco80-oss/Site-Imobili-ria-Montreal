import Link from "next/link";
import { listarImoveis } from "@/lib/imoveis";
import { TIPOS_IMOVEL, FINALIDADES, STATUS_IMOVEL, STATUS_META } from "@/lib/constants";
import { ImovelCard } from "@/components/ImovelCard";
import { RealtimeRefresher } from "@/components/RealtimeRefresher";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  busca?: string;
  tipo?: string;
  finalidade?: string;
  status?: string;
}>;

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filtros = await searchParams;
  const imoveis = await listarImoveis(filtros);

  return (
    <div className="px-8 py-7 max-w-7xl">
      <RealtimeRefresher recurso="imovel" />

      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Imóveis</h1>
          <p className="text-slate-500">{imoveis.length} imóvel(is) encontrado(s)</p>
        </div>
        <Link
          href="/imoveis/novo"
          className="rounded-lg bg-cyan-700 hover:bg-cyan-800 px-4 py-2 text-sm font-medium text-white transition"
        >
          + Novo imóvel
        </Link>
      </header>

      <form className="rounded-xl border border-slate-200 bg-white p-4 mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto_auto_auto]">
        <input
          name="busca"
          defaultValue={filtros.busca}
          placeholder="Buscar por título, bairro, endereço ou #código…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <Select name="tipo" valor={filtros.tipo} placeholder="Tipo" opcoes={TIPOS_IMOVEL} />
        <Select name="finalidade" valor={filtros.finalidade} placeholder="Finalidade" opcoes={FINALIDADES} />
        <Select
          name="status"
          valor={filtros.status}
          placeholder="Status"
          opcoes={STATUS_IMOVEL}
          rotulos={Object.fromEntries(
            STATUS_IMOVEL.map((s) => [s, STATUS_META[s]?.label ?? s]),
          )}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-slate-800 hover:bg-slate-900 px-4 py-2 text-sm font-medium text-white transition"
          >
            Filtrar
          </button>
          <Link
            href="/imoveis"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition grid place-items-center"
          >
            Limpar
          </Link>
        </div>
      </form>

      {imoveis.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Nenhum imóvel corresponde aos filtros.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {imoveis.map((imovel) => (
            <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      )}
    </div>
  );
}

function Select({
  name,
  valor,
  placeholder,
  opcoes,
  rotulos,
}: {
  name: string;
  valor?: string;
  placeholder: string;
  opcoes: readonly string[];
  rotulos?: Record<string, string>;
}) {
  return (
    <select
      name={name}
      defaultValue={valor ?? ""}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
    >
      <option value="">{placeholder}: todos</option>
      {opcoes.map((o) => (
        <option key={o} value={o}>
          {rotulos?.[o] ?? o}
        </option>
      ))}
    </select>
  );
}
