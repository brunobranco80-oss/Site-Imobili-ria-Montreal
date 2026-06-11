import { z } from "zod";
import { FINALIDADES, STATUS_IMOVEL, TIPOS_IMOVEL } from "./constants";

// Schema de validação de um imóvel (usado em criação/edição).
export const imovelSchema = z.object({
  titulo: z.string().trim().min(3, "Informe um título com pelo menos 3 caracteres."),
  descricao: z.string().trim().default(""),
  tipo: z.enum(TIPOS_IMOVEL),
  finalidade: z.enum(FINALIDADES),
  status: z.enum(STATUS_IMOVEL),
  destaque: z.boolean().default(false),

  preco: z.coerce.number().min(0, "Preço inválido.").default(0),
  condominio: z.coerce.number().min(0).nullish(),
  taxas: z.coerce.number().min(0).nullish(),

  quartos: z.coerce.number().int().min(0).default(0),
  banheiros: z.coerce.number().int().min(0).default(0),
  vagas: z.coerce.number().int().min(0).default(0),
  area: z.coerce.number().min(0).default(0),

  endereco: z.string().trim().default(""),
  bairro: z.string().trim().default(""),
  cidade: z.string().trim().default("Montréal"),
  provincia: z.string().trim().default("QC"),
  cep: z.string().trim().default(""),
  pais: z.string().trim().default("Canadá"),

  proprietarioNome: z.string().trim().nullish(),
  proprietarioContato: z.string().trim().nullish(),

  fotos: z.array(z.string().url("URL de foto inválida.")).default([]),
});

export type ImovelInput = z.infer<typeof imovelSchema>;
