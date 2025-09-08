const db = db.getSiblingDB("devnovate_blog")

// Users collection indexes
db.users.createIndex({ uid: 1 }, { unique: true, name: "uid_unique" })
db.users.createIndex({ email: 1 }, { unique: true, name: "email_unique" })
db.users.createIndex({ role: 1 }, { name: "role_index" })
db.users.createIndex({ createdAt: -1 }, { name: "users_created_desc" })

// Blogs collection indexes
db.blogs.createIndex({ authorId: 1 }, { name: "author_index" })
db.blogs.createIndex({ status: 1 }, { name: "status_index" })
db.blogs.createIndex({ createdAt: -1 }, { name: "blogs_created_desc" })
db.blogs.createIndex({ updatedAt: -1 }, { name: "blogs_updated_desc" })
db.blogs.createIndex({ tags: 1 }, { name: "tags_index" })
db.blogs.createIndex({ views: -1 }, { name: "views_desc" })
db.blogs.createIndex({ likes: -1 }, { name: "likes_desc" })

// Compound indexes for common queries
db.blogs.createIndex({ status: 1, createdAt: -1 }, { name: "status_created_compound" })
db.blogs.createIndex({ status: 1, likes: -1 }, { name: "status_likes_compound" })
db.blogs.createIndex({ status: 1, views: -1 }, { name: "status_views_compound" })
db.blogs.createIndex({ authorId: 1, status: 1 }, { name: "author_status_compound" })

// Text index for search functionality
db.blogs.createIndex(
  {
    title: "text",
    content: "text",
    excerpt: "text",
    tags: "text",
  },
  {
    name: "blog_text_search",
    weights: {
      title: 10,
      tags: 5,
      excerpt: 3,
      content: 1,
    },
  },
)

// Comments collection indexes
db.comments.createIndex({ blogId: 1 }, { name: "blog_comments_index" })
db.comments.createIndex({ authorId: 1 }, { name: "comment_author_index" })
db.comments.createIndex({ createdAt: -1 }, { name: "comments_created_desc" })
db.comments.createIndex({ blogId: 1, createdAt: -1 }, { name: "blog_comments_created_compound" })

// Likes collection indexes
db.likes.createIndex({ blogId: 1 }, { name: "blog_likes_index" })
db.likes.createIndex({ userId: 1 }, { name: "user_likes_index" })
db.likes.createIndex({ blogId: 1, userId: 1 }, { unique: true, name: "blog_user_like_unique" })
db.likes.createIndex({ createdAt: -1 }, { name: "likes_created_desc" })

print("✅ Database indexes created successfully")
print("📊 Index summary:")
print("   - Users: 4 indexes (uid, email, role, createdAt)")
print("   - Blogs: 9 indexes (including text search and compound indexes)")
print("   - Comments: 4 indexes (blogId, authorId, createdAt, compound)")
print("   - Likes: 4 indexes (blogId, userId, unique compound, createdAt)")
