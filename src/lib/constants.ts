// Valores de domínio do módulo de Imóveis (em Português, contexto Montréal/Québec).

export const TIPOS_IMOVEL = [
  "Apartamento",
  "Casa",
  "Condo",
  "Cobertura",
  "Studio",
  "Terreno",
  "Comercial",
] as const;

export const FINALIDADES = ["Venda", "Aluguel"] as const;

export const STATUS_IMOVEL = [
  "Disponivel",
  "Reservado",
  "Vendido",
  "Alugado",
  "Inativo",
] as const;

export type TipoImovel = (typeof TIPOS_IMOVEL)[number];
export type Finalidade = (typeof FINALIDADES)[number];
export type StatusImovel = (typeof STATUS_IMOVEL)[number];

// Rótulos e cores para exibição dos status.
export const STATUS_META: Record<
  string,
  { label: string; classe: string }
> = {
  Disponivel: { label: "Disponível", classe: "bg-emerald-100 text-emerald-700 ring-emerald-600/20" },
  Reservado: { label: "Reservado", classe: "bg-amber-100 text-amber-700 ring-amber-600/20" },
  Vendido: { label: "Vendido", classe: "bg-blue-100 text-blue-700 ring-blue-600/20" },
  Alugado: { label: "Alugado", classe: "bg-violet-100 text-violet-700 ring-violet-600/20" },
  Inativo: { label: "Inativo", classe: "bg-slate-100 text-slate-600 ring-slate-500/20" },
};

// Formata um valor numérico como moeda canadense (CAD).
export function formatarCAD(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(valor || 0);
}
