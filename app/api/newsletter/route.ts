import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { applyCorsHeaders, rateLimit } from '@/lib/security'
import { z } from 'zod'

const uri = process.env.MONGODB_URI || ''
const client = new MongoClient(uri)

export async function POST(request: NextRequest) {
  try {
    // Gentle IP-based rate limit: 10 requests / 10 minutes
    const rl = rateLimit(request.headers, 'newsletter:post', 10, 10 * 60 * 1000)
    if (!rl.allowed) {
      const res = NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      applyCorsHeaders(res.headers)
      return res
    }
    const body = await request.json()
    const schema = z.object({ email: z.string().email() })
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      const res = NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
      applyCorsHeaders(res.headers)
      return res
    }
    const { email } = parsed.data

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    await client.connect()
    const db = client.db('devnovate')
    
    // Check if email already exists
    const existingSubscriber = await db.collection('newsletter_subscribers').findOne({ email })
    
    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'Email already subscribed' },
        { status: 200 }
      )
    }

    // Add new subscriber
    await db.collection('newsletter_subscribers').insertOne({
      email,
      subscribedAt: new Date(),
      active: true
    })

    const res = NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    )
    applyCorsHeaders(res.headers)
    return res
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    const res = NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
    applyCorsHeaders(res.headers)
    return res
  }
}
