import nodemailer from "nodemailer";
import { mailPass, mailUser } from "../config/config";

export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: mailPass,
    },
  });

  await transporter.sendMail({
    from: `"App Support" <kmsaifullah24@gmail.com>`,
    to,
    subject,
    text,
  });
};
