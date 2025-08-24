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
