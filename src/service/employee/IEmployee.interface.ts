import { Result } from "../../shared/core/Result";

interface IEmployeeInfo {
    email: string;
    password: string;
    token: string;
    tokenExpires: Date;
    role: string;

    name: string;
    lastname: string;
    birthdate: string;
    rfc: string;
    nss: string;
    address: string;
    phone: string;
    salary: number;
    position?: string;
    department?: string;
    profileImage?: string;
}

interface IEmployeeService {
    create(data: IEmployeeInfo): Promise<Result<void, Error>>;
    getAll(): Promise<Result<IEmployeeInfo[], Error>>;
    getById(employeeId: string): Promise<Result<IEmployeeInfo, Error>>;
    update(
        employeeId: string,
        updateData: Partial<IEmployeeInfo>
    ): Promise<Result<void, Error>>;
}

export { IEmployeeInfo, IEmployeeService };
