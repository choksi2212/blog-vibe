#!/usr/bin/env node

/**
 * MongoDB Atlas Storage Usage Checker
 * Checks database size, collection sizes, and storage usage for Atlas free tier monitoring
 */

require('./load-env');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-vibe';

async function checkStorageUsage() {
  console.log('🔍 Checking MongoDB Atlas Storage Usage...');
  console.log('════════════════════════════════════════════════════════════');

  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db('devnovate_blog');
    const adminDb = client.db().admin();
    
    // Get database stats
    const dbStats = await db.stats();
    
    console.log('\n📊 Database Statistics:');
    console.log(`📁 Database: ${dbStats.db}`);
    console.log(`📦 Collections: ${dbStats.collections}`);
    console.log(`📄 Documents: ${dbStats.objects.toLocaleString()}`);
    console.log(`💾 Data Size: ${formatBytes(dbStats.dataSize)}`);
    console.log(`🗂️  Storage Size: ${formatBytes(dbStats.storageSize)}`);
    console.log(`📈 Index Size: ${formatBytes(dbStats.indexSize)}`);
    console.log(`📊 Total Size: ${formatBytes(dbStats.storageSize + dbStats.indexSize)}`);
    
    // Calculate free space
    const totalSize = dbStats.storageSize + dbStats.indexSize;
    const freeTierLimit = 512 * 1024 * 1024; // 512MB in bytes
    const usedPercentage = (totalSize / freeTierLimit) * 100;
    const remainingBytes = freeTierLimit - totalSize;
    
    console.log('\n🎯 Atlas Free Tier (512MB) Usage:');
    console.log(`📊 Used: ${formatBytes(totalSize)} (${usedPercentage.toFixed(2)}%)`);
    console.log(`🆓 Remaining: ${formatBytes(Math.max(0, remainingBytes))} (${(100 - usedPercentage).toFixed(2)}%)`);
    
    // Visual progress bar
    const barLength = 50;
    const filledLength = Math.round((usedPercentage / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    console.log(`📊 [${bar}] ${usedPercentage.toFixed(1)}%`);
    
    // Warning if approaching limit
    if (usedPercentage > 80) {
      console.log('\n⚠️  WARNING: You are using more than 80% of your free tier storage!');
      console.log('💡 Consider upgrading to a paid plan or cleaning up old data.');
    } else if (usedPercentage > 60) {
      console.log('\n⚠️  NOTICE: You are using more than 60% of your free tier storage.');
    } else {
      console.log('\n✅ Storage usage is within comfortable limits.');
    }
    
    // Get collection breakdown
    console.log('\n📋 Collection Breakdown:');
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const coll = db.collection(collectionName);
      const collStats = await coll.stats();
      
      console.log(`\n📁 ${collectionName}:`);
      console.log(`   📄 Documents: ${collStats.count.toLocaleString()}`);
      console.log(`   💾 Data Size: ${formatBytes(collStats.size)}`);
      console.log(`   🗂️  Storage Size: ${formatBytes(collStats.storageSize)}`);
      console.log(`   📈 Index Size: ${formatBytes(collStats.totalIndexSize)}`);
      console.log(`   📊 Total: ${formatBytes(collStats.storageSize + collStats.totalIndexSize)}`);
    }
    
    // Get index information
    console.log('\n🔍 Index Information:');
    for (const collection of collections) {
      const coll = db.collection(collection.name);
      const indexes = await coll.indexes();
      
      console.log(`\n📁 ${collection.name} indexes:`);
      indexes.forEach((index, i) => {
        const indexSize = index.size || 0;
        console.log(`   ${i + 1}. ${index.name}: ${formatBytes(indexSize)}`);
      });
    }
    
    // Recommendations
    console.log('\n💡 Storage Optimization Recommendations:');
    
    if (dbStats.indexSize > dbStats.dataSize * 0.3) {
      console.log('⚠️  High index overhead detected. Consider reviewing indexes.');
    }
    
    if (dbStats.storageSize > dbStats.dataSize * 1.5) {
      console.log('⚠️  High storage overhead detected. Consider running compact() or rebuilding collections.');
    }
    
    console.log('✅ Regular cleanup of old/unused data can help manage storage.');
    console.log('✅ Consider archiving old blog posts if storage becomes critical.');
    console.log('✅ Monitor this regularly to avoid hitting the 512MB limit.');
    
  } catch (error) {
    console.error('❌ Error checking storage usage:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB Atlas');
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Main execution
async function main() {
  try {
    await checkStorageUsage();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Script failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkStorageUsage };
