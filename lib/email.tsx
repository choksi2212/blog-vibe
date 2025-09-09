import nodemailer from "nodemailer"

// If SMTP credentials are missing, fall back to JSON transport to avoid runtime crashes in dev
const useJsonTransport = !process.env.SMTP_USER || !process.env.SMTP_PASS

const transporter = useJsonTransport
  ? nodemailer.createTransport({ jsonTransport: true })
  : nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: (process.env.SMTP_PORT || "587") === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "blogvibe@gmail.com",
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    })

    if (useJsonTransport) {
      console.log("Email (json transport):", info.message)
    } else {
      console.log("Email sent:", info.messageId)
    }
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: error.message }
  }
}

// Email Templates
export const emailTemplates = {
  welcome: (userName: string) => ({
    subject: "Welcome to Devnovate - Start Your Developer Journey!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Devnovate</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
            .highlight { background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Welcome to Devnovate!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your developer blogging journey starts here</p>
            </div>
            
            <div class="content">
              <h2>Hi ${userName}! 👋</h2>
              
              <p>Welcome to the Devnovate community! We're thrilled to have you join our growing network of passionate developers who share knowledge, insights, and experiences.</p>
              
              <div class="highlight">
                <h3 style="margin-top: 0; color: #059669;">What you can do now:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Write and publish your first blog post</li>
                  <li>Explore trending content from the community</li>
                  <li>Connect with fellow developers</li>
                  <li>Share your expertise and learn from others</li>
                </ul>
              </div>
              
              <p>Ready to start writing? Your posts will be reviewed by our team to ensure quality content for the community.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/create" class="button">Write Your First Post</a>
              </div>
              
              <p>If you have any questions or need help getting started, don't hesitate to reach out to our community.</p>
              
              <p>Happy coding and writing!</p>
              <p><strong>The Devnovate Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2024 Devnovate. Built with passion for the developer community.</p>
              <p>You received this email because you signed up for a Devnovate account.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  blogApproved: (userName: string, blogTitle: string, blogId: string) => ({
    subject: `🎉 Your blog "${blogTitle}" has been approved!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Blog Approved - Devnovate</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
            .success-badge { background-color: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-weight: 600; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Congratulations! 🎉</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your blog post has been approved</p>
            </div>
            
            <div class="content">
              <h2>Hi ${userName}!</h2>
              
              <div class="success-badge">✅ APPROVED</div>
              
              <p>Great news! Your blog post <strong>"${blogTitle}"</strong> has been reviewed and approved by our team. It's now live on Devnovate for the entire community to read and engage with.</p>
              
              <p>Your content contributes to the growing knowledge base that helps developers worldwide. Thank you for sharing your expertise!</p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/blog/${blogId}" class="button">View Your Published Post</a>
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Your post is now discoverable by the community</li>
                <li>Readers can like, comment, and share your content</li>
                <li>You'll receive notifications about engagement</li>
                <li>Keep writing more amazing content!</li>
              </ul>
              
              <p>Keep up the excellent work, and we look forward to your next post!</p>
              
              <p>Best regards,<br><strong>The Devnovate Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2025 Devnovate. Built with passion for the developer community.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  blogRejected: (userName: string, blogTitle: string, reason?: string) => ({
    subject: `Your blog "${blogTitle}" needs some updates`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Blog Review Feedback - Devnovate</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
            .feedback-box { background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .tips-box { background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Review Feedback</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your blog post needs some updates</p>
            </div>
            
            <div class="content">
              <h2>Hi ${userName},</h2>
              
              <p>Thank you for submitting your blog post <strong>"${blogTitle}"</strong>. After reviewing your content, our team has some feedback to help you improve it before publication.</p>
              
              ${
                reason
                  ? `
                <div class="feedback-box">
                  <h3 style="margin-top: 0; color: #dc2626;">Feedback:</h3>
                  <p style="margin-bottom: 0;">${reason}</p>
                </div>
              `
                  : ""
              }
              
              <div class="tips-box">
                <h3 style="margin-top: 0; color: #0369a1;">Tips for approval:</h3>
                <ul style="margin-bottom: 0;">
                  <li>Ensure your content is original and adds value to the community</li>
                  <li>Use proper formatting and clear structure</li>
                  <li>Include relevant code examples where applicable</li>
                  <li>Check for grammar and spelling errors</li>
                  <li>Make sure your content follows our community guidelines</li>
                </ul>
              </div>
              
              <p>Don't worry! This is a normal part of the process, and we're here to help you create amazing content. Please review the feedback, make the necessary updates, and resubmit your post.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" class="button">Edit Your Post</a>
              </div>
              
              <p>We believe in your potential and look forward to seeing your improved post!</p>
              
              <p>Best regards,<br><strong>The Devnovate Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2024 Devnovate. Built with passion for the developer community.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  newComment: (userName: string, blogTitle: string, blogId: string, commenterName: string, commentContent: string) => ({
    subject: `New comment on your blog: "${blogTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Comment - Devnovate</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
            .comment-box { background-color: #f8fafc; border-left: 4px solid #059669; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">New Comment! 💬</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone engaged with your blog post</p>
            </div>
            
            <div class="content">
              <h2>Hi ${userName}!</h2>
              
              <p>Great news! <strong>${commenterName}</strong> just left a comment on your blog post <strong>"${blogTitle}"</strong>.</p>
              
              <div class="comment-box">
                <h4 style="margin-top: 0; color: #059669;">Comment from ${commenterName}:</h4>
                <p style="margin-bottom: 0; font-style: italic;">"${commentContent}"</p>
              </div>
              
              <p>Engagement like this shows that your content is resonating with the community. Consider replying to keep the conversation going!</p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/blog/${blogId}#comments" class="button">View & Reply</a>
              </div>
              
              <p>Keep creating amazing content that sparks discussions!</p>
              
              <p>Best regards,<br><strong>The Devnovate Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2024 Devnovate. Built with passion for the developer community.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}
