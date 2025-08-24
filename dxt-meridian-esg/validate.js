#!/usr/bin/env node

/**
 * Validation script for Meridian ESG DXT Extension
 * Validates manifest.json and server implementation
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function validateManifest() {
  log('\n📋 Validating manifest.json...', 'blue');
  
  try {
    const manifestPath = path.join(__dirname, 'manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    
    // Required fields
    const requiredFields = [
      'dxt_version',
      'name',
      'version',
      'description',
      'author',
      'server'
    ];
    
    const errors = [];
    const warnings = [];
    
    // Check required fields
    for (const field of requiredFields) {
      if (!manifest[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    // Validate dxt_version
    if (manifest.dxt_version && manifest.dxt_version !== '0.1') {
      warnings.push(`Unexpected dxt_version: ${manifest.dxt_version} (expected: 0.1)`);
    }
    
    // Validate author
    if (manifest.author && !manifest.author.name) {
      errors.push('Author object must have a name field');
    }
    
    // Validate server configuration
    if (manifest.server) {
      if (!manifest.server.type) {
        errors.push('Server must have a type field');
      } else if (!['node', 'python', 'binary'].includes(manifest.server.type)) {
        errors.push(`Invalid server type: ${manifest.server.type}`);
      }
      
      if (!manifest.server.entry_point) {
        errors.push('Server must have an entry_point field');
      }
    }
    
    // Validate tools
    if (manifest.tools) {
      for (const tool of manifest.tools) {
        if (!tool.name) {
          errors.push('Each tool must have a name');
        }
        if (!tool.description) {
          warnings.push(`Tool ${tool.name} is missing a description`);
        }
      }
    }
    
    // Validate user_config
    if (manifest.user_config) {
      for (const config of manifest.user_config) {
        if (!config.name) {
          errors.push('Each user_config item must have a name');
        }
        if (!config.type) {
          errors.push(`User config ${config.name} must have a type`);
        }
        if (config.type === 'number') {
          if (config.min !== undefined && config.max !== undefined && config.min > config.max) {
            errors.push(`User config ${config.name}: min value cannot be greater than max`);
          }
        }
      }
    }
    
    // Report results
    if (errors.length === 0) {
      log('✅ Manifest validation passed!', 'green');
    } else {
      log('❌ Manifest validation failed:', 'red');
      errors.forEach(err => log(`  - ${err}`, 'red'));
    }
    
    if (warnings.length > 0) {
      log('⚠️  Warnings:', 'yellow');
      warnings.forEach(warn => log(`  - ${warn}`, 'yellow'));
    }
    
    return errors.length === 0;
  } catch (error) {
    log(`❌ Failed to validate manifest: ${error.message}`, 'red');
    return false;
  }
}

async function validateServerFiles() {
  log('\n📦 Validating server files...', 'blue');
  
  try {
    const serverDir = path.join(__dirname, 'server');
    const requiredFiles = ['index.js', 'package.json'];
    const errors = [];
    
    // Check required files exist
    for (const file of requiredFiles) {
      const filePath = path.join(serverDir, file);
      try {
        await fs.access(filePath);
        log(`  ✓ ${file} exists`, 'green');
      } catch {
        errors.push(`Missing required file: server/${file}`);
        log(`  ✗ ${file} missing`, 'red');
      }
    }
    
    // Validate package.json
    try {
      const packagePath = path.join(serverDir, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      if (!packageJson.dependencies || !packageJson.dependencies['@modelcontextprotocol/sdk']) {
        errors.push('server/package.json must include @modelcontextprotocol/sdk dependency');
      }
      
      if (packageJson.type !== 'module') {
        errors.push('server/package.json must have "type": "module" for ES modules');
      }
    } catch (error) {
      errors.push(`Invalid server/package.json: ${error.message}`);
    }
    
    // Check if node_modules exists (for packaging)
    try {
      await fs.access(path.join(serverDir, 'node_modules'));
      log('  ✓ node_modules exists (ready for packaging)', 'green');
    } catch {
      log('  ⚠️  node_modules not found - run setup.sh or npm install', 'yellow');
    }
    
    if (errors.length === 0) {
      log('✅ Server files validation passed!', 'green');
      return true;
    } else {
      log('❌ Server files validation failed:', 'red');
      errors.forEach(err => log(`  - ${err}`, 'red'));
      return false;
    }
  } catch (error) {
    log(`❌ Failed to validate server files: ${error.message}`, 'red');
    return false;
  }
}

async function validateStructure() {
  log('\n🏗️  Validating extension structure...', 'blue');
  
  const structure = {
    'manifest.json': 'file',
    'server/': 'directory',
    'server/index.js': 'file',
    'server/package.json': 'file',
    'README.md': 'file',
    '.env.example': 'file'
  };
  
  const errors = [];
  
  for (const [relativePath, type] of Object.entries(structure)) {
    const fullPath = path.join(__dirname, relativePath);
    try {
      const stats = await fs.stat(fullPath);
      if (type === 'file' && !stats.isFile()) {
        errors.push(`${relativePath} should be a file`);
      } else if (type === 'directory' && !stats.isDirectory()) {
        errors.push(`${relativePath} should be a directory`);
      } else {
        log(`  ✓ ${relativePath}`, 'green');
      }
    } catch {
      errors.push(`Missing: ${relativePath}`);
      log(`  ✗ ${relativePath}`, 'red');
    }
  }
  
  if (errors.length === 0) {
    log('✅ Structure validation passed!', 'green');
    return true;
  } else {
    log('❌ Structure validation failed:', 'red');
    errors.forEach(err => log(`  - ${err}`, 'red'));
    return false;
  }
}

async function main() {
  log('🔍 Meridian ESG DXT Extension Validator', 'blue');
  log('========================================', 'blue');
  
  let allPassed = true;
  
  // Run all validations
  allPassed = await validateStructure() && allPassed;
  allPassed = await validateManifest() && allPassed;
  allPassed = await validateServerFiles() && allPassed;
  
  // Final summary
  log('\n' + '='.repeat(40), 'blue');
  if (allPassed) {
    log('✅ All validations passed! Extension is ready.', 'green');
    log('\nNext steps:', 'blue');
    log('1. Run setup.sh to install dependencies', 'blue');
    log('2. Configure .env with your Supabase credentials', 'blue');
    log('3. Test the server with test-server.js', 'blue');
    log('4. Package with: dxt pack .', 'blue');
  } else {
    log('❌ Some validations failed. Please fix the issues above.', 'red');
    process.exit(1);
  }
}

main().catch(error => {
  log(`\n❌ Validation script error: ${error.message}`, 'red');
  process.exit(1);
});