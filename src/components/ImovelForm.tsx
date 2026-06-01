"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { TIPOS_IMOVEL, FINALIDADES, STATUS_IMOVEL, STATUS_META } from "@/lib/constants";
import type { EstadoForm } from "@/app/imoveis/actions";

type ImovelInicial = {
  titulo: string;
  descricao: string;
  tipo: string;
  finalidade: string;
  status: string;
  destaque: boolean;
  preco: number;
  condominio: number | null;
  taxas: number | null;
  quartos: number;
  banheiros: number;
  vagas: number;
  area: number;
  endereco: string;
  bairro: string;
  cidade: string;
  provincia: string;
  cep: string;
  pais: string;
  proprietarioNome: string | null;
  proprietarioContato: string | null;
  fotos: { url: string }[];
};

type Props = {
  action: (estado: EstadoForm, formData: FormData) => Promise<EstadoForm>;
  inicial?: ImovelInicial;
  rotuloEnvio: string;
};

const ESTADO_INICIAL: EstadoForm = { ok: false };

export function ImovelForm({ action, inicial, rotuloEnvio }: Props) {
  const [estado, formAction] = useActionState(action, ESTADO_INICIAL);
  const [descricao, setDescricao] = useState(inicial?.descricao ?? "");
  const [fotos, setFotos] = useState<string[]>(inicial?.fotos.map((f) => f.url) ?? []);
  const [novaFoto, setNovaFoto] = useState("");
  const [gerando, setGerando] = useState(false);
  const [avisoIA, setAvisoIA] = useState<string | null>(null);

  const erro = (campo: string) => estado.erros?.[campo]?.[0];

  async function gerarDescricao() {
    setGerando(true);
    setAvisoIA(null);
    try {
      const form = document.getElementById("imovel-form") as HTMLFormElement;
      const fd = new FormData(form);
      const resp = await fetch("/api/ai/descricao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: fd.get("tipo"),
          finalidade: fd.get("finalidade"),
          preco: fd.get("preco"),
          quartos: fd.get("quartos"),
          banheiros: fd.get("banheiros"),
          vagas: fd.get("vagas"),
          area: fd.get("area"),
          bairro: fd.get("bairro"),
          cidade: fd.get("cidade"),
        }),
      });
      const dados = await resp.json();
      if (dados.descricao) {
        setDescricao(dados.descricao);
        if (!dados.iaAtiva) {
          setAvisoIA("Descrição gerada em modo básico (defina ANTHROPIC_API_KEY para usar a IA do Claude).");
        }
      }
    } catch {
      setAvisoIA("Não foi possível gerar a descrição agora.");
    } finally {
      setGerando(false);
    }
  }

  function adicionarFoto() {
    const url = novaFoto.trim();
    if (url && !fotos.includes(url)) {
      setFotos([...fotos, url]);
      setNovaFoto("");
    }
  }

  return (
    <form id="imovel-form" action={formAction} className="space-y-6 max-w-3xl">
      {estado.mensagem && !estado.ok && (
        <div className="rounded-lg bg-red-50 text-red-700 ring-1 ring-red-200 px-4 py-2 text-sm">
          {estado.mensagem}
        </div>
      )}

      {/* fotos como campos ocultos */}
      {fotos.map((url) => (
        <input key={url} type="hidden" name="fotos" value={url} />
      ))}

      <Secao titulo="Informações principais">
        <Campo label="Título do anúncio" erro={erro("titulo")} className="md:col-span-2">
          <input
            name="titulo"
            defaultValue={inicial?.titulo}
            placeholder="Ex.: Condo moderno de 2 quartos no Plateau"
            className={inputClasse}
          />
        </Campo>

        <Campo label="Tipo">
          <select name="tipo" defaultValue={inicial?.tipo ?? "Apartamento"} className={inputClasse}>
            {TIPOS_IMOVEL.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Finalidade">
          <select name="finalidade" defaultValue={inicial?.finalidade ?? "Venda"} className={inputClasse}>
            {FINALIDADES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Status">
          <select name="status" defaultValue={inicial?.status ?? "Disponivel"} className={inputClasse}>
            {STATUS_IMOVEL.map((s) => (
              <option key={s} value={s}>{STATUS_META[s]?.label ?? s}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Destaque">
          <label className="flex items-center gap-2 h-[38px] text-sm text-slate-600">
            <input type="checkbox" name="destaque" defaultChecked={inicial?.destaque} className="h-4 w-4 accent-cyan-600" />
            Exibir como destaque
          </label>
        </Campo>
      </Secao>

      <Secao titulo="Valores (CAD)">
        <Campo label="Preço" erro={erro("preco")}>
          <input type="number" name="preco" min={0} step="1000" defaultValue={inicial?.preco ?? 0} className={inputClasse} />
        </Campo>
        <Campo label="Condomínio / mês">
          <input type="number" name="condominio" min={0} defaultValue={inicial?.condominio ?? ""} className={inputClasse} />
        </Campo>
        <Campo label="Taxes / ano">
          <input type="number" name="taxas" min={0} defaultValue={inicial?.taxas ?? ""} className={inputClasse} />
        </Campo>
      </Secao>

      <Secao titulo="Características">
        <Campo label="Quartos">
          <input type="number" name="quartos" min={0} defaultValue={inicial?.quartos ?? 0} className={inputClasse} />
        </Campo>
        <Campo label="Banheiros">
          <input type="number" name="banheiros" min={0} defaultValue={inicial?.banheiros ?? 0} className={inputClasse} />
        </Campo>
        <Campo label="Vagas">
          <input type="number" name="vagas" min={0} defaultValue={inicial?.vagas ?? 0} className={inputClasse} />
        </Campo>
        <Campo label="Área (sq ft)">
          <input type="number" name="area" min={0} defaultValue={inicial?.area ?? 0} className={inputClasse} />
        </Campo>
      </Secao>

      <Secao titulo="Localização">
        <Campo label="Endereço" className="md:col-span-2">
          <input name="endereco" defaultValue={inicial?.endereco} className={inputClasse} />
        </Campo>
        <Campo label="Bairro">
          <input name="bairro" defaultValue={inicial?.bairro} placeholder="Ex.: Plateau-Mont-Royal" className={inputClasse} />
        </Campo>
        <Campo label="Cidade">
          <input name="cidade" defaultValue={inicial?.cidade ?? "Montréal"} className={inputClasse} />
        </Campo>
        <Campo label="Província">
          <input name="provincia" defaultValue={inicial?.provincia ?? "QC"} className={inputClasse} />
        </Campo>
        <Campo label="Código postal">
          <input name="cep" defaultValue={inicial?.cep} placeholder="H2X 1Y4" className={inputClasse} />
        </Campo>
        <Campo label="País">
          <input name="pais" defaultValue={inicial?.pais ?? "Canadá"} className={inputClasse} />
        </Campo>
      </Secao>

      <Secao titulo="Fotos">
        <div className="md:col-span-2">
          <div className="flex gap-2">
            <input
              value={novaFoto}
              onChange={(e) => setNovaFoto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  adicionarFoto();
                }
              }}
              placeholder="Cole a URL de uma foto e pressione Enter"
              className={inputClasse}
            />
            <button type="button" onClick={adicionarFoto} className="shrink-0 rounded-lg bg-slate-800 hover:bg-slate-900 px-4 text-sm text-white transition">
              Adicionar
            </button>
          </div>
          {fotos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {fotos.map((url) => (
                <div key={url} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFotos(fotos.filter((f) => f !== url))}
                    className="absolute top-1 right-1 h-6 w-6 grid place-items-center rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Secao>

      <Secao titulo="Descrição">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700">Descrição do anúncio</label>
            <button
              type="button"
              onClick={gerarDescricao}
              disabled={gerando}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60 transition"
            >
              {gerando ? "Gerando…" : "✨ Gerar com IA"}
            </button>
          </div>
          <textarea
            name="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={6}
            placeholder="Descreva o imóvel ou gere automaticamente com IA…"
            className={inputClasse}
          />
          {avisoIA && <p className="mt-1 text-xs text-amber-600">{avisoIA}</p>}
        </div>
      </Secao>

      <Secao titulo="Proprietário (opcional)">
        <Campo label="Nome">
          <input name="proprietarioNome" defaultValue={inicial?.proprietarioNome ?? ""} className={inputClasse} />
        </Campo>
        <Campo label="Contato (telefone / e-mail)">
          <input name="proprietarioContato" defaultValue={inicial?.proprietarioContato ?? ""} className={inputClasse} />
        </Campo>
      </Secao>

      <div className="flex items-center gap-3 pt-2">
        <BotaoEnviar rotulo={rotuloEnvio} />
        <Link href="/imoveis" className="text-sm text-slate-500 hover:text-slate-700">
          Cancelar
        </Link>
      </div>
    </form>
  );
}

const inputClasse =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-slate-200 bg-white p-5">
      <legend className="px-1 text-sm font-semibold text-slate-700">{titulo}</legend>
      <div className="grid md:grid-cols-2 gap-4 mt-2">{children}</div>
    </fieldset>
  );
}

function Campo({
  label,
  erro,
  className = "",
  children,
}: {
  label: string;
  erro?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </div>
  );
}

function BotaoEnviar({ rotulo }: { rotulo: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-cyan-700 hover:bg-cyan-800 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 transition"
    >
      {pending ? "Salvando…" : rotulo}
    </button>
  );
}
