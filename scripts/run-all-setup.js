#!/usr/bin/env node

/**
 * Database Setup Script for Devnovate Blog Platform
 * This script runs all database initialization scripts in the correct order
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
require('./load-env');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.cyan}[STEP ${step}]${colors.reset} ${colors.bright}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logInfo(message) {
  log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// Check if MongoDB connection string is available
function checkEnvironment() {
  logStep(1, 'Checking environment configuration...');
  
  // Debug: Show what environment variables are loaded
  logInfo(`Environment variables loaded: ${Object.keys(process.env).filter(key => key.includes('MONGO')).join(', ')}`);
  
  if (!process.env.MONGODB_URI) {
    logError('MONGODB_URI environment variable is not set!');
    log('Please make sure your .env.local file contains the MongoDB connection string.');
    log('Expected format: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/...');
    
    // Check if .env.local exists
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      logInfo('.env.local file exists, but MONGODB_URI is not found in it.');
      log('Please check that your .env.local file contains:');
      log('MONGODB_URI=mongodb+srv://niklaus2122:Kingo2122@vibehack.ye2ecdo.mongodb.net/?retryWrites=true&w=majority&appName=vibehack');
    } else {
      logError('.env.local file not found in project root!');
      log('Please create a .env.local file with your MongoDB connection string.');
    }
    
    process.exit(1);
  }
  
  logSuccess('MongoDB URI found in environment variables');
  logInfo(`Connection string: ${process.env.MONGODB_URI.substring(0, 50)}...`);
}

// Run a MongoDB script
function runMongoScript(scriptPath, description) {
  try {
    log(`Running: ${description}...`);
    
    const command = `mongosh "${process.env.MONGODB_URI}" --file "${scriptPath}"`;
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    logSuccess(`${description} completed successfully`);
    return true;
  } catch (error) {
    logError(`${description} failed: ${error.message}`);
    return false;
  }
}

// Main setup function
async function runSetup() {
  log(`${colors.bright}${colors.magenta}🚀 Devnovate Blog Platform - Database Setup${colors.reset}`);
  log(`${colors.blue}This script will initialize your MongoDB database with all necessary collections, indexes, and sample data.${colors.reset}`);
  
  // Check environment
  checkEnvironment();
  
  const scriptsDir = path.join(__dirname);
  const scripts = [
    {
      file: '01-init-database.js',
      description: 'Database initialization (collections and schemas)'
    },
    {
      file: '02-create-indexes.js', 
      description: 'Creating database indexes'
    },
    {
      file: '03-seed-data.js',
      description: 'Seeding sample data'
    },
    {
      file: '04-analytics-setup.js',
      description: 'Analytics collection setup'
    }
  ];
  
  let successCount = 0;
  let totalScripts = scripts.length;
  
  // Run each script
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    const scriptPath = path.join(scriptsDir, script.file);
    
    // Check if script file exists
    if (!fs.existsSync(scriptPath)) {
      logError(`Script file not found: ${script.file}`);
      continue;
    }
    
    logStep(i + 2, script.description);
    
    if (runMongoScript(scriptPath, script.description)) {
      successCount++;
    } else {
      logWarning(`Continuing with remaining scripts...`);
    }
  }
  
  // Summary
  log(`\n${colors.bright}${colors.blue}📊 Setup Summary${colors.reset}`);
  log(`Successfully completed: ${colors.green}${successCount}/${totalScripts}${colors.reset} scripts`);
  
  if (successCount === totalScripts) {
    logSuccess('🎉 Database setup completed successfully!');
    log(`${colors.cyan}Your Devnovate Blog Platform database is now ready to use.${colors.reset}`);
  } else {
    logWarning(`Database setup completed with ${totalScripts - successCount} errors.`);
    log('Please check the error messages above and run the failed scripts manually if needed.');
  }
  
  log(`\n${colors.yellow}Next steps:${colors.reset}`);
  log('1. Start your Next.js development server: npm run dev');
  log('2. Test the database connection: npm run test:db');
  log('3. Visit http://localhost:3000 to see your blog platform');
}

// Handle errors
process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Run the setup
runSetup().catch((error) => {
  logError(`Setup failed: ${error.message}`);
  process.exit(1);
});
