import { prisma } from "../../config/prisma";
import {
    IAuthService,
    IUser,
    ILoginPost,
    IEmployeeInfo,
} from "./IAuth.interface";
import { NotFoundError, UnauthorizedError } from "../../helpers/errors/error";
import { Result } from "../../shared/core/Result";

//Aqui va la regla de negocio, las consultas en tus bases de datos y tus querys.
//Trata de que cada accion distinta se implemente en metodos separados

export class AuthService implements IAuthService {
    constructor() {}

    //->Aqui aun faltaria generar la interface de respuesta Promise<any> para que no sea any. Ya que se necesitaria validar
    // que datos se van a devolver del usuario si es que el login se realiza correctamante.
    public async validateInfoUser(
        data: ILoginPost,
    ): Promise<Result<string, Error>> {
        const { email, password } = data;
        console.log(email);
        console.log(password);

        const user: IUser | null = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        console.log(user);
        // Se agrego el patron Result para manejar los errores de una manera mas limpia y evitar el uso de throw new Error() en el codigo.
        // El servicio devuelve un resultado exitoso o un error envuelto en un objeto
        // Asi se pueden manejar los errores de negocio de una manera mas consistente en toda la aplicacion, y se evita el uso de excepciones para controlar el flujo del programa.
        if (!user) return Result.fail<string, Error>(new NotFoundError("user not found"));

        //tambien aqui puedes generar tur errores personalizaados si el usuario no existe, esta dado debaja, etc/
        if (!user.isActive) return Result.fail<string, Error>(new UnauthorizedError("Usuario dado de baja"));

        return Result.ok<string, Error>("Usuario validado correctamente");
    }

    public async createNewEmployee(payload: IEmployeeInfo): Promise<void> {
        const user = await prisma.user.create({
            data: {
                email: payload.email,
                password: payload.password,
            },
        });
    }
}
