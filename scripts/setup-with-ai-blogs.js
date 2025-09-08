#!/usr/bin/env node

/**
 * Complete Database Setup with AI Blog Generation
 * This script sets up the database and generates realistic blogs using Gemini AI
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { generateBatchBlogs } = require('./09-batch-generate-blogs');

// Load environment variables
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

// Check environment variables
function checkEnvironment() {
  logStep(1, 'Checking environment configuration...');
  
  const requiredVars = ['MONGODB_URI'];
  const optionalVars = ['GEMINI_API_KEY'];
  
  let hasRequired = true;
  let hasOptional = true;
  
  // Check required variables
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      logError(`${varName} environment variable is not set!`);
      hasRequired = false;
    } else {
      logSuccess(`${varName} found`);
    }
  }
  
  // Check optional variables for AI features
  for (const varName of optionalVars) {
    if (!process.env[varName]) {
      logWarning(`${varName} not found - AI blog generation will be skipped`);
      hasOptional = false;
    } else {
      logSuccess(`${varName} found - AI blog generation available`);
    }
  }
  
  if (!hasRequired) {
    log('\n📝 Please create a .env.local file with the required variables:');
    log('MONGODB_URI=your_mongodb_connection_string');
    log('\n🤖 For AI blog generation, also add:');
    log('GEMINI_API_KEY=your_gemini_api_key');
    process.exit(1);
  }
  
  return { hasOptional };
}

// Run a Node.js script
function runNodeScript(scriptPath, description) {
  try {
    log(`Running: ${description}...`);
    
    const command = `node "${scriptPath}"`;
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
async function runCompleteSetup() {
  log(`${colors.bright}${colors.magenta}🚀 Devnovate Blog Platform - Complete Setup with AI${colors.reset}`);
  log(`${colors.blue}This script will set up your database and generate realistic blogs using Gemini 1.5 Flash${colors.reset}`);
  
  // Check environment
  const env = checkEnvironment();
  
  const scriptsDir = path.join(__dirname);
  
  // Database setup scripts
  const dbScripts = [
    {
      file: 'run-mongo-script.js',
      args: '01-init-database.js',
      description: 'Database initialization'
    },
    {
      file: 'run-mongo-script.js',
      args: '02-create-indexes.js', 
      description: 'Creating database indexes'
    },
    {
      file: 'run-mongo-script.js',
      args: '04-analytics-setup.js',
      description: 'Analytics setup'
    }
  ];
  
  let successCount = 0;
  
  // Run database setup scripts
  logStep(2, 'Setting up database infrastructure...');
  
  for (const script of dbScripts) {
    const scriptPath = path.join(scriptsDir, script.file);
    const fullCommand = `node "${scriptPath}" "${path.join(scriptsDir, script.args)}"`;
    
    try {
      log(`Running: ${script.description}...`);
      execSync(fullCommand, { stdio: 'inherit' });
      logSuccess(`${script.description} completed`);
      successCount++;
    } catch (error) {
      logError(`${script.description} failed: ${error.message}`);
    }
  }
  
  // AI Blog Generation
  if (env.hasOptional) {
    logStep(3, 'Generating realistic blogs with AI...');
    
    try {
      logInfo('Using Gemini 1.5 Flash AI to create high-quality developer content');
      const results = await generateBatchBlogs(8); // Generate 8 blogs
      
      if (results.success > 0) {
        logSuccess(`Generated ${results.success} AI-powered blogs!`);
      } else {
        logWarning('No blogs were generated successfully');
      }
      
    } catch (error) {
      logError(`AI blog generation failed: ${error.message}`);
      logWarning('Continuing with basic setup...');
    }
    
  } else {
    logStep(3, 'Skipping AI blog generation...');
    logInfo('Add GEMINI_API_KEY to .env.local to enable AI blog generation');
    
    // Fall back to basic seed data
    try {
      const seedScript = path.join(scriptsDir, 'run-mongo-script.js');
      const seedData = path.join(scriptsDir, '03-seed-data.js');
      const command = `node "${seedScript}" "${seedData}"`;
      
      log('Running basic seed data...');
      execSync(command, { stdio: 'inherit' });
      logSuccess('Basic seed data completed');
      successCount++;
    } catch (error) {
      logError(`Seed data failed: ${error.message}`);
    }
  }
  
  // Summary
  log(`\n${colors.bright}${colors.blue}📊 Setup Complete!${colors.reset}`);
  
  if (env.hasOptional) {
    logSuccess('🎉 Your blog platform is ready with AI-generated content!');
    log(`${colors.cyan}✨ Your database now contains realistic, high-quality blog posts${colors.reset}`);
  } else {
    logSuccess('🎉 Basic setup completed!');
    log(`${colors.yellow}💡 Add GEMINI_API_KEY to generate AI content later${colors.reset}`);
  }
  
  log(`\n${colors.yellow}Next steps:${colors.reset}`);
  log('1. Start your development server: npm run dev');
  log('2. Visit http://localhost:3000 to see your blog platform');
  log('3. Check out the generated content at http://localhost:3000/blogs');
  
  if (env.hasOptional) {
    log('\n🤖 AI Blog Generation:');
    log('• Run "node scripts/08-generate-custom-blogs.js react" for specific topics');
    log('• Run "node scripts/09-batch-generate-blogs.js 5" for more blogs');
  }
}

// Handle errors
process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

// Run the setup
runCompleteSetup().catch((error) => {
  logError(`Setup failed: ${error.message}`);
  process.exit(1);
});
