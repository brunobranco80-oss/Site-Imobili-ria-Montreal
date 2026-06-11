"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RealtimeStatus } from "./RealtimeStatus";

const ITENS = [
  { href: "/", rotulo: "Painel", icone: "📊" },
  { href: "/imoveis", rotulo: "Imóveis", icone: "🏠" },
  { href: "/leads", rotulo: "Leads", icone: "🎯", emBreve: true },
  { href: "/pipeline", rotulo: "Pipeline", icone: "📈", emBreve: true },
  { href: "/agenda", rotulo: "Agenda", icone: "🗓️", emBreve: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="grid place-items-center h-9 w-9 rounded-xl bg-cyan-700 text-white font-bold">
            M
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-800 text-sm">Imobiliária Montreal</p>
            <p className="text-[11px] text-slate-400">CRM Inteligente</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {ITENS.map((item) => {
          const ativo =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.emBreve ? "#" : item.href}
              aria-disabled={item.emBreve}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                ativo
                  ? "bg-cyan-50 text-cyan-800 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              } ${item.emBreve ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-base">{item.icone}</span>
              <span>{item.rotulo}</span>
              {item.emBreve && (
                <span className="ml-auto text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                  em breve
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-slate-100">
        <RealtimeStatus />
      </div>
    </aside>
  );
}
