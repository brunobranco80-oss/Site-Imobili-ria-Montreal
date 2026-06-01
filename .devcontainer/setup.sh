#!/usr/bin/env bash
# Preparação automática do Codespace / Dev Container do CRM Imobiliária Montreal.
set -e

echo "📦 Instalando dependências…"
npm install

# Cria o .env a partir do exemplo (se ainda não existir).
if [ ! -f .env ]; then
  echo "🔧 Criando .env a partir de .env.example…"
  cp .env.example .env
fi

echo "🗄️  Gerando o Prisma, criando o banco e populando com exemplos…"
npm run setup

echo ""
echo "✅ Tudo pronto! Para iniciar o CRM, rode:  npm run dev"
echo "   Em seguida abra a aba 'Portas' (porta 3000) para ver o site."
