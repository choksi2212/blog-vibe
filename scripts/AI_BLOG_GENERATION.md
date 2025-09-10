# AI Blog Generation with OpenRouter API

This directory contains powerful scripts to generate realistic, high-quality blog posts using OpenRouter API with DeepSeek model.

## 🚀 Quick Start

### 1. Setup Environment
Add your OpenRouter API key to `.env.local`:
\`\`\`bash
# Get your API key from: https://openrouter.ai/keys
OPENROUTER_API_KEY=your_openrouter_api_key_here
\`\`\`

### 2. Complete Setup with AI Blogs
\`\`\`bash
node scripts/setup-with-ai-blogs.js
\`\`\`
This runs database setup AND generates 8 high-quality AI blogs automatically.

## 📝 Individual Scripts

### Generate Custom Blogs
\`\`\`bash
# Use presets for common topics
node scripts/08-generate-custom-blogs.js react
node scripts/08-generate-custom-blogs.js nodejs
node scripts/08-generate-custom-blogs.js devops
node scripts/08-generate-custom-blogs.js ai

# Or create custom topics
node scripts/08-generate-custom-blogs.js custom "GraphQL Best Practices" "API Development"
node scripts/08-generate-custom-blogs.js custom "Vue.js 3 Composition API" "Frontend Development"
\`\`\`

### Batch Generation
\`\`\`bash
# Generate 5 blogs (default)
node scripts/09-batch-generate-blogs.js

# Generate specific number (1-20)
node scripts/09-batch-generate-blogs.js 10
\`\`\`

### Comprehensive Generation
\`\`\`bash
# Generate wide variety of topics (20+ blogs)
node scripts/07-generate-ai-blogs.js
\`\`\`

## 🎯 Available Presets

| Preset | Topic | Category |
|--------|-------|----------|
| `react` | Advanced React Patterns for Large Applications | Web Development |
| `nodejs` | Building Scalable REST APIs with Node.js | Backend Development |
| `typescript` | TypeScript Advanced Types and Generic Programming | Programming Languages |
| `devops` | Docker and Kubernetes Deployment Strategies | DevOps |
| `ai` | Integrating AI APIs into Modern Web Applications | AI & Machine Learning |

## 📊 What Gets Generated

Each AI blog includes:
- **Professional title** - SEO-optimized and engaging
- **Compelling excerpt** - 2-3 sentence summary that hooks readers
- **Comprehensive content** - 1500-2500 words with practical examples
- **Code examples** - Working code snippets with explanations
- **Relevant tags** - Automatically categorized tags
- **Realistic metadata** - Views, likes, comments for authenticity

## 🏗️ Content Quality

The AI generates blogs that include:
- ✅ Real-world examples and use cases
- ✅ Step-by-step tutorials
- ✅ Code snippets in multiple languages
- ✅ Best practices and tips
- ✅ Performance considerations
- ✅ Common pitfalls and solutions
- ✅ Professional developer perspective

## 🔧 Customization

### Modify Blog Topics
Edit the `batchTopics` array in `09-batch-generate-blogs.js`:
\`\`\`javascript
{
  topic: "Your Custom Topic Here",
  category: "Your Category",
  length: "medium", // short, medium, long
  includeCode: true
}
\`\`\`

### Add Author Profiles
Update the `authorProfiles` array:
\`\`\`javascript
{
  displayName: "Your Name",
  email: "your.email@domain.com"
}
\`\`\`

### Adjust Content Length
- `short`: 800-1200 words
- `medium`: 1500-2000 words  
- `long`: 2500-3500 words

## 🚦 Rate Limits & Best Practices

- **Delay between requests**: 3 seconds (configurable)
- **Recommended batch size**: 5-10 blogs at a time
- **Daily limits**: Depends on your Gemini API quota
- **Quality over quantity**: Focus on fewer, high-quality posts

## 🛠️ Troubleshooting

### API Key Issues
\`\`\`bash
❌ GEMINI_API_KEY not found in environment variables
\`\`\`
**Solution**: Add your API key to `.env.local`

### Model Not Found Error
\`\`\`bash
❌ Error: models/gemini-pro is not found for API version v1beta
\`\`\`
**Solution**: The scripts now use `gemini-1.5-flash` (updated automatically)

### Rate Limiting
\`\`\`bash
❌ Error generating blog: 429 Too Many Requests
\`\`\`
**Solution**: Increase delay between requests or reduce batch size

### JSON Parsing Errors
\`\`\`bash
❌ Failed to parse AI response as JSON
\`\`\`
**Solution**: The AI sometimes returns malformed JSON. Script will retry automatically.

### Database Connection
\`\`\`bash
❌ Database error: MongoServerError
\`\`\`
**Solution**: Check your `MONGODB_URI` in `.env.local`

## 📈 Performance Tips

1. **Start small** - Generate 3-5 blogs first to test
2. **Monitor API usage** - Check your Gemini API quota
3. **Run during off-peak** - Better response times
4. **Review generated content** - Quality check before publishing
5. **Customize prompts** - Modify prompts for your specific needs

## 🎨 Example Generated Blog Structure

\`\`\`markdown
# Advanced React Patterns for Large Applications

React has evolved significantly, and with it, the patterns we use to build scalable applications...

## Introduction
When building large-scale React applications, certain patterns emerge that help maintain code quality...

## 1. Compound Components Pattern
\`\`\`jsx
// Example code with detailed explanations
const Accordion = ({ children }) => {
  // Implementation details...
}
\`\`\`

## 2. Render Props Pattern
... detailed explanation with examples ...

## Best Practices
- Use TypeScript for better type safety
- Implement proper error boundaries
- Optimize bundle size with code splitting

## Conclusion
These patterns help create maintainable, scalable React applications...
\`\`\`

## 🌟 Getting the Best Results

1. **Use specific topics** - "React Hooks Best Practices" vs "React Tips"
2. **Include context** - Add category and target audience info  
3. **Review and edit** - AI content is great but may need minor tweaks
4. **Maintain consistency** - Use similar author profiles for brand voice
5. **Regular generation** - Create fresh content consistently

Happy blogging with AI! 🤖✨
