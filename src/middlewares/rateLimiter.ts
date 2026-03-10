import rateLimit from "express-rate-limit";

/**
 * Strict rate limiter for the email verification endpoint.
 *
 * Implements OWASP recommendations to prevent brute-force attacks on single-use
 * verification tokens.
 *
 * @remarks
 * Limits requests to 5 per IP address within a 15-minute window.
 */
export const verifyEmailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message:
            "Demasiados intentos de verificación. Por favor, inténtalo de nuevo después de 15 minutos.",
    },
    standardHeaders: "draft-7",
    legacyHeaders: false, // Deshabilita los headers obsoletos `X-RateLimit-*`
});

/**
 * General rate limiter for the login endpoint.
 *
 * Implements OWASP recommendations to mitigate brute-force attacks, password
 * guessing, and credential stuffing on authentication routes.
 *
 * @remarks
 * Limits requests to 10 per IP address within a 15-minute window.
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        message:
            "Demasiados intentos de inicio de sesión. Por favor, inténtalo de nuevo después de 15 minutos.",
    },
    standardHeaders: "draft-7",
    legacyHeaders: false,
});
