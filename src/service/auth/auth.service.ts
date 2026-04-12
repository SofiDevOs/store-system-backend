import { prisma } from "../../config/prisma";

import { IAuthService, ILoginPost, IAuthResponse } from "./IAuth.interface";
import {
    NotFoundError,
    UnauthorizedError,
} from "../../middlewares/errors/error";
import { Result } from "../../shared/core/Result";
import bcrypt from "bcryptjs";

/**
 * Service responsible for handling authentication and user management logic.
 *
 * Implements {@link IAuthService} to provide methods for validating user
 * credentials and creating new employee records.
 *
 * Uses the {@link Result} pattern to return success or failure outcomes
 * instead of throwing exceptions, enabling cleaner and more predictable
 * error handling across the application.
 *
 * @see {@link https://www.prismaio.com/docs/concepts/components/prisma-client/transactions Prisma Transactions}
 * @see {@link https://fsharpforfunandprofit.com/rop/ Railway Oriented Programming}
 *
 * @example
 * ```ts
 * const authService = new AuthService();
 *
 * // Validate a user login
 * const result = await authService.validateInfoUser({
 *   email: "john@example.com",
 *   password: "securePassword123",
 * });
 *
 * result.fold(
 *   (message) => console.log(message),  // "Usuario validado correctamente"
 *   (error) => console.error(error.message),
 * );
 *
 * // Create a new employee
 * const result = await authService.createNewEmployee({
 *   email: "jane@example.com",
 *   password: "anotherPassword",
 *   token: "abc123",
 *   tokenExpires: new Date("2026-12-31"),
 *   name: "Jane",
 *   lastname: "Doe",
 *   birthdate: "1995-04-15",
 *   rfc: "DODJ950415XXX",
 *   nss: "12345678901",
 *   address: "123 Main St",
 *   salary: 15000,
 * }, "admin@company.com");
 *
 * result.fold(
 *   () => console.log("Employee created successfully"),
 *   (error) => console.error(error.message),
 * );
 * ```
 */
export class AuthService implements IAuthService {
    constructor() {}

    /**
     * Validates user credentials by looking up the email in the database
     * and verifying that the account is active.
     *
     * Returns a {@link Result} instead of throwing exceptions, wrapping
     * either a success message or a domain error.
     *
     * @param data - The login payload containing email and password.
     * @returns A `Result<string, Error>` that resolves to:
     *   - `Result.ok` with `"Usuario validado correctamente"` on success.
     *   - `Result.fail` with a {@link NotFoundError} if the user does not exist.
     *   - `Result.fail` with an {@link UnauthorizedError} if the account is deactivated.
     *
     * @see {@link https://www.prismaio.com/docs/concepts/components/prisma-client/crud#read Prisma findUnique}
     * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html OWASP Authentication Guidelines}
     *
     * @example
     * ```ts
     * const authService = new AuthService();
     * const result = await authService.validateInfoUser({
     *   email: "user@company.com",
     *   password: "myPassword",
     * });
     *
     * result.fold(
     *   (message) => {
     *     // Success path
     *     console.log(message); // "Usuario validado correctamente"
     *   },
     *   (error) => {
     *     // Failure path — error is NotFoundError | UnauthorizedError
     *     console.error(error.message);
     *   },
     * );
     * ```
     */
    public async validateInfoUser(
        data: ILoginPost
    ): Promise<Result<IAuthResponse, Error>> {
        const { email, password } = data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user)
            return Result.fail<IAuthResponse, Error>(
                new NotFoundError("user not found")
            );
        if (!user.isActive)
            return Result.fail<IAuthResponse, Error>(
                new UnauthorizedError("Usuario dado de baja")
            );

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return Result.fail<IAuthResponse, Error>(
                new UnauthorizedError("Credenciales inválidas")
            );

        return Result.ok<IAuthResponse, Error>({
            id: user.id,
            role: user.role,
            email: user.email,
        });
    }

    public async verifyEmail(
        token: string,
        email: string
    ): Promise<Result<void, Error>> {
        try {
            await prisma.$transaction(async (tx: any) => {
                const user = await tx.user.findUnique({
                    where: { token, email },
                });

                if (!user) {
                    throw new NotFoundError("Token no válido");
                }

                await tx.user.update({
                    where: { id: user.id },
                    data: {
                        isVerified: true,
                        token: null,
                        tokenExpires: null,
                    },
                });
            });

            return Result.ok<void, Error>(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    public async resendVerificationToken(
        email: string
    ): Promise<Result<{ token: string; tempPassword: string }, Error>> {
        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return Result.fail(new NotFoundError("Usuario no encontrado"));
            }

            if (user.isVerified) {
                return Result.fail(new Error("El usuario ya está verificado"));
            }

            const { JWT } = await import("../../helpers/jwt");
            const { generateTempPassword } =
                await import("../../helpers/temporalPassword");
            const tempPassword = generateTempPassword(12);

            const token = await JWT.generateJWT({
                email: user.email,
            });
            if (!token) {
                return Result.fail(new Error("Error al generar el token"));
            }
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    token,
                    tokenExpires: new Date(Date.now() + 2 * 60 * 60 * 1000),
                    password: hashedPassword,
                },
            });
            return Result.ok<{ token: string; tempPassword: string }, Error>({
                token,
                tempPassword,
            });
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
