import Link from "next/link";
import { formatarCAD } from "@/lib/constants";
import { StatusBadge } from "./StatusBadge";

type Foto = { url: string };
type Imovel = {
  id: string;
  codigo: number;
  titulo: string;
  tipo: string;
  finalidade: string;
  status: string;
  destaque: boolean;
  preco: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  area: number;
  bairro: string;
  cidade: string;
  fotos: Foto[];
};

export function ImovelCard({ imovel }: { imovel: Imovel }) {
  const capa = imovel.fotos[0]?.url;

  return (
    <Link
      href={`/imoveis/${imovel.id}`}
      className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md hover:border-cyan-300 transition"
    >
      <div className="relative aspect-[16/10] bg-slate-100">
        {capa ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capa}
            alt={imovel.titulo}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-slate-300 text-4xl">
            🏠
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <StatusBadge status={imovel.status} />
          {imovel.destaque && (
            <span className="inline-flex items-center rounded-full bg-amber-400/95 px-2 py-0.5 text-xs font-medium text-amber-950">
              ⭐ Destaque
            </span>
          )}
        </div>
        <span className="absolute top-2 right-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] text-white">
          #{imovel.codigo}
        </span>
      </div>

      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-cyan-700 font-medium">
          {imovel.tipo} • {imovel.finalidade}
        </p>
        <h3 className="mt-0.5 font-semibold text-slate-800 line-clamp-1">
          {imovel.titulo}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-1">
          {[imovel.bairro, imovel.cidade].filter(Boolean).join(", ")}
        </p>

        <p className="mt-2 text-lg font-bold text-slate-900">
          {formatarCAD(imovel.preco)}
          {imovel.finalidade === "Aluguel" && (
            <span className="text-xs font-normal text-slate-400">/mês</span>
          )}
        </p>

        <div className="mt-2 flex gap-3 text-xs text-slate-500">
          <span>🛏 {imovel.quartos}</span>
          <span>🛁 {imovel.banheiros}</span>
          <span>🚗 {imovel.vagas}</span>
          {imovel.area > 0 && <span>📐 {imovel.area} sq ft</span>}
        </div>
      </div>
    </Link>
  );
}
