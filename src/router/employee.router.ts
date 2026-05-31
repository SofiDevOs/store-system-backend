import { Router } from "express";
import { check } from "express-validator";
import { validateProperties } from "../middlewares/validate-properties";
import { EmployeeService } from "../service/employee/employee.service";
import { EmployeeController } from "../controller/employee/employee.controller";
import { ensureAdminMiddleware } from "../middlewares/ensureAdminMiddleware";
import { authenticate } from "../middlewares/authMiddleware";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";

const employeeRouter = Router();
const employeeService = new EmployeeService();
const employeeController = new EmployeeController(employeeService);

employeeRouter.get(
    "/",
    authenticate,
    ensureAdminMiddleware,
    employeeController.getAll
);

employeeRouter.post(
    "/",
    authenticate,
    ensureAdminMiddleware,
    uploadMiddleware.single("profileImage"),
    [
        check("role", "El rol es obligatorio").notEmpty(),
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
        check("phone", "El número de teléfono es obligatorio").notEmpty(),
        check("address", "La dirección es obligatoria").notEmpty(),
        check("salary", "El salario debe ser un número numérico")
            .notEmpty()
            .isNumeric(),
        validateProperties,
    ],
    employeeController.create
);

employeeRouter.get(
    "/:id",
    authenticate,
    ensureAdminMiddleware,
    employeeController.getById
);

employeeRouter.put(
    "/:id",
    authenticate,
    ensureAdminMiddleware,
    employeeController.update
);

export default employeeRouter;
