import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

export type FiltrosImovel = {
  busca?: string;
  tipo?: string;
  finalidade?: string;
  status?: string;
};

// Lista imóveis aplicando filtros opcionais, com fotos incluídas.
export async function listarImoveis(filtros: FiltrosImovel = {}) {
  const where: Prisma.ImovelWhereInput = {};

  if (filtros.tipo) where.tipo = filtros.tipo;
  if (filtros.finalidade) where.finalidade = filtros.finalidade;
  if (filtros.status) where.status = filtros.status;

  if (filtros.busca) {
    const q = filtros.busca.trim();
    const codigo = Number(q.replace("#", ""));
    where.OR = [
      { titulo: { contains: q } },
      { bairro: { contains: q } },
      { endereco: { contains: q } },
      { cidade: { contains: q } },
      ...(Number.isFinite(codigo) && codigo > 0 ? [{ codigo }] : []),
    ];
  }

  return prisma.imovel.findMany({
    where,
    include: { fotos: { orderBy: { ordem: "asc" } } },
    orderBy: [{ destaque: "desc" }, { createdAt: "desc" }],
  });
}

export async function obterImovel(id: string) {
  return prisma.imovel.findUnique({
    where: { id },
    include: { fotos: { orderBy: { ordem: "asc" } } },
  });
}

// Métricas para o dashboard / cabeçalho do módulo.
export async function estatisticasImoveis() {
  const [total, disponiveis, vendidos, alugados, agregado] = await Promise.all([
    prisma.imovel.count(),
    prisma.imovel.count({ where: { status: "Disponivel" } }),
    prisma.imovel.count({ where: { status: "Vendido" } }),
    prisma.imovel.count({ where: { status: "Alugado" } }),
    prisma.imovel.aggregate({
      _sum: { preco: true },
      where: { status: "Disponivel" },
    }),
  ]);

  return {
    total,
    disponiveis,
    vendidos,
    alugados,
    valorEmCarteira: agregado._sum.preco ?? 0,
  };
}

export type ImovelComFotos = Awaited<ReturnType<typeof obterImovel>>;
