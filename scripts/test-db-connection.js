#!/usr/bin/env node

/**
 * MongoDB Connection Test Script for Devnovate Blog Platform
 * This script tests the database connection and verifies basic operations
 */

const { MongoClient } = require('mongodb');
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
  log(`\n${colors.cyan}[TEST ${step}]${colors.reset} ${colors.bright}${message}${colors.reset}`);
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

// Test database connection and operations
async function testDatabaseConnection() {
  log(`${colors.bright}${colors.magenta}🔍 Devnovate Blog Platform - Database Connection Test${colors.reset}`);
  
  let client;
  
  try {
    // Check environment
    logStep(1, 'Checking environment configuration...');
    
    if (!process.env.MONGODB_URI) {
      logError('MONGODB_URI environment variable is not set!');
      log('Please make sure your .env.local file contains the MongoDB connection string.');
      return false;
    }
    
    logSuccess('MongoDB URI found in environment variables');
    
    // Test connection
    logStep(2, 'Testing MongoDB connection...');
    
    client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    
    await client.connect();
    logSuccess('Successfully connected to MongoDB');
    
    // Test database access
    logStep(3, 'Testing database access...');
    
    const db = client.db('devnovate_blog');
    const adminDb = client.db().admin();
    
    // Get server info
    const serverInfo = await adminDb.serverStatus();
    logInfo(`MongoDB version: ${serverInfo.version}`);
    logInfo(`Server uptime: ${Math.floor(serverInfo.uptime / 3600)} hours`);
    
    // Test collections
    logStep(4, 'Testing collections...');
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    logInfo(`Found ${collections.length} collections: ${collectionNames.join(', ')}`);
    
    // Check required collections
    const requiredCollections = ['users', 'blogs', 'comments', 'notifications', 'blog_analytics'];
    const missingCollections = requiredCollections.filter(name => !collectionNames.includes(name));
    
    if (missingCollections.length > 0) {
      logWarning(`Missing collections: ${missingCollections.join(', ')}`);
      log('Run the database setup script to create missing collections: npm run setup:db');
    } else {
      logSuccess('All required collections are present');
    }
    
    // Test basic operations
    logStep(5, 'Testing basic database operations...');
    
    // Test users collection
    const userCount = await db.collection('users').countDocuments();
    logInfo(`Users collection: ${userCount} documents`);
    
    // Test blogs collection
    const blogCount = await db.collection('blogs').countDocuments();
    logInfo(`Blogs collection: ${blogCount} documents`);
    
    // Test indexes
    logStep(6, 'Testing database indexes...');
    
    const userIndexes = await db.collection('users').listIndexes().toArray();
    const blogIndexes = await db.collection('blogs').listIndexes().toArray();
    
    logInfo(`Users collection: ${userIndexes.length} indexes`);
    logInfo(`Blogs collection: ${blogIndexes.length} indexes`);
    
    // Test a simple query
    logStep(7, 'Testing query operations...');
    
    const sampleUser = await db.collection('users').findOne({});
    if (sampleUser) {
      logSuccess('Successfully queried users collection');
      logInfo(`Sample user: ${sampleUser.email || 'No email'} (${sampleUser.role || 'No role'})`);
    } else {
      logWarning('No users found in database');
    }
    
    const sampleBlog = await db.collection('blogs').findOne({});
    if (sampleBlog) {
      logSuccess('Successfully queried blogs collection');
      logInfo(`Sample blog: "${sampleBlog.title || 'No title'}" (${sampleBlog.status || 'No status'})`);
    } else {
      logWarning('No blogs found in database');
    }
    
    // Test write operation (insert a test document)
    logStep(8, 'Testing write operations...');
    
    const testDoc = {
      _id: 'test-connection-' + Date.now(),
      test: true,
      timestamp: new Date(),
      message: 'Database connection test'
    };
    
    await db.collection('test_connection').insertOne(testDoc);
    logSuccess('Successfully inserted test document');
    
    // Clean up test document
    await db.collection('test_connection').deleteOne({ _id: testDoc._id });
    logSuccess('Successfully cleaned up test document');
    
    // Final summary
    log(`\n${colors.bright}${colors.green}🎉 Database Connection Test Completed Successfully!${colors.reset}`);
    log(`${colors.cyan}Your MongoDB database is working correctly and ready for the Devnovate Blog Platform.${colors.reset}`);
    
    return true;
    
  } catch (error) {
    logError(`Database connection test failed: ${error.message}`);
    
    if (error.name === 'MongoServerSelectionError') {
      logError('Could not connect to MongoDB server. Please check:');
      log('1. Your internet connection');
      log('2. MongoDB Atlas cluster status');
      log('3. Connection string format');
      log('4. Network access settings in MongoDB Atlas');
    } else if (error.name === 'MongoAuthenticationError') {
      logError('Authentication failed. Please check:');
      log('1. Username and password in connection string');
      log('2. Database user permissions');
    } else if (error.name === 'MongoNetworkError') {
      logError('Network error. Please check:');
      log('1. Your internet connection');
      log('2. Firewall settings');
      log('3. MongoDB Atlas IP whitelist');
    }
    
    return false;
  } finally {
    if (client) {
      await client.close();
      logInfo('Database connection closed');
    }
  }
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

// Run the test
testDatabaseConnection()
  .then((success) => {
    if (success) {
      log(`\n${colors.green}✅ All tests passed! Your database is ready.${colors.reset}`);
      process.exit(0);
    } else {
      log(`\n${colors.red}❌ Database test failed. Please fix the issues above.${colors.reset}`);
      process.exit(1);
    }
  })
  .catch((error) => {
    logError(`Test failed: ${error.message}`);
    process.exit(1);
  });
