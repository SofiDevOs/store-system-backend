import { prisma } from "../../config/prisma";
import {
    IAuthService,
    IUser,
    ILoginPost,
    IEmployeeInfo,
} from "./IAuth.interface";
import { NotFoundError, UnauthorizedError } from "../../helpers/errors/error";
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
        data: ILoginPost,
    ): Promise<Result<string, Error>> {
        const { email, password } = data;
        console.log(email);
        console.log(password);

        const user: IUser | null = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        console.log(user);

        if (!user) return Result.fail<string, Error>(new NotFoundError("user not found"));

        if (!user.isActive) return Result.fail<string, Error>(new UnauthorizedError("Usuario dado de baja"));

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return Result.fail<string, Error>(new UnauthorizedError("Credenciales inválidas"));

        return Result.ok<string, Error>("Usuario validado correctamente");
    }
    /**
     * Creates a new employee by atomically inserting both User and Employee records.
     *
     * Only users with ADMIN role are authorized to create new employees.
     * The method validates the requesting admin's credentials before proceeding.
     *
     * Uses a Prisma transaction to ensure that both the authentication record (User)
     * and HR record (Employee) are created together. If either creation fails,
     * the entire operation is rolled back to maintain data consistency.
     *
     * @param payload - The employee information including credentials and
     *   personal details (see {@link IEmployeeInfo}).
     * @param requestingAdminEmail - Email of the admin user requesting to create the employee.
     * @returns A `Result<void, Error>` that resolves to:
     *   - `Result.ok` with `void` on successful creation.
     *   - `Result.fail` with a {@link NotFoundError} if the admin user does not exist.
     *   - `Result.fail` with an {@link UnauthorizedError} if the requesting user is not an admin.
     *
     * @see {@link https://www.prismaio.com/docs/concepts/components/prisma-client/transactions#interactive-transactions Prisma Interactive Transactions}
     * @see {@link https://en.wikipedia.org/wiki/ACID Database ACID Properties}
     * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html OWASP Authorization Guidelines}
     * @see {@link https://www.prismaio.com/docs/concepts/database-connectors/postgresql#database-connection-url Database Connection}
     *
     * @example
     * ```ts
     * const authService = new AuthService();
     *
     * const result = await authService.createNewEmployee({
     *   email: "new.hire@company.com",
     *   password: "hashedPassword123",
     *   token: "verificationToken",
     *   tokenExpires: new Date("2026-03-01"),
     *   name: "Carlos",
     *   lastname: "Garcia",
     *   birthdate: "1990-08-20",
     *   rfc: "GARC900820XXX",
     *   nss: "98765432101",
     *   address: "456 Oak Ave",
     *   salary: 18000,
     * }, "admin@company.com");
     *
     * result.fold(
     *   () => console.log("Employee created successfully"),
     *   (error) => console.error(error.message),
     * );
     * ```
     */
    public async createNewEmployee(
        payload: IEmployeeInfo,
        requestingAdminEmail: string
    ): Promise<Result<void, Error>> {

        const admin = await prisma.user.findUnique({
            where: { email: requestingAdminEmail }
        });

        if (!admin) {
            return Result.fail(new NotFoundError("Admin user not found"));
        }

        if (admin.role !== "ADMIN") {
            return Result.fail(new UnauthorizedError("Only admin users can create new employees"));
        }

        try {
            await prisma.$transaction(async (tx) => {

                const user = await tx.user.create({
                    data: {
                        email: payload.email,
                        password: payload.password,
                        token: payload.token,
                        tokenExpires: payload.tokenExpires,
                    },
                });
                await tx.employee.create({
                    data: {
                        name: payload.name,
                        lastname: payload.lastname,
                        birthdate: new Date(payload.birthdate),
                        rfc: payload.rfc,
                        nss: payload.nss,
                        address: payload.address,
                        salary: payload.salary,
                        userId: user.id,
                    },
                });
            });

            return Result.ok<void, Error>(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
