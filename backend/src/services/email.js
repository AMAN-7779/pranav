const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    this.from = {
      email: process.env.FROM_EMAIL || process.env.SMTP_USERNAME,
      name: process.env.FROM_NAME || "E-Info.me",
    };
  }

  /**
   * Send email using the specified format
   * Shows: "senderEmail has sent you a mail: [message]"
   */
  async sendMessage(senderEmail, receiverEmail, message) {
    try {
      const mailOptions = {
        from: `${this.from.name} <${this.from.email}>`,
        to: receiverEmail,
        subject: `New mail from ${senderEmail}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">New Mail from E-Info.me</h2>
              <p style="color: #666; font-size: 16px; margin-bottom: 0;">
                <strong>${senderEmail}</strong> has sent you a mail:
              </p>
            </div>
            <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">
                ${message.replace(/\n/g, '<br>')}
              </p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                This mail was sent through E-Info.me. 
                <a href="https://e-info.me" style="color: #007bff; text-decoration: none;">Visit E-Info.me</a>
              </p>
            </div>
          </div>
        `,
        text: `${senderEmail} has sent you a mail:\n\n${message}\n\nThis mail was sent through E-Info.me.`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Mail sent successfully", {
        messageId: info.messageId,
        senderEmail: senderEmail,
        recipientEmail: receiverEmail
      });
      return info;
    } catch (error) {
      logger.error("Email sending failed", {
        error: error.message,
        stack: error.stack,
        senderEmail: senderEmail,
        recipientEmail: recipientEmail
      });
      throw new Error("Failed to send email");
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(email, name, token) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
      
      const mailOptions = {
        from: `${this.from.name} <${this.from.email}>`,
        to: email,
        subject: "Verify Your E-Info.me Account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">E-Info.me</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Digital Profile Platform</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
              <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>
              <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                Hi ${name},<br><br>
                Thank you for joining E-Info.me! Please click the button below to verify your email address.
              </p>
              
              <a href="${verificationUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-size: 14px;">
                If you didn't create an account with E-Info.me, you can safely ignore this email.
              </p>
            </div>
          </div>
        `,
        text: `Hi ${name},\n\nThank you for joining E-Info.me! Please verify your email address by clicking the link below:\n\n${verificationUrl}\n\nIf you didn't create an account with E-Info.me, you can safely ignore this email.`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Verification email sent successfully", {
        messageId: info.messageId,
        email: email,
        name: name
      });
      return info;
    } catch (error) {
      logger.error("Verification email sending failed", {
        error: error.message,
        stack: error.stack,
        email: email,
        name: name
      });
      throw new Error("Failed to send verification email");
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email, name, username) {
    try {
      const profileUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/@${username}`;
      
      const mailOptions = {
        from: `${this.from.name} <${this.from.email}>`,
        to: email,
        subject: "Welcome to E-Info.me!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">Welcome to E-Info.me!</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Your Digital Profile Platform</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${name}! 👋</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Welcome to E-Info.me! We're excited to have you join our community of professionals creating amazing digital profiles.
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Your profile is now live at: <a href="${profileUrl}" style="color: #007bff; text-decoration: none;">${profileUrl}</a>
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${profileUrl}" 
                   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  View Your Profile
                </a>
              </div>
              
              <h3 style="color: #333; margin-top: 30px;">What's next?</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Complete your profile with your bio, skills, and experience</li>
                <li>Add your social media links and portfolio projects</li>
                <li>Share your profile with friends and colleagues</li>
                <li>Start building your professional network</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-size: 14px;">
                Need help? Reply to this email or visit our support page.
              </p>
            </div>
          </div>
        `,
        text: `Hi ${name}!\n\nWelcome to E-Info.me! We're excited to have you join our community.\n\nYour profile is now live at: ${profileUrl}\n\nWhat's next?\n- Complete your profile with your bio, skills, and experience\n- Add your social media links and portfolio projects\n- Share your profile with friends and colleagues\n- Start building your professional network\n\nNeed help? Reply to this email or visit our support page.`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Welcome email sent successfully", {
        messageId: info.messageId,
        email: email,
        name: name,
        username: username
      });
      return info;
    } catch (error) {
      logger.error("Welcome email sending failed", {
        error: error.message,
        stack: error.stack,
        email: email,
        name: name
      });
      throw new Error("Failed to send welcome email");
    }
  }

  /**
   * Test email configuration
   */
  async testConnection() {
    try {
      await this.transporter.verify();
      logger.info("Email service is ready");
      return true;
    } catch (error) {
      logger.error("Email service configuration error", {
        error: error.message,
        stack: error.stack
      });
      return false;
    }
  }
}

module.exports = new EmailService();
