import Link from "next/link";
import { estatisticasImoveis, listarImoveis } from "@/lib/imoveis";
import { formatarCAD } from "@/lib/constants";
import { ImovelCard } from "@/components/ImovelCard";
import { RealtimeRefresher } from "@/components/RealtimeRefresher";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const [stats, recentes] = await Promise.all([
    estatisticasImoveis(),
    listarImoveis(),
  ]);

  const cards = [
    { rotulo: "Imóveis cadastrados", valor: stats.total, cor: "text-slate-900" },
    { rotulo: "Disponíveis", valor: stats.disponiveis, cor: "text-emerald-600" },
    { rotulo: "Vendidos", valor: stats.vendidos, cor: "text-blue-600" },
    { rotulo: "Alugados", valor: stats.alugados, cor: "text-violet-600" },
  ];

  return (
    <div className="px-8 py-7 max-w-7xl">
      <RealtimeRefresher recurso="imovel" />

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Painel</h1>
        <p className="text-slate-500">Visão geral da Imobiliária Montreal — atualizado em tempo real.</p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {cards.map((c) => (
          <div key={c.rotulo} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{c.rotulo}</p>
            <p className={`mt-1 text-3xl font-bold ${c.cor}`}>{c.valor}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-gradient-to-r from-cyan-700 to-cyan-600 p-5 text-white mb-8 flex items-center justify-between">
        <div>
          <p className="text-cyan-100 text-sm">Valor em carteira (imóveis disponíveis)</p>
          <p className="text-3xl font-bold">{formatarCAD(stats.valorEmCarteira)}</p>
        </div>
        <Link
          href="/imoveis/novo"
          className="rounded-lg bg-white/15 hover:bg-white/25 px-4 py-2 text-sm font-medium transition"
        >
          + Novo imóvel
        </Link>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">Imóveis recentes</h2>
          <Link href="/imoveis" className="text-sm text-cyan-700 hover:underline">
            Ver todos →
          </Link>
        </div>

        {recentes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentes.slice(0, 6).map((imovel) => (
              <ImovelCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-4xl mb-2">🏠</p>
      <p className="text-slate-700 font-medium">Nenhum imóvel cadastrado ainda</p>
      <p className="text-slate-500 text-sm mb-4">Comece adicionando o primeiro imóvel da carteira.</p>
      <Link
        href="/imoveis/novo"
        className="inline-flex rounded-lg bg-cyan-700 hover:bg-cyan-800 px-4 py-2 text-sm font-medium text-white transition"
      >
        + Cadastrar imóvel
      </Link>
    </div>
  );
}
