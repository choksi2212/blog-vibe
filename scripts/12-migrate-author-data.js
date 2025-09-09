#!/usr/bin/env node

/**
 * Migration script to fix author data in existing blogs
 * Converts blogs with author objects to use authorId references
 */

require('./load-env');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-vibe';

const authors = [
  { name: "Manas Choksi", email: "manas.choksi@devnovate.com" },
  { name: "Laukik Rajput", email: "laukik.rajput@devnovate.com" },
  { name: "Rudra Patel", email: "rudra.patel@devnovate.com" },
  { name: "Mihir Rabari", email: "mihir.rabari@devnovate.com" },
  { name: "Jiya Patel", email: "jiya.patel@devnovate.com" }
];

async function migrateAuthorData() {
  console.log('🔄 Starting author data migration...');
  console.log('════════════════════════════════════════════════════════════');

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('devnovate_blog');
  const blogsCollection = db.collection('blogs');
  const usersCollection = db.collection('users');

  try {
    // First, ensure all authors exist in users collection
    console.log('👥 Ensuring authors exist in users collection...');
    for (const author of authors) {
      const existingUser = await usersCollection.findOne({ email: author.email });
      if (!existingUser) {
        const userDoc = {
          uid: `ai-author-${author.name.toLowerCase().replace(/\s+/g, '-')}`,
          email: author.email,
          profile: {
            displayName: author.name,
            photoURL: null
          },
          role: 'author',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await usersCollection.insertOne(userDoc);
        console.log(`✅ Created user: ${author.name}`);
      } else {
        console.log(`ℹ️  User already exists: ${author.name}`);
      }
    }

    // Find blogs that have author object instead of authorId
    const blogsWithAuthorObject = await blogsCollection.find({
      $and: [
        { author: { $exists: true } },
        { authorId: { $exists: false } }
      ]
    }).toArray();

    console.log(`\n📝 Found ${blogsWithAuthorObject.length} blogs with author objects to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const blog of blogsWithAuthorObject) {
      try {
        // Find the corresponding user by email
        const authorEmail = blog.author?.email;
        if (!authorEmail) {
          console.log(`⚠️  Skipping blog "${blog.title}" - no author email found`);
          skipped++;
          continue;
        }

        const authorUser = await usersCollection.findOne({ email: authorEmail });
        if (!authorUser) {
          console.log(`⚠️  Skipping blog "${blog.title}" - author user not found for email: ${authorEmail}`);
          skipped++;
          continue;
        }

        // Update the blog to use authorId and remove author object
        await blogsCollection.updateOne(
          { _id: blog._id },
          {
            $set: { authorId: authorUser.uid },
            $unset: { author: 1 }
          }
        );

        console.log(`✅ Migrated: "${blog.title}" -> ${authorUser.profile.displayName}`);
        migrated++;

      } catch (error) {
        console.error(`❌ Error migrating blog "${blog.title}": ${error.message}`);
        skipped++;
      }
    }

    console.log('\n════════════════════════════════════════════════════════════');
    console.log('📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migrated} blogs`);
    console.log(`⚠️  Skipped: ${skipped} blogs`);
    console.log(`📈 Success rate: ${migrated > 0 ? ((migrated / (migrated + skipped)) * 100).toFixed(1) : 0}%`);
    console.log('\n🎉 Author data migration completed!');

  } catch (error) {
    console.error(`❌ Migration failed: ${error.message}`);
  } finally {
    await client.close();
  }
}

// Main execution
async function main() {
  try {
    await migrateAuthorData();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Script failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { migrateAuthorData };
