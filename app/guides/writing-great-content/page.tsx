"use client"

import { GSAPFadeIn } from "@/components/ui/gsap-animations"

export default function WritingGreatContentPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <GSAPFadeIn delay={0.1}>
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-black mb-6">
              Writing Great Content
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to create technical content that engages readers and builds your reputation in the developer community.
            </p>
          </div>
        </GSAPFadeIn>

        <div className="prose prose-lg max-w-none">
          <GSAPFadeIn delay={0.2}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Getting Started</h2>
              <p className="text-gray-700 mb-6">
                Great technical content starts with understanding your audience and delivering value. Whether you're writing tutorials, 
                explaining complex concepts, or sharing your experiences, the key is to make your content accessible and actionable.
              </p>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.3}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Content Structure</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">1. Clear Introduction</h3>
                  <p className="text-gray-700 mb-4">
                    Start with a compelling hook that explains what readers will learn and why it matters to them.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">2. Logical Flow</h3>
                  <p className="text-gray-700 mb-4">
                    Organize your content in a logical sequence that builds understanding step by step.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">3. Code Examples</h3>
                  <p className="text-gray-700 mb-4">
                    Include practical, working code examples that readers can immediately use and modify.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">4. Clear Conclusion</h3>
                  <p className="text-gray-700 mb-4">
                    Summarize key takeaways and provide next steps for readers to continue learning.
                  </p>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.4}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Writing Best Practices</h2>
              <div className="bg-gray-50 p-8 rounded-lg">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-black font-semibold mr-3">•</span>
                    <span className="text-gray-700">Use clear, concise language and avoid unnecessary jargon</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-black font-semibold mr-3">•</span>
                    <span className="text-gray-700">Break up long paragraphs with headings, lists, and white space</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-black font-semibold mr-3">•</span>
                    <span className="text-gray-700">Include relevant images, diagrams, or screenshots to illustrate concepts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-black font-semibold mr-3">•</span>
                    <span className="text-gray-700">Test all code examples before publishing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-black font-semibold mr-3">•</span>
                    <span className="text-gray-700">Use proper formatting for code blocks and inline code</span>
                  </li>
                </ul>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.5}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Engaging Your Audience</h2>
              <p className="text-gray-700 mb-6">
                Great content doesn't just inform—it engages and inspires action. Here are some strategies to make your content more engaging:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">Tell Stories</h3>
                  <p className="text-gray-600">Share real experiences and challenges you've faced</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">Ask Questions</h3>
                  <p className="text-gray-600">Encourage discussion and interaction in comments</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">Provide Value</h3>
                  <p className="text-gray-600">Focus on solving real problems your audience faces</p>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.6}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Building Your Reputation</h2>
              <p className="text-gray-700 mb-6">
                Consistent, high-quality content helps establish you as a thought leader in your field. Here's how to build your reputation:
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Be Consistent</h3>
                    <p className="text-gray-700">Publish regularly to maintain visibility and build anticipation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Share Your Process</h3>
                    <p className="text-gray-700">Document your learning journey and problem-solving approach</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Engage with Comments</h3>
                    <p className="text-gray-700">Respond thoughtfully to questions and feedback</p>
                  </div>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.7}>
            <section className="text-center">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-black mb-4">Ready to Start Writing?</h2>
                <p className="text-gray-600 mb-6">
                  Now that you know the fundamentals, it's time to create your first piece of great content!
                </p>
                <a 
                  href="/dashboard" 
                  className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Start Writing
                </a>
              </div>
            </section>
          </GSAPFadeIn>
        </div>
      </div>
    </div>
  )
}
