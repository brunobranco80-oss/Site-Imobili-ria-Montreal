"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente Supabase para o navegador (singleton).
//
// Retorna `null` quando as variáveis públicas não estão definidas — nesse caso
// o app usa o fallback de tempo real via SSE (ideal para desenvolvimento local).
let cliente: SupabaseClient | null | undefined;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (cliente !== undefined) return cliente;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  cliente =
    url && anonKey
      ? createClient(url, anonKey, {
          auth: { persistSession: false },
          realtime: { params: { eventsPerSecond: 10 } },
        })
      : null;

  return cliente;
}

export function supabaseConfigurado(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
