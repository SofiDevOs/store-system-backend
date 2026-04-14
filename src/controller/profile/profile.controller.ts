import { Request, Response } from "express";
import { IProfileService } from "../../service/profile/IProfile.interface";

export class ProfileController {
    constructor(private readonly profileService: IProfileService) {}

    public getProfile = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const result = await this.profileService.getProfile(userId);

        result.fold(
            (profile) => res.json(profile),
            (error) => {
                throw error;
            }
        );
    };
}
