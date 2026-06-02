import { prisma } from "../../config/prisma";
import { Result } from "../../shared/core/Result";
import { EmployeeNotFoundError } from "./_errors";
import { IEmployeeInfo, IEmployeeService } from "./IEmployee.interface";
import type { EmployeeDTO } from "../../model/dtos/employee.dto";
import type { EmployeeDetailDTO } from "../../model/dtos/employeeDetail.dto";
/**
 * Service responsible for managing employee-related business logic.
 *
 * Implements {@link IEmployeeService} to provide operations scoped exclusively
 * to the employee domain, keeping concerns separated from authentication logic.
 *
 * Uses the {@link Result} pattern to return success or failure outcomes
 * instead of throwing exceptions, enabling predictable error handling.
 *
 * @see {@link https://fsharpforfunandprofit.com/rop/ Railway Oriented Programming}
 */
export class EmployeeService implements IEmployeeService {
    /**
     * Creates a new employee by atomically inserting both a `User` (auth record)
     * and an `Employee` (HR record) within a single Prisma transaction.
     *
     * If either creation fails, the entire transaction is rolled back to preserve
     * data consistency.
     *
     * @param payload - The employee data including credentials and personal details.
     *   See {@link IEmployeeInfo} for the full shape.
     * @returns A `Result<void, Error>` that resolves to:
     *   - `Result.ok` with `void` on successful creation.
     *   - `Result.fail` with the underlying `Error` if the transaction fails.
     *
     * @see {@link https://www.prismaio.com/docs/concepts/components/prisma-client/transactions#interactive-transactions Prisma Interactive Transactions}
     * @see {@link https://en.wikipedia.org/wiki/ACID Database ACID Properties}
     *
     * @example
     * ```ts
     * const employeeService = new EmployeeService();
     *
     * const result = await employeeService.createNewEmployee({
     *   email: "jane.doe@company.com",
     *   password: "hashedPassword123",
     *   token: "verificationToken",
     *   tokenExpires: new Date("2026-12-31"),
     *   name: "Jane",
     *   lastname: "Doe",
     *   birthdate: "1995-04-15",
     *   rfc: "DODJ950415XXX",
     *   nss: "12345678901",
     *   address: "123 Main St",
     *   salary: 15000,
     * });
     *
     * result.fold(
     *   () => console.log("Employee created successfully"),
     *   (error) => console.error(error.message),
     * );
     * ```
     */
    public async create(payload: IEmployeeInfo): Promise<Result<void, Error>> {
        try {
            await prisma.$transaction(async (tx: any) => {
                const user = await tx.user.create({
                    data: {
                        email: payload.email,
                        password: payload.password,
                        role: payload.role,
                        token: payload.token,
                        tokenExpires: payload.tokenExpires,
                    },
                });
                await tx.employee.create({
                    data: {
                        name: payload.name,
                        lastname: payload.lastname,
                        birthdate: new Date(payload.birthdate),
                        nss: payload.nss,
                        rfc: payload.rfc,
                        address: payload.address,
                        phone: payload.phone,
                        salary: payload.salary,
                        position: payload.position,
                        department: payload.department,
                        profileImage: payload.profileImage,
                        userId: user.id,
                    },
                });
            });

            return Result.ok<void, Error>(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
    public async getAll(): Promise<Result<EmployeeDTO[], Error>> {
        try {
            const employees = await prisma.employee.findMany({
                select: {
                    id: true,
                    name: true,
                    lastname: true,
                    profileImage: true,
                    department: true,
                    createdAt: true,
                    user: {
                        select: {
                            email: true,
                            role: true,
                            isActive: true,
                            isVerified: true,
                        },
                    },
                },
            });
            const employeeDTOs: EmployeeDTO[] = employees.map((employee) => ({
                id: employee.id,
                name: employee?.name,
                lastname: employee?.lastname,
                profileImage: employee?.profileImage || "",
                department: employee?.department || "",
                createdAt: employee?.createdAt || new Date(),
                email: employee.user.email,
                role: employee.user.role,
                isActive: employee?.user?.isActive,
                isVerified: employee?.user?.isVerified,
            }));
            return Result.ok(employeeDTOs);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    public async getById(
        employeeId: string
    ): Promise<Result<EmployeeDetailDTO, Error>> {
        try {
            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
                select: {
                    id: true,
                    name: true,
                    lastname: true,
                    profileImage: true,
                    department: true,
                    createdAt: true,
                    salary: true,
                    position: true,
                    rfc: true,
                    nss: true,
                    address: true,
                    phone: true,
                    birthdate: true,
                    user: {
                        select: {
                            email: true,
                            role: true,
                            isActive: true,
                            isVerified: true,
                        },
                    },
                },
            });
            if (!employee) {
                return Result.fail(new EmployeeNotFoundError(employeeId));
            }
            const employeeInfo: EmployeeDetailDTO = {
                role: employee.user.role,
                isVerified: employee.user.isVerified,
                isActive: employee.user.isActive,
                email: employee.user.email,
                id: employee.id,
                createdAt: employee.createdAt,
                name: employee.name,
                lastname: employee.lastname,
                salary: employee?.salary || 0,
                position: employee?.position || "",
                department: employee?.department || "",
                profileImage: employee?.profileImage || "",
                rfc: employee?.rfc || "",
                nss: employee?.nss || "",
                address: employee?.address || "",
                phone: employee?.phone || "",
                birthdate: employee?.birthdate || new Date(),
            };
            return Result.ok<EmployeeDetailDTO, Error>(employeeInfo);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
    public async update(
        employeeId: string,
        updateData: Partial<IEmployeeInfo>
    ): Promise<Result<void, Error>> {
        console.log(updateData);
        try {
            await prisma.employee.update({
                where: { id: employeeId },
                data: { ...updateData },
            });
            return Result.ok<void, Error>(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
