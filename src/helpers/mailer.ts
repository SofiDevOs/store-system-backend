import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { verificationEmailTemplate } from "../templates/verificationEmail";
dotenv.config();

export const sendVerificationEmail = async (
    email: string,
    token: string,
    tempPass: string
) => {
    const url = `${process.env.BACKEND_SITE}/api/v1/auth/verify-email?token=${token}`;

    const port = Number(process.env.MAIL_PORT) || 587;
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port,
        secure: port === 465,
        auth: {
            user: process.env.MAIL_USER || "user",
            pass: process.env.MAIL_PASS || "pass",
        },
    });
    await transporter.sendMail({
        from: `Store System <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Verifica tu cuenta",
        html: verificationEmailTemplate({ url, tempPassword: tempPass }),
    });
};
