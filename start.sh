#!/bin/bash

# 🚀 Script de Inicio Rápido - CH Polarizados Frontend

echo "🎯 Iniciando CH Polarizados Frontend..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "   Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo "✅ Dependencias instaladas"
    echo ""
fi

# Verificar si existe .env
if [ ! -f ".env" ]; then
    echo "⚙️  Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
    echo ""
fi

echo "✅ Todo listo!"
echo ""
echo "📝 Información importante:"
echo "   - URL: http://localhost:5173"
echo "   - Login: Cualquier email + password (6+ caracteres)"
echo "   - Ejemplo: admin@ch.com / 123456"
echo ""
echo "🚀 Iniciando servidor de desarrollo..."
echo ""

# Iniciar el servidor
npm run dev
