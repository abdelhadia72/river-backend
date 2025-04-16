import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const testMailhog = async () => {
  console.log('Testing MailHog connection...');
  console.log('SMTP Host:', process.env.SMTP_HOST);
  console.log('SMTP Port:', process.env.SMTP_PORT);

  try {
    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
      debug: true,
      logger: true
    });

    const verified = await transporter.verify();
    console.log('SMTP Connection verified:', verified);

    const info = await transporter.sendMail({
      from: '"Test Sender" <test@example.com>',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email from the River app',
      html: '<b>This is a test email from the River app</b>'
    });

    console.log('Test email sent!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('Error during test:', error);
  }
};

testMailhog();
