import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (options) => {
  const emailOptions = {
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // only set "from" if it exists in env (no hard dependency)
  if (process.env.SMTP_FROM) {
    emailOptions.from = process.env.SMTP_FROM;
  }

  return transporter.sendMail(emailOptions);
};