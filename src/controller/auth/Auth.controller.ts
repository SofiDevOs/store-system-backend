import { Request, Response } from "express";
import { IAuthService } from "../../service/auth/IAuth.interface";
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
            (resp) => res.json({
                 msg: resp,
                csrfToken: res.locals.csrfToken,
             }),
            (error) => {
                throw error;
            },
        );


    };
    public registerPost = async (req: Request, res: Response) => {};
}
