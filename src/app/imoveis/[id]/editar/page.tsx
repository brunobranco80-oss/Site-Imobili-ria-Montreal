import Link from "next/link";
import { notFound } from "next/navigation";
import { obterImovel } from "@/lib/imoveis";
import { ImovelForm } from "@/components/ImovelForm";
import { atualizarImovel } from "../../actions";

export default async function EditarImovelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const imovel = await obterImovel(id);
  if (!imovel) notFound();

  // Vincula o id à server action de atualização.
  const action = atualizarImovel.bind(null, id);

  return (
    <div className="px-8 py-7">
      <nav className="text-sm text-slate-400 mb-4">
        <Link href="/imoveis" className="hover:text-slate-600">Imóveis</Link> /{" "}
        <Link href={`/imoveis/${id}`} className="hover:text-slate-600">#{imovel.codigo}</Link> / Editar
      </nav>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Editar imóvel</h1>
      <ImovelForm action={action} inicial={imovel} rotuloEnvio="Salvar alterações" />
    </div>
  );
}
