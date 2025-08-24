#!/usr/bin/env node

/**
 * Interactive test for Meridian ESG MCP Server
 * Tests the server with actual MCP protocol messages
 */

import { spawn } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🧪 Meridian ESG MCP Server Interactive Test');
console.log('===========================================\n');

// Load environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Start the server
console.log('Starting MCP server...\n');
const server = spawn('node', ['server/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env },
  cwd: __dirname
});

let requestId = 1;

// Handle server stderr (logs)
server.stderr.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    console.log('📝 Server log:', line);
  });
});

// Handle server stdout (MCP responses)
server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      console.log('\n✅ Response received:');
      console.log(JSON.stringify(response, null, 2));
      
      // Handle specific responses
      if (response.id === 1) {
        console.log('\n✅ Server initialized successfully!');
        console.log('Server name:', response.result.serverInfo.name);
        console.log('Server version:', response.result.serverInfo.version);
        runTests();
      }
    } catch (e) {
      // Not JSON, might be a log
      if (line.trim()) {
        console.log('Server output:', line);
      }
    }
  });
});

// Send a request to the server
function sendRequest(method, params = {}) {
  const request = {
    jsonrpc: '2.0',
    id: requestId++,
    method,
    params
  };
  
  console.log('\n📤 Sending request:', method);
  console.log(JSON.stringify(params, null, 2));
  
  server.stdin.write(JSON.stringify(request) + '\n');
}

// Run a series of tests
async function runTests() {
  console.log('\n' + '='.repeat(50));
  console.log('Running test sequence...\n');
  
  // Test 1: List available tools
  console.log('Test 1: Listing available tools');
  sendRequest('tools/list');
  
  // Wait for response before next test
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 2: Call a simple tool
  console.log('\nTest 2: Testing dev_workflow tool');
  sendRequest('tools/call', {
    name: 'dev_workflow',
    arguments: {
      command: 'typecheck'
    }
  });
  
  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 3: Test ESG validation
  console.log('\nTest 3: Testing ESG data validation');
  sendRequest('tools/call', {
    name: 'validate_esg_data',
    arguments: {
      data: {
        scope1: 1000,
        scope2: 500,
        scope3: 2000,
        unit: 'tCO2e',
        period: '2024-Q1'
      },
      framework: 'GRI',
      category: 'emissions'
    }
  });
  
  // Wait before exiting
  setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('Test sequence complete!');
    console.log('\nPress Ctrl+C to exit or continue testing manually.');
    showMenu();
  }, 3000);
}

// Show interactive menu
function showMenu() {
  console.log('\n📋 Available test commands:');
  console.log('1. List tools');
  console.log('2. Test Supabase query');
  console.log('3. Validate ESG data');
  console.log('4. Check security audit');
  console.log('5. Run dev workflow command');
  console.log('6. Exit');
  
  rl.question('\nSelect option (1-6): ', (answer) => {
    handleMenuChoice(answer);
  });
}

function handleMenuChoice(choice) {
  switch(choice) {
    case '1':
      sendRequest('tools/list');
      setTimeout(showMenu, 1000);
      break;
      
    case '2':
      sendRequest('tools/call', {
        name: 'supabase_query',
        arguments: {
          table: 'organizations',
          select: 'id, name, created_at',
          limit: 5
        }
      });
      setTimeout(showMenu, 2000);
      break;
      
    case '3':
      sendRequest('tools/call', {
        name: 'validate_esg_data',
        arguments: {
          data: {
            scope1: 1500,
            scope2: 750,
            unit: 'tCO2e'
          },
          framework: 'TCFD',
          category: 'emissions'
        }
      });
      setTimeout(showMenu, 1000);
      break;
      
    case '4':
      sendRequest('tools/call', {
        name: 'audit_security',
        arguments: {
          scope: 'code',
          includeValidation: true
        }
      });
      setTimeout(showMenu, 2000);
      break;
      
    case '5':
      sendRequest('tools/call', {
        name: 'dev_workflow',
        arguments: {
          command: 'lint'
        }
      });
      setTimeout(showMenu, 3000);
      break;
      
    case '6':
      console.log('\nExiting...');
      process.exit(0);
      break;
      
    default:
      console.log('Invalid option');
      showMenu();
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  server.kill();
  process.exit(0);
});

// Initialize the server
console.log('Initializing MCP server...');
sendRequest('initialize', {
  protocolVersion: '0.1.0',
  capabilities: {},
  clientInfo: {
    name: 'test-client',
    version: '1.0.0'
  }
});