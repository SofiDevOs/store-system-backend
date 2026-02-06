import { prisma } from "../../config/prisma";
import { JWT } from "../../helpers/jwt";
import {
  instanceNotFoundError,
  instanceUnauthorizedError,
} from "../../helpers/errors/errors";
import { IAuthService, IUser, ILoginPost, IEmployeeInfo } from "./IAuth.interface";
//Aqui va la regla de negocio, las consultas en tus bases de datos y tus querys.
//Trata de que cada accion distinta se implemente en metodos separados
export class AuthService implements IAuthService {
  constructor() {}

  //->Aqui aun faltaria generar la interface de respuesta Promise<any> para que no sea any. Ya que se necesitaria validar
  // que datos se van a devolver del usuario si es que el login se realiza correctamante.
  public async validateInfoUser(data: ILoginPost): Promise<any> {
    const { email, password } = data;
    console.log(email);
    console.log(password);

    const user:IUser|null = await prisma.user.findUnique({
      where: {
        email,
      },
    });
console.log(user)
    if (!user) throw instanceNotFoundError("Usuario no encontrado");

    //tambien aqui puedes generar tur errores personalizaados si el usuario no existe, esta dado debaja, etc/
    if (!user.isActive) throw instanceUnauthorizedError("Usuario dado de baja");

    return "ok";
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
