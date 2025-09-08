import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export interface DatabaseStats {
  totalUsers: number
  totalBlogs: number
  publishedBlogs: number
  pendingBlogs: number
  totalViews: number
  totalLikes: number
  totalComments: number
}

export async function getDatabaseStats(): Promise<DatabaseStats> {
  const client = await clientPromise
  const db = client.db("devnovate_blog")

  const [totalUsers, totalBlogs, publishedBlogs, pendingBlogs, viewsResult, totalLikes, totalComments] =
    await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("blogs").countDocuments(),
      db.collection("blogs").countDocuments({ status: "published" }),
      db.collection("blogs").countDocuments({ status: "pending" }),
      db
        .collection("blogs")
        .aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }])
        .toArray(),
      db.collection("likes").countDocuments(),
      db.collection("comments").countDocuments(),
    ])

  return {
    totalUsers,
    totalBlogs,
    publishedBlogs,
    pendingBlogs,
    totalViews: viewsResult[0]?.totalViews || 0,
    totalLikes,
    totalComments,
  }
}

export async function getPopularTags(limit = 20): Promise<Array<{ tag: string; count: number }>> {
  const client = await clientPromise
  const db = client.db("devnovate_blog")

  const tags = await db
    .collection("blogs")
    .aggregate([
      { $match: { status: "published" } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { tag: "$_id", count: 1, _id: 0 } },
    ])
    .toArray()

  return tags
}

export async function getTrendingBlogs(days = 7, limit = 10) {
  const client = await clientPromise
  const db = client.db("devnovate_blog")

  const dateThreshold = new Date()
  dateThreshold.setDate(dateThreshold.getDate() - days)

  const trendingBlogs = await db
    .collection("blogs")
    .aggregate([
      {
        $match: {
          status: "published",
          createdAt: { $gte: dateThreshold },
        },
      },
      {
        $addFields: {
          trendingScore: {
            $add: [{ $multiply: ["$likes", 3] }, { $multiply: ["$comments", 2] }, { $multiply: ["$views", 0.1] }],
          },
        },
      },
      { $sort: { trendingScore: -1, createdAt: -1 } },
      { $limit: limit },
    ])
    .toArray()

  return trendingBlogs
}

export async function searchBlogs(
  query: string,
  filters: {
    tags?: string[]
    author?: string
    status?: string
    limit?: number
    skip?: number
  } = {},
) {
  const client = await clientPromise
  const db = client.db("devnovate_blog")

  const searchQuery: any = {}

  // Text search
  if (query.trim()) {
    searchQuery.$text = { $search: query }
  }

  // Status filter (default to published for public searches)
  searchQuery.status = filters.status || "published"

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    searchQuery.tags = { $in: filters.tags }
  }

  // Author filter
  if (filters.author) {
    searchQuery.authorId = filters.author
  }

  const pipeline = [
    { $match: searchQuery },
    ...(query.trim() ? [{ $addFields: { score: { $meta: "textScore" } } }] : []),
    { $sort: query.trim() ? { score: { $meta: "textScore" }, createdAt: -1 } : { createdAt: -1 } },
    { $skip: filters.skip || 0 },
    { $limit: filters.limit || 10 },
  ]

  const results = await db.collection("blogs").aggregate(pipeline).toArray()
  const total = await db.collection("blogs").countDocuments(searchQuery)

  return { results, total }
}

export async function logAnalyticsEvent(
  blogId: string,
  event: "view" | "like" | "unlike" | "comment" | "share",
  userId?: string,
  metadata?: any,
) {
  const client = await clientPromise
  const db = client.db("devnovate_blog")

  await db.collection("blog_analytics").insertOne({
    blogId,
    event,
    userId,
    metadata,
    timestamp: new Date(),
  })
}

export async function logUserActivity(
  userId: string,
  action: "login" | "logout" | "blog_create" | "blog_update" | "blog_delete" | "comment_create" | "like" | "unlike",
  resourceId?: string,
  metadata?: any,
) {
  const client = await clientPromise
  const db = client.db("devnovate_blog")

  await db.collection("user_activity").insertOne({
    userId,
    action,
    resourceId,
    metadata,
    timestamp: new Date(),
  })
}

export async function cleanupOldAnalytics(daysToKeep = 90) {
  const client = await clientPromise
  const db = client.db("devnovate_blog")

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

  const result = await db.collection("blog_analytics").deleteMany({
    timestamp: { $lt: cutoffDate },
  })

  return result.deletedCount
}

export async function getBlogWithComments(blogId: string) {
  const client = await clientPromise
  const db = client.db("devnovate_blog")

  const blog = await db.collection("blogs").findOne({ _id: new ObjectId(blogId) })
  if (!blog) return null

  const comments = await db.collection("comments").find({ blogId }).sort({ createdAt: -1 }).toArray()

  return { ...blog, comments }
}
