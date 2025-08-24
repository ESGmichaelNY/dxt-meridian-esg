#!/usr/bin/env node

/**
 * Simple test for Meridian ESG MCP Server
 * Tests basic functionality without interactive mode
 */

import { spawn } from 'child_process';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

console.log('🧪 Meridian ESG MCP Server Test');
console.log('================================\n');

// Start the server
const server = spawn('node', ['server/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env },
  cwd: __dirname
});

let requestId = 1;
let testsPassed = 0;
let testsFailed = 0;

// Handle server stderr (logs)
server.stderr.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    if (process.env.ENABLE_DEBUG === 'true') {
      console.log('📝 Log:', line);
    }
  });
});

// Handle server stdout (MCP responses)
server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      
      // Check response based on ID
      switch(response.id) {
        case 1: // Initialize response
          if (response.result?.serverInfo?.name === 'meridian-esg') {
            console.log('✅ Test 1 PASSED: Server initialized');
            testsPassed++;
          } else {
            console.log('❌ Test 1 FAILED: Server initialization');
            testsFailed++;
          }
          // Send next test
          sendRequest('tools/list');
          break;
          
        case 2: // List tools response
          if (response.result?.tools && response.result.tools.length === 8) {
            console.log('✅ Test 2 PASSED: Found 8 tools');
            console.log('   Tools:', response.result.tools.map(t => t.name).join(', '));
            testsPassed++;
          } else {
            console.log('❌ Test 2 FAILED: Tool list incorrect');
            testsFailed++;
          }
          // Send next test
          sendRequest('tools/call', {
            name: 'validate_esg_data',
            arguments: {
              data: { scope1: 1000, scope2: 500, unit: 'tCO2e' },
              framework: 'GRI',
              category: 'emissions'
            }
          });
          break;
          
        case 3: // Validate ESG data response
          const content = JSON.parse(response.result?.content?.[0]?.text || '{}');
          if (content.success && content.valid) {
            console.log('✅ Test 3 PASSED: ESG validation works');
            testsPassed++;
          } else {
            console.log('❌ Test 3 FAILED: ESG validation');
            testsFailed++;
          }
          // Send next test
          sendRequest('tools/call', {
            name: 'audit_security',
            arguments: {
              scope: 'code',
              includeValidation: true
            }
          });
          break;
          
        case 4: // Security audit response
          const auditContent = JSON.parse(response.result?.content?.[0]?.text || '{}');
          if (auditContent.success && auditContent.audit) {
            console.log('✅ Test 4 PASSED: Security audit works');
            testsPassed++;
          } else {
            console.log('❌ Test 4 FAILED: Security audit');
            testsFailed++;
          }
          // All tests complete
          finishTests();
          break;
      }
    } catch (e) {
      // Not JSON or error
      if (line.includes('error')) {
        console.log('❌ Error:', line);
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
  
  server.stdin.write(JSON.stringify(request) + '\n');
}

// Finish tests and show results
function finishTests() {
  console.log('\n' + '='.repeat(40));
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed! The extension is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs for details.');
  }
  
  console.log('\n📦 Next Steps:');
  console.log('1. Package the extension: dxt pack .');
  console.log('2. Install in Claude Desktop');
  console.log('3. Configure with your Supabase credentials');
  
  // Clean exit
  setTimeout(() => {
    server.kill();
    process.exit(testsFailed === 0 ? 0 : 1);
  }, 1000);
}

// Handle errors
server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

// Start tests
console.log('Starting server and running tests...\n');

// Initialize the server
sendRequest('initialize', {
  protocolVersion: '0.1.0',
  capabilities: {},
  clientInfo: {
    name: 'test-client',
    version: '1.0.0'
  }
});

// Set a timeout
setTimeout(() => {
  console.log('\n⏱️ Test timeout - server may not be responding');
  server.kill();
  process.exit(1);
}, 10000);