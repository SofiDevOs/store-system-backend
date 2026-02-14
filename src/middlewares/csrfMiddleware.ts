// apps/api/src/middleware/csrfMiddleware.ts
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

// Constantes para evitar "magic strings"
const CSRF_COOKIE_NAME = "csrfToken";
const CSRF_HEADER_NAME = "x-csrf-token";
const TOKEN_EXPIRATION = 3600000;

/**
 * Genera un token criptográficamente fuerte de 32 bytes.
 */
const generateToken = (): string => crypto.randomBytes(32).toString("hex");

/**
 * Middleware Global: Asegura que el cliente siempre tenga una cookie CSRF base.
 * Se debe usar en app.use() antes de las rutas.
 */
export const csrfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = req.cookies[CSRF_COOKIE_NAME];

  if (!token) {
    token = generateToken();
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: true, // Impide acceso desde JS del cliente (XSS)
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Protege en navegaciones externas pero permite uso normal
      maxAge: TOKEN_EXPIRATION,
    });
  }

  // Hacemos el token disponible en el objeto Request gracias a tu express.d.ts
  req.csrfToken = token;
  res.locals.csrfToken = token;
  next();
};

/**
 * Middleware de Validación: Compara la cookie contra el header enviado por el cliente.
 * Se aplica solo en rutas de escritura (POST, PUT, DELETE, PATCH).
 */
export const verifyCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const protectedMethods = ["POST", "PUT", "DELETE", "PATCH"];

  if (!protectedMethods.includes(req.method)) {
    return next();
  }

  const tokenFromCookie = req.cookies[CSRF_COOKIE_NAME];
  const tokenFromRequest = req.headers[CSRF_HEADER_NAME] || req.body._csrf;

  if (!tokenFromCookie || tokenFromCookie !== tokenFromRequest) {
    return res.status(403).json({
      errors: [{ msg: "Forbidden: Invalid or missing CSRF token" }],
    });
  }

  next();
};

/**
 * Middleware de Rotación: Genera un nuevo token tras un evento sensible (Login/Logout).
 * Previene el ataque de 'Session Fixation'.
 */
export const rotateCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const newToken = generateToken();

  res.cookie(CSRF_COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_EXPIRATION,
  });

  req.csrfToken = newToken;
  res.locals.csrfToken = newToken;
  next();
};