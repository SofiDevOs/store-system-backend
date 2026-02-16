import {
    DB_DATABASE,
    DB_USER,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
} from "./envs.config"; // -> Variables de entorno que tienes en tu archivo .env para tu BD
//Aqui deberia ir la configuracion de tu ORM a tu BD.
//
// -->
//
/**************************/
const dbConnection = async (): Promise<void> => {
    try {
        //Aquie haces la instancia de tu configuracion para validar su conexion.
        //Esta funcion la importas a tu clase Server, creando su metodo dataBaseConnection() asincrono, ejecutas esta funcion dentro del
        //metodo con si await por defecto, y ejecutas el metodo dataBaseConnection() que contiene esta funcion dentro del constructor del server.
    } catch (error: unknown) {
        throw new Error("error de coneccion a la BD");
    }
};
