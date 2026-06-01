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
- **Prisma 6** + **SQLite** (local) — pronto para migrar para **Postgres/Supabase**
- **Anthropic SDK** (Claude) para IA
- **Zod** para validação

## ☁️ Rodar no GitHub Codespaces (sem instalar nada)

1. No GitHub, abra a branch `claude/site-progress-review-zGNzd`.
2. Clique em **Code → Codespaces → Create codespace on...**.
3. Aguarde a preparação automática (instala dependências, cria o banco e popula
   com exemplos — definido em `.devcontainer/`).
4. No terminal do Codespace, rode `npm run dev` e abra a porta **3000**.

## 🚀 Rodar localmente

```bash
npm install
cp .env.example .env      # ajuste as variáveis se necessário
npm run setup             # gera o client, cria o banco e popula com exemplos
npm run dev               # http://localhost:3000
```

### Variáveis de ambiente (`.env`)

| Variável            | Descrição                                                                 |
| ------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`      | Conexão do banco. Padrão: `file:./dev.db` (SQLite local).                 |
| `ANTHROPIC_API_KEY` | Chave do Claude para a IA. Sem ela, a geração de descrição usa o fallback. |

### Scripts úteis

| Comando             | O que faz                                  |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento                |
| `npm run build`     | Build de produção                          |
| `npm run db:push`   | Aplica o schema no banco                   |
| `npm run db:seed`   | Popula com imóveis de exemplo de Montréal  |
| `npm run db:studio` | Abre o Prisma Studio (visualizar o banco)  |

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
