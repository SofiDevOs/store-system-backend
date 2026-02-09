interface ILoginPost {
    email: string;
    password: string;
}

interface IUser {
    id: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    token: string | null;
    tokenExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

interface IEmployeeInfo {
    email: string;
    password: string;
    token: string;
    tokenExpires: Date;

    name: string;
    lastname: string;
    birthdate: string;
    rfc: string;
    nss: string;
    address: string;
    salary: number;
}

interface IAuthService {
    validateInfoUser(data: ILoginPost): Promise<void>;
    createNewEmployee(data: IEmployeeInfo): Promise<void>;
}

export { ILoginPost, IAuthService, IUser, IEmployeeInfo };
