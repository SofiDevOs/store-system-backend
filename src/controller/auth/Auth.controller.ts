import { Request, Response } from "express";
import { IAuthService } from "../../service/auth/IAuth.interface";
import { verificationEmailTemplate } from "../../templates/verificationEmail";
import { sendVerificationEmail } from "../../helpers/mailer";
import { JWT } from "../../helpers/jwt";
import { generateTempPassword } from "../../helpers/temporalPassword";
//Aqui solo manejasmos las rtestpuestas HTTP

export class AuthController {
    //En el constructor va el argumento que maneja las acciones del servicio con su debida interface
    constructor(private readonly authService: IAuthService) {}

    public loginPost = async (req: Request, res: Response) => {
        const data = req.body;
        const result = await this.authService.validateInfoUser(data);
        // result es un Either, por lo que usamos fold para manejar ambos casos: éxito y error
        // si hay un error lo propagamos para que el errorHandler lo maneje, si no hay error devolvemos la respuesta exitosa
        result.fold(
            (resp) =>
                res.json({
                    msg: resp,
                    csrfToken: res.locals.csrfToken,
                }),
            (error) => {
                throw error;
            }
        );
    };

    public registerPost = async (req: Request, res: Response) => {
        const formData = req.body;
        const token = await JWT.generateJWT({
            email: formData.email as string,
            name: formData.name as string,
        });

        const result = await this.authService.createNewEmployee({
            ...formData,
            token: token!,
            tokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        result.fold(
            async () => {
                const tempPassword = generateTempPassword(12);

                await sendVerificationEmail(
                    formData.email,
                    token!,
                    tempPassword
                );
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
