import { EmployeeDTO } from "../../model/dtos/employee.dto";
import { EmployeeDetailDTO } from "../../model/dtos/employeeDetail.dto";
import { Result } from "../../shared/core/Result";

interface IEmployeeInfo {
    email: string;
    password?: string;
    token?: string;
    tokenExpires?: Date | null;
    role?: string;
    isActive?: boolean;
    isVerified?: boolean;

    name?: string;
    lastname?: string;
    birthdate?: string | Date;
    rfc?: string;
    nss?: string;
    address?: string;
    phone?: string;
    salary?: number;
    position?: string;
    department?: string;
    profileImage?: string;
}

interface IEmployeeService {
    create(data: IEmployeeInfo): Promise<Result<void, Error>>;
    getAll(): Promise<Result<EmployeeDTO[], Error>>;
    getById(employeeId: string): Promise<Result<EmployeeDetailDTO, Error>>;
    update(
        employeeId: string,
        updateData: Partial<IEmployeeInfo>
    ): Promise<Result<void, Error>>;
}

export { IEmployeeInfo, IEmployeeService };
