# Database Scripts for Devnovate Blog Platform

This directory contains scripts to set up and test the MongoDB database for the Devnovate Blog Platform.

## Prerequisites

1. **MongoDB Connection**: Make sure you have a MongoDB connection string in your `.env.local` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

2. **MongoDB Shell**: Install MongoDB Shell (mongosh) if you haven't already:
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/shell)
   - **macOS**: `brew install mongosh`
   - **Linux**: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

## Available Scripts

### 🚀 Quick Setup (Recommended)

Run all database setup scripts in the correct order:
```bash
npm run setup:db
```

### 🔍 Test Database Connection

Test your MongoDB connection and verify basic operations:
```bash
npm run test:db
```

### 📋 Individual Scripts

Run individual database setup scripts:

```bash
# Initialize database collections and schemas
npm run db:init

# Create database indexes for better performance
npm run db:indexes

# Seed sample data (users, blogs, comments)
npm run db:seed

# Set up analytics collection
npm run db:analytics
```

## Script Details

### 1. `01-init-database.js`
- Creates all required collections (`users`, `blogs`, `comments`, `notifications`)
- Sets up validation schemas for data integrity
- Defines collection structure and constraints

### 2. `02-create-indexes.js`
- Creates database indexes for optimal query performance
- Includes compound indexes for common queries
- Sets up unique constraints where needed

### 3. `03-seed-data.js`
- Creates sample admin user
- Adds sample blog posts with different statuses
- Creates sample comments and interactions
- Provides test data for development

### 4. `04-analytics-setup.js`
- Sets up analytics collection for tracking blog performance
- Creates indexes for analytics queries
- Prepares for view, like, and comment tracking

## Troubleshooting

### Common Issues

1. **Connection Error**: 
   - Verify your MongoDB URI in `.env.local`
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure your cluster is running

2. **Authentication Error**:
   - Verify username and password in connection string
   - Check database user permissions

3. **Script Execution Error**:
   - Make sure mongosh is installed and in your PATH
   - Check if the script files exist in the scripts directory

### Getting Help

If you encounter issues:

1. Run the connection test: `npm run test:db`
2. Check the error messages in the console
3. Verify your environment variables
4. Ensure MongoDB Atlas cluster is accessible

## Environment Variables

Make sure these are set in your `.env.local` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key
```

## Next Steps

After running the setup scripts:

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000` to see your blog platform
3. Test user registration and blog creation
4. Check the admin panel for content management

Happy coding! 🎉
