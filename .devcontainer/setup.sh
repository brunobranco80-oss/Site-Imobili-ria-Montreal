#!/usr/bin/env bash
# Preparação automática do Codespace / Dev Container do CRM Imobiliária Montreal.
set -e

echo "📦 Instalando dependências…"
npm install   # o postinstall já roda "prisma generate"

# Cria o .env a partir do exemplo (se ainda não existir).
if [ ! -f .env ]; then
  echo "🔧 Criando .env a partir de .env.example…"
  cp .env.example .env
fi

# Só cria/popula o banco se a DATABASE_URL já estiver configurada de verdade
# (e não for o valor de exemplo). Assim, a criação do Codespace nunca falha.
if grep -q "SEU_REF" .env 2>/dev/null || ! grep -q "^DATABASE_URL=" .env 2>/dev/null; then
  echo ""
  echo "⚠️  Banco ainda não configurado."
  echo "   Edite o arquivo .env com as URLs do seu projeto Supabase e depois rode:"
  echo "      npm run setup"
else
  echo "🗄️  Aplicando o schema no banco e populando com exemplos…"
  npm run setup
fi

echo ""
echo "✅ Ambiente pronto! Inicie o CRM com:  npm run dev  (porta 3000)"
