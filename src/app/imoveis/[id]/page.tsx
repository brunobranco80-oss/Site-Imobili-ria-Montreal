import Link from "next/link";
import { notFound } from "next/navigation";
import { obterImovel } from "@/lib/imoveis";
import { formatarCAD } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { RealtimeRefresher } from "@/components/RealtimeRefresher";

export const dynamic = "force-dynamic";

export default async function ImovelDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const imovel = await obterImovel(id);
  if (!imovel) notFound();

  const caracteristicas = [
    { rotulo: "Quartos", valor: imovel.quartos, icone: "🛏" },
    { rotulo: "Banheiros", valor: imovel.banheiros, icone: "🛁" },
    { rotulo: "Vagas", valor: imovel.vagas, icone: "🚗" },
    { rotulo: "Área", valor: imovel.area ? `${imovel.area} sq ft` : "—", icone: "📐" },
  ];

  return (
    <div className="px-8 py-7 max-w-5xl">
      <RealtimeRefresher recurso="imovel" />

      <div className="flex items-center justify-between mb-4">
        <nav className="text-sm text-slate-400">
          <Link href="/imoveis" className="hover:text-slate-600">Imóveis</Link> / #{imovel.codigo}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={`/imoveis/${id}/editar`}
            className="rounded-lg bg-cyan-700 hover:bg-cyan-800 px-4 py-2 text-sm font-medium text-white transition"
          >
            Editar
          </Link>
          <BotaoExcluir id={id} />
        </div>
      </div>

      <div className="flex items-start gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{imovel.titulo}</h1>
            <StatusBadge status={imovel.status} />
            {imovel.destaque && (
              <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-medium ring-1 ring-amber-600/20">
                ⭐ Destaque
              </span>
            )}
          </div>
          <p className="text-slate-500">
            {imovel.tipo} • {imovel.finalidade} • {[imovel.bairro, imovel.cidade, imovel.provincia].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>

      {/* Galeria */}
      {imovel.fotos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {imovel.fotos.map((foto, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={foto.id}
              src={foto.url}
              alt={`Foto ${i + 1}`}
              className={`rounded-lg object-cover w-full ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"}`}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400 mb-6">
          Sem fotos cadastradas
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          <Bloco titulo="Descrição">
            <p className="text-slate-600 whitespace-pre-line text-sm leading-relaxed">
              {imovel.descricao || "Sem descrição."}
            </p>
          </Bloco>

          <Bloco titulo="Características">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {caracteristicas.map((c) => (
                <div key={c.rotulo} className="rounded-lg bg-slate-50 p-3 text-center">
                  <p className="text-xl">{c.icone}</p>
                  <p className="text-lg font-semibold text-slate-800">{c.valor}</p>
                  <p className="text-xs text-slate-500">{c.rotulo}</p>
                </div>
              ))}
            </div>
          </Bloco>

          <Bloco titulo="Endereço">
            <p className="text-sm text-slate-600">
              {[imovel.endereco, imovel.bairro, imovel.cidade, imovel.provincia, imovel.cep, imovel.pais]
                .filter(Boolean)
                .join(", ") || "Não informado"}
            </p>
          </Bloco>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Valor</p>
            <p className="text-3xl font-bold text-slate-900">
              {formatarCAD(imovel.preco)}
              {imovel.finalidade === "Aluguel" && (
                <span className="text-sm font-normal text-slate-400">/mês</span>
              )}
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              {imovel.condominio != null && (
                <Linha rotulo="Condomínio" valor={`${formatarCAD(imovel.condominio)}/mês`} />
              )}
              {imovel.taxas != null && (
                <Linha rotulo="Taxes" valor={`${formatarCAD(imovel.taxas)}/ano`} />
              )}
              <Linha rotulo="Código" valor={`#${imovel.codigo}`} />
            </dl>
          </div>

          {(imovel.proprietarioNome || imovel.proprietarioContato) && (
            <Bloco titulo="Proprietário">
              <p className="text-sm font-medium text-slate-700">{imovel.proprietarioNome || "—"}</p>
              <p className="text-sm text-slate-500">{imovel.proprietarioContato}</p>
            </Bloco>
          )}
        </div>
      </div>
    </div>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">{titulo}</h2>
      {children}
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{rotulo}</dt>
      <dd className="text-slate-700 font-medium">{valor}</dd>
    </div>
  );
}
