#!/bin/bash

# Setup script for local development
set -e

echo "🚀 Setting up Meridian ESG local development environment..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "⚠️  Please update .env.local with your Supabase credentials"
    echo "   Run 'pnpm supabase:start' to get local credentials"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Start Supabase if not running
echo "🗄️  Starting local Supabase..."
pnpm supabase:start

echo ""
echo "✅ Local environment is ready!"
echo ""
echo "📋 Next steps:"
echo "   1. Update .env.local with the credentials shown above"
echo "   2. Run 'pnpm dev' to start the development server"
echo "   3. Open http://localhost:3000"
echo ""
echo "🔑 Important: Never commit .env.local to git!"