import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Imóveis de exemplo para demonstração (bairros reais de Montréal).
const EXEMPLOS = [
  {
    titulo: "Condo moderno de 2 quartos no Plateau",
    tipo: "Condo",
    finalidade: "Venda",
    status: "Disponivel",
    destaque: true,
    preco: 685000,
    condominio: 320,
    taxas: 4200,
    quartos: 2,
    banheiros: 1,
    vagas: 1,
    area: 980,
    endereco: "1245 Rue Saint-Denis",
    bairro: "Plateau-Mont-Royal",
    cep: "H2X 3J5",
    descricao:
      "Lindo condo reformado no coração do Plateau, a passos de cafés, restaurantes e do metrô. Acabamentos modernos, muita luz natural e uma vaga de garagem inclusa.",
    fotos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200",
    ],
  },
  {
    titulo: "Apartamento 3½ para alugar no Mile End",
    tipo: "Apartamento",
    finalidade: "Aluguel",
    status: "Disponivel",
    destaque: false,
    preco: 1950,
    quartos: 1,
    banheiros: 1,
    vagas: 0,
    area: 650,
    endereco: "5400 Boulevard Saint-Laurent",
    bairro: "Mile End",
    cep: "H2T 1S1",
    descricao:
      "Charmoso 3½ no bairro mais criativo de Montréal. Próximo a padarias, livrarias e parques.",
    fotos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200"],
  },
  {
    titulo: "Casa familiar de 4 quartos em Westmount",
    tipo: "Casa",
    finalidade: "Venda",
    status: "Reservado",
    destaque: true,
    preco: 1850000,
    taxas: 12500,
    quartos: 4,
    banheiros: 3,
    vagas: 2,
    area: 3200,
    endereco: "45 Avenue Forden",
    bairro: "Westmount",
    cep: "H3Y 2Y5",
    descricao:
      "Residência elegante em uma das ruas mais tranquilas de Westmount. Jardim privativo, garagem dupla e amplos espaços.",
    fotos: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200",
    ],
  },
  {
    titulo: "Studio compacto no centro (Ville-Marie)",
    tipo: "Studio",
    finalidade: "Aluguel",
    status: "Alugado",
    destaque: false,
    preco: 1500,
    quartos: 0,
    banheiros: 1,
    vagas: 0,
    area: 420,
    endereco: "1000 Rue de la Montagne",
    bairro: "Ville-Marie",
    cep: "H3G 0B8",
    descricao: "Studio eficiente no centro de Montréal, perfeito para profissionais.",
    fotos: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200"],
  },
];

async function main() {
  console.log("🌱 Populando o banco com imóveis de exemplo…");
  let codigo = 1001;

  for (const { fotos, ...dados } of EXEMPLOS) {
    const existente = await prisma.imovel.findFirst({ where: { titulo: dados.titulo } });
    if (existente) continue;

    await prisma.imovel.create({
      data: {
        ...dados,
        codigo: codigo++,
        cidade: "Montréal",
        provincia: "QC",
        pais: "Canadá",
        fotos: { create: fotos.map((url, ordem) => ({ url, ordem })) },
      },
    });
  }

  console.log("✅ Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
