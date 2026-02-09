import chalk from "chalk";
import express from "express";
import AuthRouter from "../router/auth.router";
//Este es la clase server el cual se esta ejecutando en el archivo app.ts
export class Server {
    private readonly app = express();
    private readonly port: number;

    private pathsWeb = {
        auth: "/api/v1/auth",
    };

    constructor(port: number = 3000) {
        this.port = port;
        this.middlewares();
        this.routes();
    }

    private middlewares() {
        console.log(chalk.bgBlue.green("Ejecutando middlewares..."));
        this.app.use(express.json());
    }

    private routes() {
        this.app.use(this.pathsWeb.auth, AuthRouter);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(
                chalk.bgBlue.green(
                    `Servidor levantado en puerto: http://localhost:${this.port}`,
                ),
            );
        });
    }
}
