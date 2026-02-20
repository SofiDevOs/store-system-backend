import "express";
import {JwtUser} from "./user.type"
declare global {
    namespace Express {
        interface Request {
            csrfToken?: string;
            user?: JwtUser;
        }
    }
}
