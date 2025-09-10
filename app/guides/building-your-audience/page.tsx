"use client"

import { GSAPFadeIn } from "@/components/ui/gsap-animations"

export default function BuildingYourAudiencePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <GSAPFadeIn delay={0.1}>
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-black mb-6">
              Building Your Audience
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strategies for growing your following and engaging with the developer community on Devnovate.
            </p>
          </div>
        </GSAPFadeIn>

        <div className="prose prose-lg max-w-none">
          <GSAPFadeIn delay={0.2}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Why Audience Matters</h2>
              <p className="text-gray-700 mb-6">
                Building an engaged audience isn't just about numbers—it's about creating a community of developers who value your insights, 
                learn from your experiences, and contribute to meaningful discussions. A strong audience amplifies your impact and opens doors to new opportunities.
              </p>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.3}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Content Strategy</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">1. Find Your Niche</h3>
                  <p className="text-gray-700 mb-4">
                    Focus on specific technologies, frameworks, or development practices where you have expertise and passion.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">2. Create Value-First Content</h3>
                  <p className="text-gray-700 mb-4">
                    Every piece should solve a problem, teach something new, or provide unique insights your audience can't find elsewhere.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">3. Be Consistent</h3>
                  <p className="text-gray-700 mb-4">
                    Establish a regular publishing schedule that your audience can rely on and anticipate.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">4. Mix Content Types</h3>
                  <p className="text-gray-700 mb-4">
                    Combine tutorials, opinion pieces, project showcases, and behind-the-scenes content to keep your feed interesting.
                  </p>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.4}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Engagement Strategies</h2>
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-4">Start Conversations</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Ask thought-provoking questions in your posts</li>
                      <li>• Share controversial but respectful opinions</li>
                      <li>• Create polls and surveys about developer topics</li>
                      <li>• Share your learning process and ask for advice</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-4">Respond Actively</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Reply to every comment thoughtfully</li>
                      <li>• Thank people for sharing and engaging</li>
                      <li>• Ask follow-up questions to deepen discussions</li>
                      <li>• Share others' content that adds value</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.5}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Community Building</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mr-6 mt-1">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-3">Be Authentic</h3>
                    <p className="text-gray-700">
                      Share your real experiences, failures, and successes. People connect with genuine stories and honest perspectives.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mr-6 mt-1">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-3">Support Others</h3>
                    <p className="text-gray-700">
                      Actively engage with other developers' content. Like, comment, and share posts that resonate with you.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mr-6 mt-1">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-3">Create Series</h3>
                    <p className="text-gray-700">
                      Develop multi-part content series that keep readers coming back for more. This builds anticipation and loyalty.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mr-6 mt-1">
                    <span className="text-lg font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-3">Host Discussions</h3>
                    <p className="text-gray-700">
                      Create posts that invite debate and discussion. Ask for opinions on industry trends or best practices.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.6}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Growth Metrics to Track</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">Engagement Rate</h3>
                  <p className="text-gray-600">Comments, likes, and shares relative to your follower count</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">Content Performance</h3>
                  <p className="text-gray-600">Which types of posts get the most engagement</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">Community Growth</h3>
                  <p className="text-gray-600">New followers and returning readers over time</p>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.7}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Common Mistakes to Avoid</h2>
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">✗</span>
                    <span className="text-gray-700">Focusing only on follower count instead of engagement quality</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">✗</span>
                    <span className="text-gray-700">Posting inconsistently or disappearing for long periods</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">✗</span>
                    <span className="text-gray-700">Not responding to comments or engaging with your audience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">✗</span>
                    <span className="text-gray-700">Copying others' content instead of developing your unique voice</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">✗</span>
                    <span className="text-gray-700">Being overly promotional without providing value first</span>
                  </li>
                </ul>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.8}>
            <section className="text-center">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-black mb-4">Ready to Build Your Audience?</h2>
                <p className="text-gray-600 mb-6">
                  Start implementing these strategies today and watch your developer community grow!
                </p>
                <a 
                  href="/dashboard" 
                  className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Start Building
                </a>
              </div>
            </section>
          </GSAPFadeIn>
        </div>
      </div>
    </div>
  )
}
