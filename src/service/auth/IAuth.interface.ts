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

interface IAuthResponse {
    id: string;
    role: string;
    email: string;
}

interface IAuthService {
    validateInfoUser(data: ILoginPost): Promise<Result<IAuthResponse, Error>>;
    verifyEmail(token: string, email: string): Promise<Result<void, Error>>;
    resendVerificationToken(
        email: string
    ): Promise<Result<{ token: string; tempPassword: string }, Error>>;
}

export { ILoginPost, IAuthService, IUser, IAuthResponse };
