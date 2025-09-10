"use client"

import { GSAPFadeIn } from "@/components/ui/gsap-animations"

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <GSAPFadeIn delay={0.1}>
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-black mb-6">
              Community Guidelines
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Best practices for engaging respectfully with other developers on the platform and building a positive community.
            </p>
          </div>
        </GSAPFadeIn>

        <div className="prose prose-lg max-w-none">
          <GSAPFadeIn delay={0.2}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Our Community Values</h2>
              <p className="text-gray-700 mb-6">
                Devnovate is built on the foundation of mutual respect, continuous learning, and collaborative growth. 
                We believe that the best developer communities are inclusive, supportive, and focused on helping each other succeed. 
                These guidelines help us maintain that environment for everyone.
              </p>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.3}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Be Respectful and Inclusive</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">Treat Everyone with Respect</h3>
                  <p className="text-gray-700 mb-4">
                    Every developer, regardless of experience level, background, or technology preference, deserves respect. 
                    We all started somewhere, and we all have something to learn.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">Embrace Diversity</h3>
                  <p className="text-gray-700 mb-4">
                    Our community is stronger because of our differences. Welcome diverse perspectives, experiences, 
                    and approaches to problem-solving.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">Use Inclusive Language</h3>
                  <p className="text-gray-700 mb-4">
                    Choose words that include rather than exclude. Avoid assumptions about gender, race, 
                    nationality, or other personal characteristics.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">Be Patient with Beginners</h3>
                  <p className="text-gray-700 mb-4">
                    Remember that everyone was a beginner once. Offer helpful guidance and encouragement 
                    rather than criticism or condescension.
                  </p>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.4}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Content Standards</h2>
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-black mb-6">What We Encourage</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-black mb-3">High-Quality Content</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Well-researched and accurate information</li>
                      <li>• Clear explanations and examples</li>
                      <li>• Original insights and experiences</li>
                      <li>• Helpful tutorials and guides</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-3">Constructive Discussions</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Thoughtful questions and answers</li>
                      <li>• Respectful debate and disagreement</li>
                      <li>• Sharing knowledge and resources</li>
                      <li>• Celebrating others' achievements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.5}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Communication Best Practices</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mr-6 mt-1">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-3">Be Clear and Specific</h3>
                    <p className="text-gray-700 mb-3">
                      When asking questions or providing answers, be as specific as possible. Include relevant details, 
                      error messages, code snippets, and context to help others understand and assist you.
                    </p>
                    <div className="bg-green-50 border border-green-200 p-4 rounded">
                      <p className="text-sm text-green-800">
                        <strong>Good:</strong> "I'm getting a 'TypeError: Cannot read property of undefined' error in my React component when trying to access this.state.data. Here's my component code..."
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mr-6 mt-1">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-3">Search Before Asking</h3>
                    <p className="text-gray-700 mb-3">
                      Before posting a question, search the platform to see if it's been asked and answered before. 
                      If you find a similar question, add your specific context as a comment rather than creating a duplicate post.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mr-6 mt-1">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-3">Give Credit Where Due</h3>
                    <p className="text-gray-700 mb-3">
                      If you're sharing code, ideas, or solutions that aren't entirely your own, give proper credit. 
                      Link to original sources, mention contributors, and acknowledge inspiration.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mr-6 mt-1">
                    <span className="text-lg font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-3">Stay on Topic</h3>
                    <p className="text-gray-700 mb-3">
                      Keep discussions relevant to development, technology, and professional growth. 
                      Off-topic conversations can be moved to appropriate channels or removed.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.6}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">What We Don't Allow</h2>
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-4">Prohibited Content and Behavior</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-800 mb-3">Content Violations</h4>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• Spam, self-promotion, or excessive advertising</li>
                      <li>• Plagiarized content or code without attribution</li>
                      <li>• Misleading or false technical information</li>
                      <li>• NSFW or inappropriate content</li>
                      <li>• Copyright infringement</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 mb-3">Behavior Violations</h4>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• Harassment, bullying, or personal attacks</li>
                      <li>• Discrimination or hate speech</li>
                      <li>• Trolling or deliberately disruptive behavior</li>
                      <li>• Sharing private information without consent</li>
                      <li>• Impersonation or fake accounts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.7}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">How to Report Issues</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">Use Report Button</h3>
                  <p className="text-gray-600 text-sm">Click the report button on any post or comment that violates our guidelines</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">Contact Moderators</h3>
                  <p className="text-gray-600 text-sm">Reach out directly to our moderation team for serious issues</p>
                </div>
                <div className="text-center p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">Provide Context</h3>
                  <p className="text-gray-600 text-sm">Include specific details about what happened and why it's concerning</p>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.8}>
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-black mb-6">Consequences and Appeals</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-4">Our Enforcement Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">1.</span>
                    <span className="text-gray-700">First violation: Warning and content removal</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">2.</span>
                    <span className="text-gray-700">Repeated violations: Temporary suspension</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">3.</span>
                    <span className="text-gray-700">Severe violations: Permanent ban</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">4.</span>
                    <span className="text-gray-700">Appeals process available for all actions</span>
                  </div>
                </div>
              </div>
            </section>
          </GSAPFadeIn>

          <GSAPFadeIn delay={0.9}>
            <section className="text-center">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-black mb-4">Questions About Guidelines?</h2>
                <p className="text-gray-600 mb-6">
                  If you have questions about these guidelines or need clarification on any policy, 
                  don't hesitate to reach out to our community team.
                </p>
                <a 
                  href="/contact" 
                  className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </section>
          </GSAPFadeIn>
        </div>
      </div>
    </div>
  )
}
