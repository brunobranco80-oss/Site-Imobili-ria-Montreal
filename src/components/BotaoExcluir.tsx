"use client";

import { excluirImovel } from "@/app/imoveis/actions";

export function BotaoExcluir({ id }: { id: string }) {
  return (
    <form
      action={excluirImovel.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 text-sm font-medium transition"
      >
        Excluir
      </button>
    </form>
  );
}
