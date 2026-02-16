/**
 * CSRF (Cross-Site Request Forgery) protection middleware for Express.
 *
 * @remarks
 * Implements the **Synchronizer Token Pattern** using a cookie-to-header comparison
 * strategy. The flow works as follows:
 *
 * 1. {@link csrfMiddleware} sets an `httpOnly` cookie with a cryptographic token on every request.
 * 2. The client reads the token via a dedicated endpoint (e.g. `GET /csrf-token`) and
 *    sends it back in the `x-csrf-token` header on state-changing requests.
 * 3. {@link verifyCsrfToken} compares the cookie value against the header value.
 * 4. {@link rotateCsrfToken} replaces the token after sensitive events to prevent session fixation.
 *
 * @example
 * ### Registering the middleware stack
 * ```ts
 * import express from "express";
 * import cookieParser from "cookie-parser";
 * import { csrfMiddleware, verifyCsrfToken } from "@/middlewares/csrfMiddleware";
 *
 * const app = express();
 *
 * app.use(cookieParser());
 * app.use(csrfMiddleware);     // Ensures every response carries a CSRF cookie
 * app.use(verifyCsrfToken);    // Validates the token on POST / PUT / DELETE / PATCH
 * ```
 *
 * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html | OWASP CSRF Prevention Cheat Sheet}
 * @see {@link https://expressjs.com/en/advanced/best-practice-security.html | Express Security Best Practices}
 *
 * @packageDocumentation
 */
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

/** Name of the cookie that stores the CSRF token. */
const CSRF_COOKIE_NAME = "csrfToken";

/** HTTP header the client must use to send the token back. */
const CSRF_HEADER_NAME = "x-csrf-token";

/** Token time-to-live in milliseconds (1 hour). */
const TOKEN_EXPIRATION = 3600000;

/**
 * Generates a cryptographically strong random token.
 *
 * @returns A 64-character hex string derived from 32 random bytes.
 *
 * @see {@link https://nodejs.org/api/crypto.html#cryptorandombytessize-callback | crypto.randomBytes}
 */
const generateToken = (): string => crypto.randomBytes(32).toString("hex");

/**
 * Global middleware that ensures every client receives a CSRF cookie.
 *
 * @remarks
 * Must be registered **before** any route handlers via `app.use()`.
 * It also attaches the token to `req.csrfToken` and `res.locals.csrfToken`
 * so downstream handlers can expose or inspect it.
 *
 * Cookie flags:
 * | Flag | Value | Purpose |
 * |------|-------|---------|
 * | `httpOnly` | `true` | Prevents client-side JS access (mitigates XSS) |
 * | `secure` | `true` in production | Sent only over HTTPS |
 * | `sameSite` | `"lax"` | Blocks cross-origin sub-requests while allowing top-level navigation |
 *
 * @example
 * ```ts
 * // Register as the first middleware after cookie-parser
 * app.use(cookieParser());
 * app.use(csrfMiddleware);
 * ```
 *
 * @param req - Express {@link https://expressjs.com/en/api.html#req | Request} object.
 * @param res - Express {@link https://expressjs.com/en/api.html#res | Response} object.
 * @param next - Express {@link https://expressjs.com/en/guide/writing-middleware.html | NextFunction} callback.
 *
 * @see {@link verifyCsrfToken} — pair this with verification on mutating routes.
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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: TOKEN_EXPIRATION,
    });
  }

  req.csrfToken = token;
  res.locals.csrfToken = token;
  next();
};

/**
 * Validation middleware that compares the CSRF cookie against the value
 * sent by the client in the `x-csrf-token` header (or `_csrf` body field).
 *
 * @remarks
 * Only enforces validation on **state-changing** HTTP methods:
 * `POST`, `PUT`, `DELETE`, and `PATCH`. Safe methods (`GET`, `HEAD`, `OPTIONS`)
 * pass through without checks.
 *
 * When validation fails the response is:
 * ```json
 * { "errors": [{ "msg": "Forbidden: Invalid or missing CSRF token" }] }
 * ```
 *
 * @example
 * ### Applying globally after csrfMiddleware
 * ```ts
 * app.use(csrfMiddleware);
 * app.use(verifyCsrfToken);
 * ```
 *
 * @example
 * ### Applying to a specific router
 * ```ts
 * import { Router } from "express";
 * import { verifyCsrfToken } from "@/middlewares/csrfMiddleware";
 *
 * const router = Router();
 * router.use(verifyCsrfToken);
 *
 * router.post("/orders", createOrderHandler);
 * ```
 *
 * @param req - Express {@link https://expressjs.com/en/api.html#req | Request} object.
 * @param res - Express {@link https://expressjs.com/en/api.html#res | Response} object.
 * @param next - Express {@link https://expressjs.com/en/guide/writing-middleware.html | NextFunction} callback.
 *
 * @see {@link csrfMiddleware} — must be registered first so the cookie exists.
 * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/CSRF | MDN — CSRF Glossary}
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
 * Rotation middleware that replaces the current CSRF token with a fresh one.
 *
 * @remarks
 * Should be called **after** sensitive events such as login or logout to prevent
 * {@link https://owasp.org/www-community/attacks/Session_fixation | Session Fixation} attacks.
 * The new token is written to the cookie and attached to `req.csrfToken` / `res.locals.csrfToken`.
 *
 * @example
 * ### Rotating after login
 * ```ts
 * import { rotateCsrfToken } from "@/middlewares/csrfMiddleware";
 *
 * router.post("/auth/login", loginHandler, rotateCsrfToken, (req, res) => {
 *   res.json({ message: "Logged in", csrfToken: req.csrfToken });
 * });
 * ```
 *
 * @example
 * ### Rotating after logout
 * ```ts
 * router.post("/auth/logout", logoutHandler, rotateCsrfToken, (req, res) => {
 *   res.json({ message: "Logged out" });
 * });
 * ```
 *
 * @param req - Express {@link https://expressjs.com/en/api.html#req | Request} object.
 * @param res - Express {@link https://expressjs.com/en/api.html#res | Response} object.
 * @param next - Express {@link https://expressjs.com/en/guide/writing-middleware.html | NextFunction} callback.
 *
 * @see {@link csrfMiddleware} — sets the initial token.
 * @see {@link https://owasp.org/www-community/attacks/Session_fixation | OWASP — Session Fixation}
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