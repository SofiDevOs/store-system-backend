import chalk from "chalk";
import express from "express";
import cookieParser from "cookie-parser";
import AuthRouter from "../router/auth.router";
import { csrfMiddleware, verifyCsrfToken } from "../middlewares/csrfMiddleware";
import { Response, Request } from "express";

/**
 * HTTP server that wires together Express middleware and route handlers.
 *
 * @remarks
 * The constructor calls {@link Server.middlewares | middlewares()} and
 * {@link Server.routes | routes()} in that order, so the instance is fully
 * configured by the time {@link Server.listen | listen()} is invoked.
 *
 * Middleware execution order:
 * 1. `express.json()` — body parsing
 * 2. `cookieParser()` — populates `req.cookies`
 * 3. {@link csrfMiddleware} — sets the CSRF cookie
 * 4. {@link verifyCsrfToken} — validates the token on mutating requests
 *
 * @example
 * ```ts
 * import { Server } from "./model/server";
 *
 * const server = new Server(8080);
 * server.listen();
 * ```
 *
 * @see {@link https://expressjs.com/en/api.html\#app | Express Application API}
 */
export class Server {
    /** Internal Express application instance. */
    private readonly app = express();

    /** TCP port the server will bind to. */
    private readonly port: number;

    /**
     * Map of route prefixes used by {@link Server.routes | routes()}.
     *
     * @remarks
     * Centralising paths here makes it easy to change version prefixes or
     * add new route groups without hunting through the codebase.
     */
    private pathsWeb = {
        home: "/",
        auth: "/api/v1/auth",
    };

    /**
     * Creates a new `Server` instance and configures middleware + routes.
     *
     * @param port - TCP port to listen on. Defaults to `3000`.
     */
    constructor(port: number = 3000) {
        this.port = port;
        this.middlewares();
        this.routes();
    }

    /**
     * Registers global middleware in the required order.
     *
     * @remarks
     * **Order matters** — `cookieParser` must run before any middleware that
     * reads `req.cookies` (e.g. {@link csrfMiddleware}).
     *
     * | # | Middleware | Purpose |
     * |---|-----------|---------|
     * | 1 | `express.json()` | Parses JSON request bodies |
     * | 2 | `cookieParser()` | Populates `req.cookies` |
     * | 3 | `csrfMiddleware` | Issues the CSRF cookie |
     * | 4 | `verifyCsrfToken` | Validates CSRF on `POST`/`PUT`/`DELETE`/`PATCH` |
     *
     * @see {@link csrfMiddleware}
     * @see {@link verifyCsrfToken}
     * @see {@link https://www.npmjs.com/package/cookie-parser | cookie-parser on npm}
     */
    private middlewares() {
        console.log(chalk.bgBlue.green("Executing middlewares..."));
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(csrfMiddleware);
        this.app.use(verifyCsrfToken);
    }

    /**
     * Mounts route handlers onto the Express application.
     *
     * @remarks
     * - `GET /` — Health-check / welcome endpoint.
     * - `/api/v1/auth` — Authentication routes delegated to {@link AuthRouter}.
     *
     * @see {@link https://expressjs.com/en/guide/routing.html | Express Routing Guide}
     */
    private routes() {
        this.app.get(this.pathsWeb.home, (req: Request, res: Response) => {
            res.json({
                "msg": "Welcome to Store System API"
            });
        });
        this.app.use(this.pathsWeb.auth, AuthRouter);
    }

    /**
     * Starts the HTTP server on the configured {@link Server.port | port}.
     *
     * @example
     * ```ts
     * const server = new Server(4000);
     * server.listen(); // → "Server running on port: http://localhost:4000"
     * ```
     *
     * @see {@link https://expressjs.com/en/api.html\#app.listen | app.listen()}
     */
    public listen() {
        this.app.listen(this.port, () => {
            console.log(
                chalk.bgBlue.green(
                    `Server running on port: http://localhost:${this.port}`,
                ),
            );
        });
    }
}
