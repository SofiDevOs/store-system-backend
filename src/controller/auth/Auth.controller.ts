import { Request, Response } from "express";
import { IAuthService } from "../../service/auth/IAuth.interface";
import { verificationEmailTemplate } from "../../templates/verificationEmail";
import { sendVerificationEmail } from "../../helpers/mailer";
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
        const requestingAdminEmail = res.locals.email;
        const result = await this.authService.createNewEmployee(
            formData,
            requestingAdminEmail
        );
        result.fold(
            async () => {
                const tempPassword = formData.token;
                const url = `${process.env.FRONTEND_URL}/verify-email?token=${tempPassword}`;

                const emailContent = verificationEmailTemplate({
                    url,
                    tempPassword,
                });
                await sendVerificationEmail(
                    formData.email,
                    emailContent,
                    "Verifica tu email"
                );
                res.json({ msg: "Employee created successfully" });
            },
            (error) => {
                throw error;
            }
        );
    };
}
