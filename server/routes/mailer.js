import sgMail from '@sendgrid/mail';

export async function sendVerificationEmail(email, token) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const verificationUrl = `${process.env.BACKEND_URL}/verify?token=${token}`;

  const msg = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Verify Your Account',
    text: `Verify Your Account

Use the link below to verify your account:

${verificationUrl}

If the button in your email doesn't work, you can copy and paste this link into your browser.

If you did not request this, please ignore this email.
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Verify Your Account</h2>
        <p>Click the button below to verify your account:</p>
        <p>
          <a href="${verificationUrl}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #1a73e8;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          ">Verify Account</a>
        </p>
        <p style="margin-top: 20px;">
          If the button above doesn’t work, copy and paste the link below into your browser:
        </p>
        <p>
          <a href="${verificationUrl}" style="color: #1a73e8; word-break: break-all;">
            ${verificationUrl}
          </a>
        </p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
    trackingSettings: {
      clickTracking: { enable: false }
    }
  };

  try {
    await sgMail.send(msg);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}
