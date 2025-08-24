#!/usr/bin/env node

/**
 * Environment variable checker for local development
 */

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const optional = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_PROJECT_ID',
  'NEXT_PUBLIC_APP_URL',
];

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;

// Check required variables
console.log('Required variables:');
required.forEach(key => {
  const value = process.env[key];
  if (!value || value.includes('your-') || value.includes('here')) {
    console.log(`❌ ${key}: Not configured`);
    hasErrors = true;
  } else {
    console.log(`✅ ${key}: Configured`);
  }
});

console.log('\nOptional variables:');
optional.forEach(key => {
  const value = process.env[key];
  if (!value || value.includes('your-') || value.includes('here')) {
    console.log(`⚠️  ${key}: Not configured (optional)`);
  } else {
    console.log(`✅ ${key}: Configured`);
  }
});

if (hasErrors) {
  console.log('\n❌ Some required environment variables are not configured.');
  console.log('   Please update your .env.local file with the correct values.');
  console.log('\n💡 To get local Supabase credentials, run:');
  console.log('   pnpm supabase:start');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are configured!');
}