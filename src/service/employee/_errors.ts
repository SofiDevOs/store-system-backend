import { NotFoundError } from "../../middlewares/errors/error";

export class EmployeeNotFoundError extends NotFoundError {
    constructor(employeeId: string) {
        super(`Employee with ID ${employeeId} not found`);
        console.error(`Employee with ID ${employeeId} not found`);
    }
}
