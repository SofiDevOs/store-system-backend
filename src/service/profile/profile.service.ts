import { prisma } from "../../config/prisma";
import { Result } from "../../shared/core/Result";
import { NotFoundError } from "../../middlewares/errors/error";
import { IProfileResponse, IProfileService } from "./IProfile.interface";
import { uploadImageToCloudinary } from "../../helpers/cloudinary";

export class ProfileService implements IProfileService {
    public async getProfile(
        userId: string
    ): Promise<Result<IProfileResponse, Error>> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    employee: {
                        select: {
                            name: true,
                            lastname: true,
                            profileImage: true,
                            position: true,
                            department: true,
                        },
                    },
                },
            });

            if (!user || !user.employee) {
                return Result.fail(new NotFoundError("Usuario no encontrado"));
            }

            return Result.ok<IProfileResponse, Error>({
                id: user.id,
                email: user.email,
                role: user.role as IProfileResponse["role"],
                name: user.employee.name,
                lastname: user.employee.lastname,
                profileImage: user.employee.profileImage,
                position: user.employee.position,
                department: user.employee.department,
            });
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    public async updateProfilePhoto(
        userId: string,
        imageBuffer: Buffer
    ): Promise<Result<void, Error>> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    employee: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            if (!user || !user?.employee) {
                return Result.fail(new NotFoundError("Usuario no encontrado"));
            }
            const imageUrl = await uploadImageToCloudinary(
                imageBuffer,
                "store-system"
            );
            await prisma.employee.update({
                where: { id: user.employee.id },
                data: { profileImage: imageUrl },
            });
            return Result.ok<void, Error>(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
