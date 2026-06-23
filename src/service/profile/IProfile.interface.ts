import { Result } from "../../shared/core/Result";
import { IAuthResponse } from "../auth/IAuth.interface";

interface IProfileResponse extends IAuthResponse {
    name: string;
    lastname: string;
    profileImage: string | null;
    position: string | null;
    department: string | null;
}

interface IProfileService {
    getProfile(userId: string): Promise<Result<IProfileResponse, Error>>;

    updateProfilePhoto(
        userId: string,
        imageBuffer: Buffer
    ): Promise<Result<void, Error>>;
}

export { IProfileResponse, IProfileService };
