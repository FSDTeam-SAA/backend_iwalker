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
    service: "Gmail",
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  });

  await transporter.sendMail({
    from: `"App Support" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
};
