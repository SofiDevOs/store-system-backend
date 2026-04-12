import { Router } from "express";
import { check } from "express-validator";
import { validateProperties } from "../middlewares/validate-properties";
import { AuthService } from "../service/auth/auth.service";
import { EmployeeController } from "../controller/employee/employee.controller";
import { ensureAdminMiddleware } from "../middlewares/ensureAdminMiddleware";
import { authenticate } from "../middlewares/authMiddleware";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";
import { loginLimiter, verifyEmailLimiter } from "../middlewares/rateLimiter";
import { AuthController } from "../controller/auth/Auth.controller";

const employeeRouter = Router();
const authService = new AuthService();
const employeeController = new EmployeeController(authService);

employeeRouter.post(
    "/",
    authenticate,
    ensureAdminMiddleware,
    uploadMiddleware.single("profileImage"),
    [
        check("name", "El nombre es obligaTrabajnadotorio").notEmpty(),
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
    employeeController.create
);

export default employeeRouter;
