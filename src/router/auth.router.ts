import { Router } from "express";
import { check } from "express-validator";
import { AuthController } from "../controller/auth/Auth.controller";
import { validateProperties } from "../middlewares/validate-properties";
import { AuthService } from "../service/auth/auth.service";
import { ensureAdminMiddleware } from "../middlewares/ensureAdminMiddleware";
import { authenticate } from "../middlewares/authMiddleware";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";
import { loginLimiter, verifyEmailLimiter } from "../middlewares/rateLimiter";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post(
    "/login",
    loginLimiter,
    [
        check("email", "Agregue un email valido").isEmail(),
        check("password", "El password es obligatorio"),
        validateProperties,
    ],
    authController.loginPost
);

// verify email
router.get("/verify-email", verifyEmailLimiter, authController.verifyEmail);

router.post(
    "/resend-verification",
    verifyEmailLimiter,
    [check("email", "Agregue un email valido").isEmail(), validateProperties],
    authController.resendVerification
);

export default router;
