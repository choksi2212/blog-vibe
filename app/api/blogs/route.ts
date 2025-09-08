import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { searchBlogs } from "@/lib/database-utils"
import { auth } from "@/lib/firebase-admin" // Declare the auth variable

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const search = searchParams.get("search")
    const tag = searchParams.get("tag")
    const author = searchParams.get("author")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    // If search query is provided, use the search function
    if (search) {
      const skip = (page - 1) * limit
      const searchResults = await searchBlogs(search, {
        tags: tag ? [tag] : undefined,
        author,
        status: status || "published",
        limit,
        skip,
      })

      // Get author details for each blog
      const blogsWithAuthors = await Promise.all(
        searchResults.results.map(async (blog) => {
          const author = await db.collection("users").findOne({ uid: blog.authorId })
          return {
            ...blog,
            author: {
              displayName: author?.profile?.displayName || "Anonymous",
              email: author?.email || "",
            },
          }
        }),
      )

      return NextResponse.json({
        blogs: blogsWithAuthors,
        pagination: {
          page,
          limit,
          total: searchResults.total,
          pages: Math.ceil(searchResults.total / limit),
        },
      })
    }

    // Regular query without search
    const query: any = {}
    if (status) {
      query.status = status
    } else {
      query.status = "published" // Only show published blogs by default
    }

    if (tag) {
      query.tags = { $in: [tag] }
    }

    if (author) {
      query.authorId = author
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {}
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom)
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo)
      }
    }

    const skip = (page - 1) * limit

    // Build sort object
    const sortObj: any = {}
    if (sortBy === "popularity") {
      sortObj.likes = sortOrder === "desc" ? -1 : 1
      sortObj.views = sortOrder === "desc" ? -1 : 1
    } else if (sortBy === "views") {
      sortObj.views = sortOrder === "desc" ? -1 : 1
    } else if (sortBy === "likes") {
      sortObj.likes = sortOrder === "desc" ? -1 : 1
    } else {
      sortObj[sortBy] = sortOrder === "desc" ? -1 : 1
    }

    const blogs = await db
      .collection("blogs")
      .find(query, { projection: { content: 0 } })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get author details for each blog
    const blogsWithAuthors = await Promise.all(
      blogs.map(async (blog) => {
        const author = await db.collection("users").findOne({ uid: blog.authorId })
        return {
          ...blog,
          author: {
            displayName: author?.profile?.displayName || "Anonymous",
            email: author?.email || "",
          },
        }
      }),
    )

    const total = await db.collection("blogs").countDocuments(query)

    return NextResponse.json({
      blogs: blogsWithAuthors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Blogs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await auth.verifyIdToken(token) // Use the declared auth variable

    const { title, content, excerpt, tags, status } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    const newBlog = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + "...",
      tags: tags || [],
      authorId: decodedToken.uid,
      status: status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      comments: 0,
    }

    const result = await db.collection("blogs").insertOne(newBlog)

    return NextResponse.json({
      message: "Blog created successfully",
      blogId: result.insertedId,
    })
  } catch (error) {
    console.error("Blog creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
