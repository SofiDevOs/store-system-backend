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

        // El token temporal se estaba recibiendo desde el front. Hacerlo de esa forma permite
        // falsear el token. Es decir, puedo enviar un token en el body, e ingresar directamente a la ruta de verificación
        // de un correo que no es mio y verificarlo sin tener acceso al correo.
        // No creo que sea comodo que el admin genere manualmente la contraseña temporal, que lo haga el sistema!!
        const tempPassword = generateTempPassword(12);

        const token = await JWT.generateJWT({
            email: formData.email as string,
            name: formData.name as string,
        });

        const result = await this.authService.createNewEmployee({
            ...formData,
            token: token!,
            tokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            password: tempPassword,
        });

        result.fold(
            async () => {
                // se estaba usando el token como contraseña temporal, lo cual no tiene sentido.
                // Ademas que se estaba verificando desde el front, lo cual es aun peor.
                // se estab creando un template y ni siquiera se estaba usando WTF.
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
