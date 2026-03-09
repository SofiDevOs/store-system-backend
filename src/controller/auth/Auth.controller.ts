import { Request, Response } from "express";
import { IAuthService } from "../../service/auth/IAuth.interface";
import { verificationEmailTemplate } from "../../templates/verificationEmail";
import { sendVerificationEmail } from "../../helpers/mailer";
import { JWT } from "../../helpers/jwt";
import { generateTempPassword } from "../../helpers/temporalPassword";
//Aqui solo manejasmos las rtestpuestas HTTP

import { uploadImageToCloudinary } from "../../helpers/cloudinary";

export class AuthController {
    //En el constructor va el argumento que maneja las acciones del servicio con su debida interface
    constructor(private readonly authService: IAuthService) {}

    public loginPost = async (req: Request, res: Response) => {
        const data = req.body;
        const result = await this.authService.validateInfoUser(data);
        // result es un Either, por lo que usamos fold para manejar ambos casos: éxito y error
        // si hay un error lo propagamos para que el errorHandler lo maneje, si no hay error devolvemos la respuesta exitosa
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
                        maxAge: 24 * 60 * 60 * 1000, // 1 dia
                    });

                    res.json({
                        msg: "Login exitoso",
                        user: userData,
                        csrfToken: res.locals.csrfToken,
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

    public registerPost = async (req: Request, res: Response) => {
        const formData = req.body;
        const tempPassword = generateTempPassword(12);
        let profileImageUrl: string | undefined = undefined;
        const file = (req as any).file;
        if (file) {
            try {
                profileImageUrl = await uploadImageToCloudinary(
                    file.buffer,
                    "store0system"
                );
            } catch (error) {
                return res
                    .status(500)
                    .json({ message: "Error uploading profile image" });
            }
        }

        const token = await JWT.generateJWT({
            email: formData.email as string,
            name: formData.name as string,
        });

        const result = await this.authService.createNewEmployee({
            ...formData,
            salary: Number(formData.salary),
            profileImage: profileImageUrl,
            token: token!,
            tokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            password: tempPassword,
        });

        result.fold(
            async () => {
                try {
                    await sendVerificationEmail(
                        formData.email,
                        token!,
                        tempPassword
                    );
                } catch (emailError) {
                    console.error(
                        "Error al enviar el correo de verificación:",
                        emailError
                    );
                }
                res.status(201);
                res.json({ msg: "Employee created successfully" });
            },
            (error) => {
                throw error;
            }
        );
    };

    public verifyEmail = async (req: Request, res: Response) => {
        const { token } = req.query;

        if (!token || typeof token !== "string") {
            return res.status(400).json({ message: "Token is required" });
        }
    };
}
