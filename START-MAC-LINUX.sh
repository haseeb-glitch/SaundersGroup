#!/usr/bin/env sh
set -eu

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js no está instalado. Instala Node.js LTS desde https://nodejs.org"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Instalando dependencias..."
  npm install
fi

echo "ORDENA+ estará disponible en http://localhost:3000"
echo "Para detenerlo, presiona Ctrl+C."
npm run dev
