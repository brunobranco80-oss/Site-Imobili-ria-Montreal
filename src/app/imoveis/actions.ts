"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { imovelSchema } from "@/lib/validations";
import { publicar } from "@/lib/realtime";

export type EstadoForm = {
  ok: boolean;
  erros?: Record<string, string[]>;
  mensagem?: string;
};

// Converte os campos do FormData para o formato esperado pelo schema.
function extrairDados(formData: FormData) {
  const fotos = (formData.getAll("fotos") as string[])
    .map((f) => f.trim())
    .filter(Boolean);

  return {
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao") ?? "",
    tipo: formData.get("tipo"),
    finalidade: formData.get("finalidade"),
    status: formData.get("status"),
    destaque: formData.get("destaque") === "on" || formData.get("destaque") === "true",
    preco: formData.get("preco") ?? 0,
    condominio: formData.get("condominio") || null,
    taxas: formData.get("taxas") || null,
    quartos: formData.get("quartos") ?? 0,
    banheiros: formData.get("banheiros") ?? 0,
    vagas: formData.get("vagas") ?? 0,
    area: formData.get("area") ?? 0,
    endereco: formData.get("endereco") ?? "",
    bairro: formData.get("bairro") ?? "",
    cidade: formData.get("cidade") ?? "Montréal",
    provincia: formData.get("provincia") ?? "QC",
    cep: formData.get("cep") ?? "",
    pais: formData.get("pais") ?? "Canadá",
    proprietarioNome: formData.get("proprietarioNome") || null,
    proprietarioContato: formData.get("proprietarioContato") || null,
    fotos,
  };
}

async function proximoCodigo(): Promise<number> {
  const ultimo = await prisma.imovel.findFirst({ orderBy: { codigo: "desc" } });
  return (ultimo?.codigo ?? 1000) + 1;
}

export async function criarImovel(
  _estado: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const parsed = imovelSchema.safeParse(extrairDados(formData));
  if (!parsed.success) {
    return { ok: false, erros: parsed.error.flatten().fieldErrors, mensagem: "Verifique os campos destacados." };
  }

  const { fotos, ...dados } = parsed.data;
  const codigo = await proximoCodigo();

  const imovel = await prisma.imovel.create({
    data: {
      ...dados,
      codigo,
      fotos: { create: fotos.map((url, ordem) => ({ url, ordem })) },
    },
  });

  publicar({ recurso: "imovel", acao: "criado", id: imovel.id });
  revalidatePath("/imoveis");
  redirect(`/imoveis/${imovel.id}`);
}

export async function atualizarImovel(
  id: string,
  _estado: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const parsed = imovelSchema.safeParse(extrairDados(formData));
  if (!parsed.success) {
    return { ok: false, erros: parsed.error.flatten().fieldErrors, mensagem: "Verifique os campos destacados." };
  }

  const { fotos, ...dados } = parsed.data;

  await prisma.$transaction([
    prisma.foto.deleteMany({ where: { imovelId: id } }),
    prisma.imovel.update({
      data: {
        ...dados,
        fotos: { create: fotos.map((url, ordem) => ({ url, ordem })) },
      },
      where: { id },
    }),
  ]);

  publicar({ recurso: "imovel", acao: "atualizado", id });
  revalidatePath("/imoveis");
  revalidatePath(`/imoveis/${id}`);
  redirect(`/imoveis/${id}`);
}

export async function excluirImovel(id: string): Promise<void> {
  await prisma.imovel.delete({ where: { id } });
  publicar({ recurso: "imovel", acao: "removido", id });
  revalidatePath("/imoveis");
  redirect("/imoveis");
}

export async function alternarDestaque(id: string, destaque: boolean): Promise<void> {
  await prisma.imovel.update({ where: { id }, data: { destaque } });
  publicar({ recurso: "imovel", acao: "atualizado", id });
  revalidatePath("/imoveis");
}
