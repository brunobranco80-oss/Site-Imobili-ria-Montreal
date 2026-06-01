-- Habilita o Supabase Realtime para a tabela de imóveis.
-- Rode este script UMA VEZ no Supabase: SQL Editor → New query → Run.
-- (Execute depois de criar as tabelas com `npm run db:deploy`.)

-- 1) Adiciona a tabela "Imovel" à publicação de realtime (de forma idempotente).
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'Imovel'
  ) then
    alter publication supabase_realtime add table public."Imovel";
  end if;
end
$$;

-- 2) REPLICA IDENTITY FULL: garante que os dados da linha (ex.: id) cheguem
--    também nos eventos de UPDATE e DELETE.
alter table public."Imovel" replica identity full;
