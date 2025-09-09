#!/usr/bin/env node

/**
 * Simple AI Blog Generator - Gemini 1.5 Flash API
 * Uses Google's Gemini 1.5 Flash model for reliable blog generation
 */

require('./load-env');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-vibe';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
  console.log('Please add GEMINI_API_KEY=your_api_key to your .env.local file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Simple blog topics
const topics = [
    "Smart Villages: IoT and Agriculture 4.0 in Rural India",
    "Cybersecurity for SMEs: Protecting India's Digital Backbone",
    "EdTech in India: Scaling Personalized Learning with AI",
    "Green Tech Startups in India: Innovating for a Sustainable Future"
];

const authors = [
  { name: "Manas Choksi", email: "manas.choksi@devnovate.com" },
  { name: "Laukik Rajput", email: "laukik.rajput@devnovate.com" },
  { name: "Rudra Patel", email: "rudra.patel@devnovate.com" },
  { name: "Mihir Rabari", email: "mihir.rabari@devnovate.com" },
  { name: "Jiya Patel", email: "jiya.patel@devnovate.com" }
];

async function generateSimpleBlog(topic, author) {
  const systemPrompt = `You are a senior software engineer and technical writer. Write comprehensive, realistic blog posts about technical topics.

Format your response exactly as:
TITLE: [engaging title]
EXCERPT: [2-3 sentence summary]
TAGS: [tag1, tag2, tag3, tag4, tag5]
CONTENT:
[full blog content in markdown format]

Requirements:
- 2000+ words of technical content
- Include practical code examples with \`\`\`language syntax
- Use proper markdown headings (##, ###)
- Provide real-world use cases and best practices
- Write in a professional but engaging tone
- Include a strong conclusion

Write a comprehensive technical blog post about: ${topic}`;

  try {
    console.log(`🤖 Generating: "${topic}"`);
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.7,
      },
    });

    const text = result.response.text();

    // Parse the structured response
    const titleMatch = text.match(/TITLE:\s*(.+)/);
    const excerptMatch = text.match(/EXCERPT:\s*(.+?)(?=\nTAGS:|$)/s);
    const tagsMatch = text.match(/TAGS:\s*(.+?)(?=\nCONTENT:|$)/s);
    const contentMatch = text.match(/CONTENT:\s*([\s\S]+)$/);

    if (!titleMatch || !excerptMatch || !contentMatch) {
      throw new Error('Could not parse AI response structure');
    }

    const title = titleMatch[1].trim();
    const excerpt = excerptMatch[1].trim().replace(/\n/g, ' ');
    const content = contentMatch[1].trim();
    const tagsText = tagsMatch ? tagsMatch[1].trim() : '';
    const tags = tagsText.split(',').map(tag => tag.trim().replace(/[\[\]]/g, '')).filter(tag => tag);

    // Create blog document
    const blog = {
      title,
      excerpt,
      content,
      tags: tags.length > 0 ? tags : ['programming', 'development'],
      author: {
        displayName: author.name,
        email: author.email
      },
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 50) + 10,
      readTime: Math.ceil(content.length / 1000) // Rough estimate
    };

    return blog;
  } catch (error) {
    console.error(`❌ Error generating blog: ${error.message}`);
    return null;
  }
}

async function generateMultipleBlogs(count = 5) {
  console.log(`🚀 Starting Gemini AI Blog Generation...`);
  console.log(`📊 Generating ${count} blogs with Gemini 1.5 Flash`);
  console.log('════════════════════════════════════════════════════════════');

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('devnovate_blog');
  const blogsCollection = db.collection('blogs');

  let successful = 0;
  let failed = 0;

  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    const author = authors[i % authors.length];

    console.log(`\n📝 [${i + 1}/${count}] "${topic}"`);
    console.log(`👤 Author: ${author.name}`);

    const blog = await generateSimpleBlog(topic, author);

    if (blog) {
      try {
        await blogsCollection.insertOne(blog);
        console.log(`✅ Successfully created: "${blog.title}"`);
        successful++;
      } catch (dbError) {
        console.error(`❌ Database error: ${dbError.message}`);
        failed++;
      }
    } else {
      failed++;
    }

    // Wait between requests to avoid rate limiting
    if (i < count - 1) {
      console.log('⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n════════════════════════════════════════════════════════════');
  console.log('📊 Generation Summary:');
  console.log(`✅ Successfully generated: ${successful} blogs`);
  console.log(`❌ Failed: ${failed} blogs`);
  console.log(`📈 Success rate: ${((successful / count) * 100).toFixed(1)}%`);
  console.log('\n🎉 Gemini blog generation completed!');

  await client.close();
  return { successful, failed, total: count };
}

// Main execution
async function main() {
  const count = parseInt(process.argv[2]) || 5;
  
  if (count > 10) {
    console.log('⚠️  Limited to 10 blogs per run to avoid rate limiting');
    process.exit(1);
  }

  try {
    await generateMultipleBlogs(count);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Script failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateSimpleBlog, generateMultipleBlogs };
