import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const algorithm = searchParams.get("algorithm") || "engagement"
    const period = searchParams.get("period") || "week"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const client = await clientPromise
    const db = client.db("devnovate_blog")

    let dateThreshold = new Date()
    switch (period) {
      case "day":
        dateThreshold.setDate(dateThreshold.getDate() - 1)
        break
      case "week":
        dateThreshold.setDate(dateThreshold.getDate() - 7)
        break
      case "month":
        dateThreshold.setMonth(dateThreshold.getMonth() - 1)
        break
      case "all":
        dateThreshold = new Date(0) // Beginning of time
        break
    }

    const pipeline: any[] = [
      {
        $match: {
          status: "published",
          createdAt: { $gte: dateThreshold },
        },
      },
    ]

    switch (algorithm) {
      case "engagement":
        pipeline.push({
          $addFields: {
            engagementScore: {
              $add: [
                { $multiply: ["$likes", 5] }, // Likes worth 5 points
                { $multiply: ["$comments", 10] }, // Comments worth 10 points
                { $multiply: ["$views", 0.1] }, // Views worth 0.1 points
              ],
            },
          },
        })
        pipeline.push({ $sort: { engagementScore: -1, createdAt: -1 } })
        break

      case "velocity":
        // Trending based on recent activity velocity
        pipeline.push({
          $addFields: {
            hoursOld: {
              $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60],
            },
          },
        })
        pipeline.push({
          $addFields: {
            velocityScore: {
              $cond: {
                if: { $gt: ["$hoursOld", 0] },
                then: {
                  $divide: [
                    { $add: [{ $multiply: ["$likes", 3] }, { $multiply: ["$comments", 5] }, "$views"] },
                    { $add: ["$hoursOld", 1] },
                  ],
                },
                else: 0,
              },
            },
          },
        })
        pipeline.push({ $sort: { velocityScore: -1, createdAt: -1 } })
        break

      case "recent":
        pipeline.push({
          $addFields: {
            recentScore: {
              $add: [
                { $multiply: ["$likes", 2] },
                { $multiply: ["$comments", 3] },
                { $multiply: ["$views", 0.05] },
                // Boost for recency
                {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: [new Date(), "$createdAt"] },
                        1000 * 60 * 60 * 24, // Convert to days
                      ],
                    },
                    -1, // Negative to boost recent posts
                  ],
                },
              ],
            },
          },
        })
        pipeline.push({ $sort: { recentScore: -1, createdAt: -1 } })
        break

      default:
        // Default to simple popularity
        pipeline.push({ $sort: { likes: -1, views: -1, createdAt: -1 } })
    }

    pipeline.push({ $limit: limit })

    const trendingBlogs = await db.collection("blogs").aggregate(pipeline).toArray()

    // Get author details for each blog
    const blogsWithAuthors = await Promise.all(
      trendingBlogs.map(async (blog) => {
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
      algorithm,
      period,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Trending blogs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
