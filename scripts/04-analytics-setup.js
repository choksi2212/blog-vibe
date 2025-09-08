const db = db.getSiblingDB("devnovate_blog")

// Create analytics collection for tracking blog performance
db.createCollection("blog_analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["blogId", "event", "timestamp"],
      properties: {
        blogId: {
          bsonType: "string",
          description: "ID of the blog post",
        },
        event: {
          enum: ["view", "like", "unlike", "comment", "share"],
          description: "Type of analytics event",
        },
        userId: {
          bsonType: "string",
          description: "Firebase UID of the user (optional for anonymous views)",
        },
        metadata: {
          bsonType: "object",
          description: "Additional event metadata",
        },
        timestamp: {
          bsonType: "date",
          description: "Event timestamp",
        },
      },
    },
  },
})

// Create indexes for analytics
db.blog_analytics.createIndex({ blogId: 1 }, { name: "analytics_blog_index" })
db.blog_analytics.createIndex({ event: 1 }, { name: "analytics_event_index" })
db.blog_analytics.createIndex({ timestamp: -1 }, { name: "analytics_timestamp_desc" })
db.blog_analytics.createIndex({ blogId: 1, event: 1 }, { name: "analytics_blog_event_compound" })
db.blog_analytics.createIndex({ userId: 1 }, { name: "analytics_user_index", sparse: true })

// Create user activity collection
db.createCollection("user_activity", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "action", "timestamp"],
      properties: {
        userId: {
          bsonType: "string",
          description: "Firebase UID of the user",
        },
        action: {
          enum: ["login", "logout", "blog_create", "blog_update", "blog_delete", "comment_create", "like", "unlike"],
          description: "Type of user action",
        },
        resourceId: {
          bsonType: "string",
          description: "ID of the resource being acted upon (optional)",
        },
        metadata: {
          bsonType: "object",
          description: "Additional action metadata",
        },
        timestamp: {
          bsonType: "date",
          description: "Action timestamp",
        },
      },
    },
  },
})

// Create indexes for user activity
db.user_activity.createIndex({ userId: 1 }, { name: "activity_user_index" })
db.user_activity.createIndex({ action: 1 }, { name: "activity_action_index" })
db.user_activity.createIndex({ timestamp: -1 }, { name: "activity_timestamp_desc" })
db.user_activity.createIndex({ userId: 1, timestamp: -1 }, { name: "activity_user_timestamp_compound" })

// Create aggregation views for common analytics queries

// Most popular blogs (by views in last 30 days)
db.createView("popular_blogs_30d", "blog_analytics", [
  {
    $match: {
      event: "view",
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  },
  {
    $group: {
      _id: "$blogId",
      viewCount: { $sum: 1 },
      lastViewed: { $max: "$timestamp" },
    },
  },
  {
    $sort: { viewCount: -1 },
  },
  {
    $limit: 50,
  },
])

// User engagement summary
db.createView("user_engagement", "user_activity", [
  {
    $match: {
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  },
  {
    $group: {
      _id: "$userId",
      totalActions: { $sum: 1 },
      lastActivity: { $max: "$timestamp" },
      actions: { $push: "$action" },
    },
  },
  {
    $addFields: {
      uniqueActions: { $size: { $setUnion: ["$actions", []] } },
    },
  },
  {
    $sort: { totalActions: -1 },
  },
])

// Daily blog statistics
db.createView("daily_blog_stats", "blogs", [
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      },
      totalBlogs: { $sum: 1 },
      publishedBlogs: {
        $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
      },
      pendingBlogs: {
        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
      },
    },
  },
  {
    $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 },
  },
])

print("✅ Analytics collections and views created successfully")
print("📊 Analytics setup includes:")
print("   - blog_analytics: Track blog events (views, likes, comments)")
print("   - user_activity: Track user actions")
print("   - popular_blogs_30d: View of most popular blogs")
print("   - user_engagement: View of user engagement metrics")
print("   - daily_blog_stats: View of daily blog statistics")
