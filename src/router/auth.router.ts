import { Router } from "express";
import { check } from "express-validator";
import { AuthController } from "../controller/auth/Auth.controller";
import { validateProperties } from "../middlewares/validate-properties";
import { AuthService } from "../service/auth/auth.service";
import { getCsrfToken } from "../controller/auth/getCsrfToken";
const router = Router();
//Ralizamos inyeccion de dependencias del service al controlador para un mejor orden y control.
const authService = new AuthService();
const authController = new AuthController(authService);

router.get("/csrf-token", getCsrfToken);

router.post(
    "/login",
    [
        check("email", "Agregue un email valido").isEmail(),
        check("password", "El password es obligatorio"),
        validateProperties,
    ],
    authController.loginPost,
);

router.post("/register", [validateProperties], authController.registerPost);

export default router;
