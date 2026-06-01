# CRM • Imobiliária Montreal

CRM imobiliário moderno, em **Português**, com **atualizações em tempo real** e
funcionalidades de **Inteligência Artificial (Claude)**.

Primeiro módulo entregue: **Cadastro de Imóveis** (com painel/dashboard).

## ✨ O que já está pronto

### Módulo de Imóveis
- **Listagem** com busca (título, bairro, endereço ou `#código`) e filtros por
  tipo, finalidade e status.
- **Cadastro / edição / exclusão** completos, com:
  - Tipo (Apartamento, Casa, Condo, Cobertura, Studio, Terreno, Comercial)
  - Finalidade (Venda / Aluguel) e Status (Disponível, Reservado, Vendido, Alugado, Inativo)
  - Valores em CAD (preço, condomínio, taxes)
  - Características (quartos, banheiros, vagas, área em sq ft)
  - Localização padrão Montréal / Québec (endereço, bairro, código postal)
  - **Galeria de fotos** por URL
  - Dados do proprietário
  - Marcação de **destaque** ⭐
- **Página de detalhe** com galeria e ficha completa.

### Tempo real ⚡
- Conexão via **SSE (Server-Sent Events)** em `/api/realtime`.
- Qualquer criação/edição/exclusão é refletida **instantaneamente** em todas as
  abas/usuários abertos, sem recarregar a página.
- Indicador "Tempo real ativo" no menu lateral.

### Inteligência Artificial 🤖
- Botão **"✨ Gerar com IA"** no formulário gera a descrição do anúncio a partir
  dos dados do imóvel, usando o **Claude** (Anthropic).
- Sem a chave de API, funciona em **modo básico** (template local), então o
  recurso nunca quebra.

### Painel (Dashboard)
- Totais de imóveis, disponíveis, vendidos e alugados.
- Valor total em carteira.
- Imóveis recentes.

## 🧱 Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Prisma 6** + **Postgres (Supabase)** — mesmo banco em dev e produção
- **Anthropic SDK** (Claude) para IA
- **Zod** para validação

## 🗄️ Banco de dados (Supabase)

O app usa **Postgres**, hospedado no **Supabase** (plano gratuito).

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings → Database → Connection string**, copie as URLs e
   preencha o `.env`:
   - `DATABASE_URL` → conexão **Transaction pooler** (porta `6543`, com `?pgbouncer=true`)
   - `DIRECT_URL` → conexão **direta** (porta `5432`)
3. Rode `npm run setup` para criar as tabelas e popular com exemplos.

## 🚀 Rodar localmente

```bash
npm install
cp .env.example .env      # preencha DATABASE_URL, DIRECT_URL (Supabase) e ANTHROPIC_API_KEY
npm run setup             # gera o client, cria as tabelas e popula com exemplos
npm run dev               # http://localhost:3000
```

## ☁️ Rodar no GitHub Codespaces

1. No GitHub, na branch `claude/site-progress-review-zGNzd`, clique em
   **Code → Codespaces → Create codespace**.
2. Aguarde a preparação automática (instala dependências — definido em `.devcontainer/`).
3. Preencha o `.env` com as URLs do Supabase e rode `npm run setup`.
4. Rode `npm run dev` e abra a porta **3000**.

## ▲ Deploy na Vercel

O repositório já está pronto (`vercel.json` + `prisma generate` no build).

1. Tenha o banco do Supabase pronto (seção acima) e rode `npm run db:deploy`
   uma vez para criar as tabelas em produção.
2. Em [vercel.com](https://vercel.com) → **Add New → Project** → importe este
   repositório (branch `claude/site-progress-review-zGNzd`).
3. Em **Environment Variables**, adicione:
   `DATABASE_URL`, `DIRECT_URL` e `ANTHROPIC_API_KEY`.
4. Clique em **Deploy**. 🚀

### Variáveis de ambiente (`.env`)

| Variável            | Descrição                                                                  |
| ------------------- | -------------------------------------------------------------------------- |
| `DATABASE_URL`      | Postgres do Supabase — conexão *pooled* (porta 6543), usada pela aplicação. |
| `DIRECT_URL`        | Postgres do Supabase — conexão direta (porta 5432), usada por migrações.    |
| `ANTHROPIC_API_KEY` | Chave do Claude para a IA. Sem ela, a geração de descrição usa o fallback.  |

### Scripts úteis

| Comando             | O que faz                                  |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento                |
| `npm run build`     | Build de produção (com `prisma generate`)  |
| `npm run db:deploy` | Aplica o schema no banco                   |
| `npm run db:seed`   | Popula com imóveis de exemplo de Montréal  |
| `npm run db:studio` | Abre o Prisma Studio (visualizar o banco)  |

> ⚙️ **Tempo real na Vercel:** o tempo real atual usa SSE em memória, ideal para
> rodar localmente e em um único servidor. Na Vercel (serverless, múltiplas
> instâncias) ele não é garantido entre instâncias — a evolução planejada é usar
> o **Supabase Realtime** nativo, que já faz parte do roadmap.

## 🗺️ Próximos módulos (planejados)

- 🎯 **Leads** — captura, qualificação e scoring por IA
- 📈 **Pipeline / Kanban** — funil de negócios (arrastar e soltar)
- 🗓️ **Agenda** — visitas, tarefas e lembretes
- 💬 Integração WhatsApp / E-mail
- 🔐 Autenticação e perfis de equipe
- ☁️ Migração para **Supabase** (Postgres + Realtime nativo + Auth) para produção

## 📁 Estrutura

```
prisma/
  schema.prisma        # modelos Imovel e Foto
  seed.ts              # dados de exemplo
src/
  app/
    page.tsx           # painel/dashboard
    imoveis/           # listagem, novo, [id], [id]/editar, actions.ts
    api/
      realtime/        # SSE (tempo real)
      ai/descricao/    # geração de descrição por IA
  components/          # Sidebar, ImovelForm, ImovelCard, realtime, etc.
  lib/                 # db, ai, realtime, validations, constants, imoveis
```
