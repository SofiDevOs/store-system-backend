import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/envs.config";

type ExpiresIn = "2h" | "1d" | "30m" | "7d";

export class JWT {
    static generateJWT(
        data: { name: string; email: string },
        duration: ExpiresIn = "2h",
    ): Promise<string | null> {
        return new Promise((resolve, reject) => {
            jwt.sign(
                data,
                JWT_SECRET_KEY as string,
                {
                    expiresIn: duration,
                },
                (err, token) => {
                    if (err) {
                        reject("No se pudo generar el token");
                    } else {
                        resolve(token!);
                    }
                },
            );
        });
    }

    static validateToken(token: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET_KEY as string, (err, decode) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(decode);
                    resolve(decode as string);
                }
            });
        });
    }
}
