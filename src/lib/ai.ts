import Anthropic from "@anthropic-ai/sdk";
import { formatarCAD } from "./constants";

// Integração de IA (Claude) do CRM.
//
// Hoje: geração automática de descrições de anúncios de imóveis.
// Sem ANTHROPIC_API_KEY definida, usamos um fallback local (template) para que
// o recurso continue funcionando em desenvolvimento, apenas sem o texto da IA.

const MODELO = "claude-opus-4-8";

export function iaDisponivel(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export type DadosDescricao = {
  titulo?: string;
  tipo: string;
  finalidade: string;
  preco: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  area: number;
  bairro?: string;
  cidade?: string;
  caracteristicasExtras?: string;
};

export async function gerarDescricaoImovel(dados: DadosDescricao): Promise<string> {
  if (!iaDisponivel()) {
    return descricaoFallback(dados);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Você é um redator especialista em anúncios imobiliários da Imobiliária Montreal (Montréal, Québec, Canadá).
Escreva uma descrição de anúncio atraente, profissional e honesta, em Português, para o imóvel abaixo.
Regras: 2 a 3 parágrafos curtos, tom acolhedor e moderno, destaque o estilo de vida e a localização, sem inventar dados que não foram fornecidos, não use emojis em excesso.

Dados do imóvel:
- Tipo: ${dados.tipo}
- Finalidade: ${dados.finalidade}
- Preço: ${formatarCAD(dados.preco)}
- Quartos: ${dados.quartos}
- Banheiros: ${dados.banheiros}
- Vagas de garagem: ${dados.vagas}
- Área: ${dados.area} sq ft
- Bairro: ${dados.bairro || "não informado"}
- Cidade: ${dados.cidade || "Montréal"}
${dados.caracteristicasExtras ? `- Outras características: ${dados.caracteristicasExtras}` : ""}

Responda apenas com o texto da descrição, sem títulos nem comentários.`;

  const resposta = await client.messages.create({
    model: MODELO,
    max_tokens: 700,
    messages: [{ role: "user", content: prompt }],
  });

  const texto = resposta.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return texto || descricaoFallback(dados);
}

// Descrição básica gerada localmente quando a IA não está configurada.
function descricaoFallback(d: DadosDescricao): string {
  const local = [d.bairro, d.cidade].filter(Boolean).join(", ") || "Montréal";
  const partes = [
    `${d.tipo} para ${d.finalidade.toLowerCase()} em ${local}.`,
    [
      d.quartos ? `${d.quartos} quarto(s)` : null,
      d.banheiros ? `${d.banheiros} banheiro(s)` : null,
      d.vagas ? `${d.vagas} vaga(s) de garagem` : null,
      d.area ? `${d.area} sq ft` : null,
    ]
      .filter(Boolean)
      .join(", ") + ".",
    `Valor: ${formatarCAD(d.preco)}. Entre em contato com a Imobiliária Montreal para agendar uma visita.`,
  ];
  return partes.join(" ");
}
