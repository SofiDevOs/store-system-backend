import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { verificationEmailTemplate } from "../templates/verificationEmail";
dotenv.config();

export const sendVerificationEmail = async (
    email: string,
    token: string,
    tempPass: string
) => {
    const url = `{$process.env.FRONTEND_URL}/verify-email?token=${token}&email=${email}`;

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: `Store System <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Verifica tu cuenta",
        html: verificationEmailTemplate({ url, tempPassword: tempPass }),
    });
};
