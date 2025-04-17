import nodemailer from 'nodemailer';

const verifyConnection = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1025'),
      secure: false,
      debug: true,
      logger: true
    });

    const verified = await transporter.verify();
    console.log('SMTP connection verified:', verified);
    return transporter;
  } catch (error) {
    console.error('SMTP connection verification failed:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, code, type = 'email_verification') => {
  try {
    console.log(`Sending ${type} email to:`, email);
    console.log('Code:', code);
    console.log('SMTP settings:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT
    });

    const transporter = await verifyConnection();

    let subject, textContent, htmlContent;

    if (type === 'password_reset') {
      subject = 'Password Reset Code';
      textContent = `Your password reset code is: ${code}. This code will expire in 15 minutes.`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <h1 style="color: #007bff;">${email}</h1>
          <p>You requested to reset your password for your River App account. Please use the following code:</p>
          <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
      `;
    } else {
      subject = 'Email Verification';
      textContent = `Your verification code is: ${code}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <h1 style="color: #007bff;">${email}</h1>
          <p>Thank you for registering with River App. Please use the following verification code to complete your registration:</p>
          <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 24 hours.</p>
          <p>If you did not request this verification, please ignore this email.</p>
        </div>
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL || 'noreply@riverapp.com',
      to: email,
      subject: subject,
      text: textContent,
      html: htmlContent
    };

    console.log('Preparing to send email with options:', mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', error.stack);
    return false;
  }
};
