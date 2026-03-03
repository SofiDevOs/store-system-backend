import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { verificationEmailTemplate } from "../templates/verificationEmail";
dotenv.config();

export const sendVerificationEmail = async (
    email: string,
    token: string,
    tempPass: string
) => {
    // Se verificara desde el backend, Es necesario añadir la env de SITE.
    const url = `${process.env.SITE}/verify-email?token=${token}`;

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
