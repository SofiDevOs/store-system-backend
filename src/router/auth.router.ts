import { Router } from "express";
import { check } from "express-validator";
import { AuthController } from "../controller/auth/Auth.controller";
import { validateProperties } from "../middlewares/validate-properties";
import { AuthService } from "../service/auth/auth.service";
import { getCsrfToken } from "../controller/auth/getCsrfToken";
import { ensureAdminMiddleware } from "../middlewares/ensureAdminMiddleware";
import { authenticate } from "../middlewares/authMiddleware";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";

const router = Router();
// Ralizamos inyeccion de dependencias del service al controlador para un mejor orden y control.
const authService = new AuthService();
const authController = new AuthController(authService);

const createNewEmployee = authController.registerPost;

router.get("/csrf-token", getCsrfToken);

router.post(
    "/login",
    [
        check("email", "Agregue un email valido").isEmail(),
        check("password", "El password es obligatorio"),
        validateProperties,
    ],
    authController.loginPost
);

router.post(
    "/register",
    authenticate,
    ensureAdminMiddleware,
    uploadMiddleware.single("profileImage"),
    [
        check("name", "El nombre es obligatorio").notEmpty(),
        check("lastname", "El apellido es obligatorio").notEmpty(),
        check("email", "Agregue un email valido").isEmail(),
        check(
            "birthdate",
            "La fecha de nacimiento es obligatoria y debe ser una fecha válida"
        )
            .notEmpty()
            .isDate(),
        check("rfc", "El RFC es obligatorio").notEmpty(),
        check("nss", "El NSS es obligatorio").notEmpty(),
        check("address", "La dirección es obligatoria").notEmpty(),
        check("salary", "El salario debe ser un número numérico")
            .notEmpty()
            .isNumeric(),
        validateProperties,
    ],
    authenticate,
    ensureAdminMiddleware,
    createNewEmployee
);

export default router;
