// Extra seed data for Devnovate Blog Platform
// Run with: npm run db:seed:extra (requires MONGODB_URI)

const dbName = "devnovate_blog"
const dbRef = db.getSiblingDB(dbName)

function randomInt(max) {
  return Math.floor(Math.random() * max)
}

const now = Date.now()
const days = (n) => new Date(now - n * 24 * 60 * 60 * 1000)

const authors = ["user-uid-001", "user-uid-002", "user-uid-003"]
const tagsPool = [
  "react",
  "nextjs",
  "node",
  "mongodb",
  "firebase",
  "auth",
  "design",
  "performance",
  "testing",
  "devops",
]

function pickTags() {
  const count = 2 + randomInt(3)
  const shuffled = [...tagsPool].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const moreBlogs = Array.from({ length: 16 }).map((_, i) => {
  const idx = i + 1
  const title = `Real-World Engineering Case #${idx}: Scaling & Lessons`
  const content = `# Scaling Story ${idx}\n\nWhen our traffic spiked, we focused on three pillars: **observability**, **caching**, and **profiling**.\n\n## Highlights\n- Implemented Redis layer for hot paths\n- Added indexes in MongoDB for slow queries\n- Introduced CI checks for performance regressions\n\n## Code Snippet\n\n\`\`\`js\nconst result = await db.collection('blogs').find(query).sort({ createdAt: -1 }).toArray()\n\`\`\`\n\n## Takeaways\nSmall changes compound. Measure first, then optimize.`
  const excerpt = `Scaling story ${idx}: caching, indexes, and profiling to reduce latency.`
  const authorId = authors[idx % authors.length]
  const published = idx % 7 !== 0 // sprinkle a few non-published
  return {
    title,
    excerpt,
    content,
    tags: pickTags(),
    authorId,
    status: published ? "published" : idx % 2 === 0 ? "pending" : "draft",
    views: 50 + randomInt(3000),
    likes: randomInt(400),
    comments: 0,
    createdAt: days(20 - idx),
    updatedAt: days(20 - idx),
  }
})

dbRef.blogs.insertMany(moreBlogs)

print(`✅ Inserted ${moreBlogs.length} extra blogs into '${dbName}.blogs'`)

