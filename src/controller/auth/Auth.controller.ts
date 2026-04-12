import { Request, Response } from "express";
import { IAuthService } from "../../service/auth/IAuth.interface";
import { sendVerificationEmail } from "../../helpers/mailer";
import { JWT } from "../../helpers/jwt";
import { SITE } from "../../config/envs.config";

export class AuthController {
    //En el constructor va el argumento que maneja las acciones del servicio con su debida interface
    constructor(private readonly authService: IAuthService) {}

    public loginPost = async (req: Request, res: Response) => {
        const data = req.body;
        const result = await this.authService.validateInfoUser(data);

        result.fold(
            async (userData) => {
                try {
                    const token = await JWT.generateJWT({
                        id: userData.id,
                        email: userData.email,
                        role: userData.role,
                    });

                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 24 * 60 * 60 * 1000,
                    });

                    res.json({
                        msg: "Login exitoso",
                    });
                } catch (err) {
                    console.error("Login JWT Generation Error:", err);
                    res.status(500).json({
                        message:
                            "No se pudo generar la sesión del usuario debido a un error interno del servidor",
                    });
                }
            },
            (error) => {
                throw error;
            }
        );
    };

    public verifyEmail = async (req: Request, res: Response) => {
        const { token } = req.query;
        const frontendUrl = SITE || "http://localhost:4321";

        if (!token || typeof token !== "string") {
            return res.redirect(`${frontendUrl}/login?error=missing_token`);
        }

        try {
            const decoded = await JWT.validateToken<{ email: string }>(token);

            const result = await this.authService.verifyEmail(
                token,
                decoded.email
            );

            result.fold(
                () => {
                    res.redirect(`${frontendUrl}/login?verified=true`);
                },
                (error) => {
                    res.redirect(
                        `${frontendUrl}/login?error=${encodeURIComponent(error.message)}`
                    );
                }
            );
        } catch (error: any) {
            res.redirect(`${frontendUrl}/login?error=invalid_or_expired_token`);
        }
    };

    public resendVerification = async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email || typeof email !== "string") {
            return res
                .status(400)
                .json({ message: "Se requiere un email válido" });
        }

        const result = await this.authService.resendVerificationToken(email);

        result.fold(
            async ({ token, tempPassword }) => {
                try {
                    await sendVerificationEmail(email, token, tempPassword);
                    res.json({
                        message:
                            "Correo de verificación reenviado exitosamente",
                    });
                } catch (error) {
                    console.error("Error al reenviar el correo:", error);
                    res.status(500).json({
                        message: "Error al enviar el correo",
                    });
                }
            },
            async (error) => {
                res.status(400).json({ message: error.message });
            }
        );
    };

    public logout = (req: Request, res: Response) => {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.json({ message: "Sesión cerrada correctamente" });
    };
}
