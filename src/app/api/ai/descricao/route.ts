import { NextResponse } from "next/server";
import { gerarDescricaoImovel, iaDisponivel } from "@/lib/ai";

export const runtime = "nodejs";

// Gera uma descrição de anúncio a partir dos dados do formulário de imóvel.
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const descricao = await gerarDescricaoImovel({
      tipo: String(body.tipo ?? "Apartamento"),
      finalidade: String(body.finalidade ?? "Venda"),
      preco: Number(body.preco ?? 0),
      quartos: Number(body.quartos ?? 0),
      banheiros: Number(body.banheiros ?? 0),
      vagas: Number(body.vagas ?? 0),
      area: Number(body.area ?? 0),
      bairro: body.bairro ? String(body.bairro) : undefined,
      cidade: body.cidade ? String(body.cidade) : undefined,
      caracteristicasExtras: body.caracteristicasExtras ? String(body.caracteristicasExtras) : undefined,
    });

    return NextResponse.json({ descricao, iaAtiva: iaDisponivel() });
  } catch (erro) {
    console.error("Erro ao gerar descrição:", erro);
    return NextResponse.json(
      { erro: "Não foi possível gerar a descrição agora." },
      { status: 500 },
    );
  }
}
