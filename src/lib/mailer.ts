import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}

sgMail.setApiKey(apiKey);

const fromEmail = process.env.FROM_EMAIL || "noreply@contact.simplemart.dev";

type EmailOptions = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

const sendEmail = async (subject: string, body: string, to: string) => {
  try {
    const msg: EmailOptions = {
      to,
      from: fromEmail,
      subject,
      html: body,
      text: body.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    };

    const response = await sgMail.send(msg);

    if (response && response[0]?.statusCode === 202) {
      return { success: true, messageId: response[0]?.headers?.['x-message-id'] };
    }

    return { success: false, error: 'Failed to send email' };
  } catch (error: any) {
    console.error('Error sending email:', error);

    if (error.response) {
      console.error('SendGrid error response:', error.response.body);
    }

    return {
      success: false,
      error: error.message || 'Failed to send email',
      details: error.response?.body || null
    };
  }
};

// Function to send verification email with link
export const sendVerificationEmail = async (email: string, userId: string, fullName?: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const verificationLink = `${baseUrl}/verify/?verificationId=${userId}`;

  const subject = 'Verify Your Email Address';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Address Book!</h1>
      </div>

      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
        <h2 style="color: #333; margin-top: 0;">Hi ${fullName || 'there'}!</h2>

        <p style="font-size: 16px; margin-bottom: 25px;">
          Thank you for signing up for Address Book. To complete your registration and start using your account,
          please verify your email address by clicking the button below.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}"
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    font-size: 16px;
                    display: inline-block;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            Verify Email Address
          </a>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 25px;">
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="font-size: 14px; color: #667eea; word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
          ${verificationLink}
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">

        <p style="font-size: 12px; color: #999; margin-bottom: 0;">
          If you didn't create an account with us, please ignore this email.
          <br>
          This verification link will expire in 24 hours for security reasons.
        </p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(subject, html, email);
};

export default sendEmail;
