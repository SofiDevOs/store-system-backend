import { IAuthService, ILoginPost } from './IAuth.interface';
import { JWT } from '../../helpers/jwt';
//Aqui va la regla de negocio, las consultas en tus bases de datos y tus querys.
//Trata de que cada accion distinta se implemente en metodos separados
export class AuthService implements IAuthService{
    constructor(){}

    //->Aqui aun faltaria generar la interface de respuesta Promise<any> para que no sea any. Ya que se necesitaria validar 
    // que datos se van a devolver del usuario si es que el login se realiza correctamante.                                                     
    public async validateInfoUser( data:ILoginPost):Promise<any>{
        const { email, password } = data;

        const resp = false; 

        //tambien aqui puedes generar tur errores personalizaados si el usuario no existe, esta dado debaja, etc/
        if(!resp){
            const error = new Error();
            error.name = 'Error 401';
            error.message = 'Usuario no dado de baja';
            throw error;
        }
        return resp;
    }
}