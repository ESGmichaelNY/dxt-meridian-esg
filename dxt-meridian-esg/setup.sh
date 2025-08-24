#!/bin/bash

# Meridian ESG DXT Extension Setup Script

set -e

echo "🚀 Meridian ESG Desktop Extension Setup"
echo "========================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be >= 18.0.0 (found: $(node -v))"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Check npm/pnpm
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    echo "✅ pnpm $(pnpm -v)"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    echo "✅ npm $(npm -v)"
else
    echo "❌ Neither npm nor pnpm is installed"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
cd server
$PKG_MANAGER install

# Create .env.example if it doesn't exist
if [ ! -f ../.env.example ]; then
    echo ""
    echo "📝 Creating .env.example..."
    cat > ../.env.example << 'EOF'
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here

# Environment
ENVIRONMENT=local
ENABLE_DEBUG=false

# Workspace
WORKSPACE_DIR=../
MAX_QUERY_RESULTS=100
EOF
    echo "✅ Created .env.example"
fi

# Check if .env exists
if [ ! -f ../.env ]; then
    echo ""
    echo "⚠️  No .env file found. Please create one:"
    echo "   cp .env.example .env"
    echo "   Then edit .env with your Supabase credentials"
fi

# Create a test script
echo ""
echo "📝 Creating test script..."
cat > ../test-server.js << 'EOF'
#!/usr/bin/env node

// Test script for Meridian ESG MCP Server

import { spawn } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🧪 Meridian ESG MCP Server Test');
console.log('================================\n');

// Start the server
const server = spawn('node', ['server/index.js'], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: { ...process.env }
});

// Send initialize request
const initRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '0.1.0',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  }
};

server.stdin.write(JSON.stringify(initRequest) + '\n');

// Handle server output
server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      console.log('Response:', JSON.stringify(response, null, 2));
      
      if (response.id === 1) {
        // Send list tools request after initialization
        const listToolsRequest = {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {}
        };
        server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
      } else if (response.id === 2) {
        console.log('\n✅ Server is working correctly!');
        console.log('Available tools:', response.result.tools.map(t => t.name).join(', '));
        process.exit(0);
      }
    } catch (e) {
      // Not JSON, probably a log message
      console.log('Log:', line);
    }
  });
});

// Timeout after 5 seconds
setTimeout(() => {
  console.log('\n⏱️ Test timeout - server may not be responding correctly');
  process.exit(1);
}, 5000);
EOF

chmod +x ../test-server.js

echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "1. Configure your environment:"
echo "   cp .env.example .env"
echo "   Edit .env with your Supabase credentials"
echo ""
echo "2. Test the server:"
echo "   node test-server.js"
echo ""
echo "3. Package the extension (requires dxt CLI):"
echo "   dxt pack ."
echo ""
echo "4. Install in Claude Desktop:"
echo "   - Open Claude Desktop"
echo "   - Go to Extensions"
echo "   - Install the .dxt file"
echo ""
echo "For more information, see README.md"