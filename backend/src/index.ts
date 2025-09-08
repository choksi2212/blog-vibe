import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// Mongo
const mongoUri = process.env.MONGODB_URI as string
if (!mongoUri) {
  console.error('Missing MONGODB_URI')
  process.exit(1)
}
const client = new MongoClient(mongoUri)
const dbName = 'devnovate_blog'

// Firebase Admin
if (!getApps().length) {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })
  } else {
    initializeApp()
  }
}
const adminAuth = getAuth()

// Auth middleware (optional Bearer)
function verify(optional = false) {
  return async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization as string | undefined
      if (!authHeader) {
        if (optional) return next()
        return res.status(401).json({ error: 'Unauthorized' })
      }
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
      const decoded = await adminAuth.verifyIdToken(token)
      req.user = decoded
      next()
    } catch (e) {
      if (optional) return next()
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }
}

// Health
app.get('/health', async (_req, res) => {
  try {
    await client.db('admin').command({ ping: 1 })
    return res.json({ ok: true })
  } catch {
    return res.status(500).json({ ok: false })
  }
})

// Blogs
app.get('/api/blogs', verify(true), async (req, res) => {
  const db = client.db(dbName)
  const { limit = '10', page = '1', status = 'published' } = req.query as Record<string, string>
  const q: any = { status }
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const [results, total] = await Promise.all([
    db.collection('blogs').find(q).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
    db.collection('blogs').countDocuments(q),
  ])
  return res.json({ blogs: results, pagination: { page: parseInt(page), limit: parseInt(limit), total } })
})

app.get('/api/blogs/:id', verify(true), async (req, res) => {
  const db = client.db(dbName)
  const id = req.params.id
  const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) })
  if (!blog) return res.status(404).json({ error: 'Not found' })
  return res.json({ blog })
})

app.post('/api/blogs', verify(), async (req: any, res) => {
  const db = client.db(dbName)
  const { title, content, excerpt, tags, status } = req.body
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' })
  const doc = {
    title,
    content,
    excerpt: excerpt || content.slice(0, 200) + '...',
    tags: Array.isArray(tags) ? tags : [],
    authorId: req.user.uid,
    status: status || 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 0,
    likes: 0,
    comments: 0,
  }
  const result = await db.collection('blogs').insertOne(doc)
  return res.json({ blogId: result.insertedId })
})

const port = process.env.PORT || 4000
client.connect().then(() => {
  app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`))
})

