"use client"

const db = db.getSiblingDB("devnovate_blog")

// Create admin user
const adminUser = {
  uid: "admin-uid-12345",
  email: "admin@devnovate.com",
  role: "admin",
  profile: {
    displayName: "Admin User",
    bio: "Platform administrator and content moderator",
    avatar: "",
  },
  createdAt: new Date(),
}

db.users.insertOne(adminUser)

// Create sample users
const sampleUsers = [
  {
    uid: "user-uid-001",
    email: "john.doe@example.com",
    role: "user",
    profile: {
      displayName: "John Doe",
      bio: "Full-stack developer passionate about React and Node.js",
      avatar: "",
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    uid: "user-uid-002",
    email: "jane.smith@example.com",
    role: "user",
    profile: {
      displayName: "Jane Smith",
      bio: "Frontend developer and UI/UX enthusiast",
      avatar: "",
    },
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
  },
  {
    uid: "user-uid-003",
    email: "mike.wilson@example.com",
    role: "user",
    profile: {
      displayName: "Mike Wilson",
      bio: "DevOps engineer and cloud architecture specialist",
      avatar: "",
    },
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
  },
]

db.users.insertMany(sampleUsers)

// Create sample blog posts
const sampleBlogs = [
  {
    title: "Getting Started with React Hooks",
    content: `# Getting Started with React Hooks

React Hooks revolutionized the way we write React components by allowing us to use state and other React features in functional components.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They don't work inside classes — they let you use React without classes.

## Basic Hooks

### useState

The \`useState\` hook lets you add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### useEffect

The \`useEffect\` hook lets you perform side effects in function components:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Conclusion

React Hooks provide a more direct API to the React concepts you already know. They offer a powerful and flexible way to reuse stateful logic between components.`,
    excerpt: "Learn the fundamentals of React Hooks and how they can simplify your React components.",
    tags: ["react", "javascript", "hooks", "frontend"],
    authorId: "user-uid-001",
    status: "published",
    views: 245,
    likes: 18,
    comments: 5,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Building Responsive Layouts with CSS Grid",
    content: `# Building Responsive Layouts with CSS Grid

CSS Grid is a powerful layout system that allows you to create complex, responsive layouts with ease.

## Introduction to CSS Grid

CSS Grid Layout is a two-dimensional layout method for the web. It lets you lay content out in rows and columns, and has many features that make building complex layouts straightforward.

## Basic Grid Setup

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

## Responsive Design

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
}
\`\`\`

This creates a responsive grid that automatically adjusts the number of columns based on available space.

## Advanced Features

CSS Grid offers many advanced features like grid areas, subgrid, and more that make it incredibly powerful for modern web layouts.`,
    excerpt: "Master CSS Grid to create beautiful, responsive layouts for modern web applications.",
    tags: ["css", "grid", "responsive", "frontend", "layout"],
    authorId: "user-uid-002",
    status: "published",
    views: 189,
    likes: 23,
    comments: 3,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Docker Best Practices for Node.js Applications",
    content: `# Docker Best Practices for Node.js Applications

Containerizing Node.js applications with Docker can greatly improve deployment consistency and scalability.

## Multi-stage Builds

Use multi-stage builds to reduce image size:

\`\`\`dockerfile
# Build stage
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Security Considerations

- Use non-root user
- Keep base images updated
- Scan for vulnerabilities
- Use .dockerignore

## Performance Tips

- Leverage Docker layer caching
- Minimize image layers
- Use Alpine Linux for smaller images`,
    excerpt: "Learn Docker best practices specifically tailored for Node.js applications.",
    tags: ["docker", "nodejs", "devops", "containers"],
    authorId: "user-uid-003",
    status: "published",
    views: 156,
    likes: 14,
    comments: 2,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Understanding TypeScript Generics",
    content: `# Understanding TypeScript Generics

TypeScript generics provide a way to create reusable components that can work with multiple types.

## What are Generics?

Generics allow you to create components that can work with any type, not just one specific type.

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
let output2 = identity<number>(100);
\`\`\`

## Generic Interfaces

\`\`\`typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
\`\`\`

## Constraints

You can constrain generics to certain types:

\`\`\`typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
\`\`\``,
    excerpt: "Deep dive into TypeScript generics and learn how to write more flexible, reusable code.",
    tags: ["typescript", "generics", "programming", "javascript"],
    authorId: "user-uid-001",
    status: "pending",
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Advanced Git Workflows for Teams",
    content: `# Advanced Git Workflows for Teams

Effective Git workflows are crucial for team collaboration and code quality.

## Git Flow

Git Flow is a branching model that defines specific branch types:

- **master**: Production-ready code
- **develop**: Integration branch for features
- **feature**: New features
- **release**: Prepare for production release
- **hotfix**: Quick fixes for production

## GitHub Flow

A simpler alternative to Git Flow:

1. Create a branch
2. Add commits
3. Open a pull request
4. Discuss and review
5. Deploy and test
6. Merge

## Best Practices

- Write meaningful commit messages
- Keep commits atomic
- Use interactive rebase to clean history
- Protect important branches
- Use pull request templates`,
    excerpt: "Master advanced Git workflows to improve team collaboration and code quality.",
    tags: ["git", "workflow", "collaboration", "devops"],
    authorId: "user-uid-002",
    status: "draft",
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
]

db.blogs.insertMany(sampleBlogs)

// Create sample comments
const sampleComments = [
  {
    content: "Great explanation of React Hooks! This really helped me understand the concept better.",
    author: {
      displayName: "Jane Smith",
      email: "jane.smith@example.com",
    },
    authorId: "user-uid-002",
    blogId: db.blogs.findOne({ title: "Getting Started with React Hooks" })._id.toString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    content: "Thanks for sharing! Do you have any recommendations for advanced React patterns?",
    author: {
      displayName: "Mike Wilson",
      email: "mike.wilson@example.com",
    },
    authorId: "user-uid-003",
    blogId: db.blogs.findOne({ title: "Getting Started with React Hooks" })._id.toString(),
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
  {
    content: "CSS Grid is amazing! I've been using Flexbox for everything, but this opens up so many possibilities.",
    author: {
      displayName: "John Doe",
      email: "john.doe@example.com",
    },
    authorId: "user-uid-001",
    blogId: db.blogs.findOne({ title: "Building Responsive Layouts with CSS Grid" })._id.toString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
]

db.comments.insertMany(sampleComments)

// Create sample likes
const sampleLikes = [
  {
    blogId: db.blogs.findOne({ title: "Getting Started with React Hooks" })._id.toString(),
    userId: "user-uid-002",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    blogId: db.blogs.findOne({ title: "Getting Started with React Hooks" })._id.toString(),
    userId: "user-uid-003",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
  {
    blogId: db.blogs.findOne({ title: "Building Responsive Layouts with CSS Grid" })._id.toString(),
    userId: "user-uid-001",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    blogId: db.blogs.findOne({ title: "Building Responsive Layouts with CSS Grid" })._id.toString(),
    userId: "user-uid-003",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
]

db.likes.insertMany(sampleLikes)

// Additional mock blogs to enrich catalog
const extraBlogs = Array.from({ length: 12 }).map((_, i) => ({
  title: `Developer Story ${i + 1}: Lessons Learned`,
  excerpt: `Insights and takeaways from project ${i + 1}.`,
  content: `# Project ${i + 1} Retrospective\n\n**Highlights** and pitfalls.\n\n- What went well\n- What can be improved\n\n## Key Takeaways\nIterate quickly and keep quality high.`,
  tags: ["retrospective", "engineering", i % 2 ? "web" : "backend"],
  authorId: i % 3 === 0 ? "user-uid-001" : i % 3 === 1 ? "user-uid-002" : "user-uid-003",
  status: "published",
  views: Math.floor(Math.random() * 1500),
  likes: Math.floor(Math.random() * 200),
  comments: 0,
  createdAt: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000),
}))

db.blogs.insertMany(extraBlogs)

print("✅ Sample data inserted successfully")
print("📊 Data summary:")
print("   - Users: 4 (1 admin, 3 regular users)")
print("   - Blogs: 5 (3 published, 1 pending, 1 draft)")
print("   - Comments: 3")
print("   - Likes: 4")
print("")
print("🎉 Database setup complete! You can now test the application with sample data.")
