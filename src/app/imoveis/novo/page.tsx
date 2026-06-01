import Link from "next/link";
import { ImovelForm } from "@/components/ImovelForm";
import { criarImovel } from "../actions";

export default function NovoImovelPage() {
  return (
    <div className="px-8 py-7">
      <nav className="text-sm text-slate-400 mb-4">
        <Link href="/imoveis" className="hover:text-slate-600">Imóveis</Link> / Novo
      </nav>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Cadastrar imóvel</h1>
      <ImovelForm action={criarImovel} rotuloEnvio="Cadastrar imóvel" />
    </div>
  );
}
