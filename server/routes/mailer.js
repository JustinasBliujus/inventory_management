import sgMail from '@sendgrid/mail';

export async function sendVerificationEmail(email, token) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const verificationUrl = `${process.env.MY_URL}:${process.env.PORT}/verify?token=${token}`;

  const msg = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Verify Your Account',
    text: `Verify Your Account\n\nUse the link below to verify your account:\n\n${verificationUrl}\n\nIf you did not request this, please ignore this email.`,
    html: `
      <p>Verify Your Account</p>
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
      <p>If you did not request this, please ignore this email.</p>
    `,
    trackingSettings: {
      clickTracking: { enable: false }
    }
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error(error);
  }
}
