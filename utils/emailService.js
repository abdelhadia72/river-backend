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

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    console.log('Sending verification email to:', email);
    console.log('Verification code:', verificationCode);
    console.log('SMTP settings:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT
    });

    const transporter = await verifyConnection();

    const mailOptions = {
      from: process.env.EMAIL || 'noreply@riverapp.com',
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <h1 style="color: #007bff;">${email}</h1>
          <p>Thank you for registering with River App. Please use the following verification code to complete your registration:</p>
          <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p>This code will expire in 24 hours.</p>
          <p>If you did not request this verification, please ignore this email.</p>
        </div>
      `
    };

    console.log('Preparing to send email with options:', mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    console.error('Error details:', error.stack);
    return false;
  }
};
