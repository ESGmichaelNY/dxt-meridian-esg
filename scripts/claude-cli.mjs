#!/usr/bin/env node

/**
 * Simple Claude CLI wrapper
 * Usage: claude "Your prompt here"
 */

import fetch from 'node-fetch';
import readline from 'readline';

const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('❌ Please set ANTHROPIC_API_KEY environment variable');
  console.error('   export ANTHROPIC_API_KEY="your-api-key-here"');
  process.exit(1);
}

async function callClaude(prompt) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('❌ API Error:', data.error.message);
      return;
    }
    
    console.log('\n' + data.content[0].text + '\n');
  } catch (error) {
    console.error('❌ Error calling Claude:', error.message);
  }
}

// Get prompt from command line or interactive mode
const args = process.argv.slice(2);
if (args.length > 0) {
  callClaude(args.join(' '));
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter your prompt: ', (prompt) => {
    callClaude(prompt);
    rl.close();
  });
}
