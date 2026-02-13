import { Request, Response } from "express";
import { IAuthService } from "../../service/auth/IAuth.interface";
import { HttpError, NotFoundError } from "../../helpers/errors/error";
//Aqui solo manejasmos las rtestpuestas HTTP

export class AuthController {
    //En el constructor va el argumento que maneja las acciones del servicio con su debida interface
    constructor(private readonly authService: IAuthService) {}

    public loginPost = async (req: Request, res: Response) => {
       
        const data = req.body;
        const result = await this.authService.validateInfoUser(data);

        result.fold(
            (resp) => {
                res.status(200).json({
                    msg: resp,
                });
            },
            (error) => {
                if (error instanceof HttpError) {
                    res.status(error.httpCode).json({
                        status: error.httpCode,
                        name: error.name,
                        msg: error.message,
                    });
                } else {
                    res.status(500).json({
                        status: 500,
                        name: "InternalServerError",
                        msg: "An unexpected error occurred",
                    });
                }
            },
        );
    };

    public registerPost = async (req: Request, res: Response) => {};
}
