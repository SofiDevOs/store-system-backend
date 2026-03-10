import { Result } from "../../shared/core/Result";

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
    profileImage: string;
}

interface IAuthResponse {
    id: string;
    role: string;
    email: string;
}

interface IAuthService {
    validateInfoUser(data: ILoginPost): Promise<Result<IAuthResponse, Error>>;
    createNewEmployee(data: IEmployeeInfo): Promise<Result<void, Error>>;
    verifyEmail(token: string, email: string): Promise<Result<void, Error>>;
    resendVerificationToken(
        email: string
    ): Promise<Result<{ token: string; tempPassword: string }, Error>>;
}

export { ILoginPost, IAuthService, IUser, IEmployeeInfo, IAuthResponse };
