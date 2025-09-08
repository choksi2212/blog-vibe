// This script sets up the initial database structure for Devnovate Blog Platform

// Connect to the database
const db = db.getSiblingDB("devnovate_blog")

// Create collections with validation schemas
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["uid", "email", "role", "createdAt"],
      properties: {
        uid: {
          bsonType: "string",
          description: "Firebase UID - must be a string and is required",
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
          description: "Valid email address - must be a string and is required",
        },
        role: {
          enum: ["user", "admin"],
          description: "User role - must be either user or admin",
        },
        profile: {
          bsonType: "object",
          properties: {
            displayName: {
              bsonType: "string",
              description: "Display name for the user",
            },
            bio: {
              bsonType: "string",
              description: "User biography",
            },
            avatar: {
              bsonType: "string",
              description: "Avatar URL",
            },
          },
        },
        createdAt: {
          bsonType: "date",
          description: "Account creation timestamp",
        },
      },
    },
  },
})

db.createCollection("blogs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "content", "authorId", "status", "createdAt"],
      properties: {
        title: {
          bsonType: "string",
          minLength: 1,
          maxLength: 200,
          description: "Blog title - must be a string between 1-200 characters",
        },
        content: {
          bsonType: "string",
          minLength: 1,
          description: "Blog content - must be a non-empty string",
        },
        excerpt: {
          bsonType: "string",
          maxLength: 500,
          description: "Blog excerpt - optional, max 500 characters",
        },
        tags: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          description: "Array of tags",
        },
        authorId: {
          bsonType: "string",
          description: "Firebase UID of the author",
        },
        status: {
          enum: ["draft", "pending", "published", "rejected", "hidden"],
          description: "Blog status",
        },
        views: {
          bsonType: "int",
          minimum: 0,
          description: "Number of views",
        },
        likes: {
          bsonType: "int",
          minimum: 0,
          description: "Number of likes",
        },
        comments: {
          bsonType: "int",
          minimum: 0,
          description: "Number of comments",
        },
        createdAt: {
          bsonType: "date",
          description: "Creation timestamp",
        },
        updatedAt: {
          bsonType: "date",
          description: "Last update timestamp",
        },
        rejectionReason: {
          bsonType: "string",
          description: "Reason for rejection if status is rejected",
        },
      },
    },
  },
})

db.createCollection("comments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["content", "authorId", "blogId", "createdAt"],
      properties: {
        content: {
          bsonType: "string",
          minLength: 1,
          maxLength: 1000,
          description: "Comment content - must be 1-1000 characters",
        },
        authorId: {
          bsonType: "string",
          description: "Firebase UID of the commenter",
        },
        blogId: {
          bsonType: "string",
          description: "ID of the blog post",
        },
        author: {
          bsonType: "object",
          properties: {
            displayName: {
              bsonType: "string",
            },
            email: {
              bsonType: "string",
            },
          },
        },
        createdAt: {
          bsonType: "date",
          description: "Comment creation timestamp",
        },
      },
    },
  },
})

db.createCollection("likes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["blogId", "userId", "createdAt"],
      properties: {
        blogId: {
          bsonType: "string",
          description: "ID of the liked blog post",
        },
        userId: {
          bsonType: "string",
          description: "Firebase UID of the user who liked",
        },
        createdAt: {
          bsonType: "date",
          description: "Like timestamp",
        },
      },
    },
  },
})

print("✅ Collections created successfully with validation schemas")
