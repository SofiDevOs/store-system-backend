import { Request, Response } from "express";
import { IEmployeeService } from "../../service/employee/IEmployee.interface";
import { sendVerificationEmail } from "../../helpers/mailer";
import { JWT } from "../../helpers/jwt";
import { generateTempPassword } from "../../helpers/temporalPassword";

import { uploadImageToCloudinary } from "../../helpers/cloudinary";

export class EmployeeController {
    constructor(private readonly employeeService: IEmployeeService) {}

    public getAll = async (req: Request, res: Response) => {
        const result = await this.employeeService.getAll();
        result.fold(
            (employees) => res.json(employees),
            (error) => {
                throw error;
            }
        );
    };

    public create = async (req: Request, res: Response) => {
        const formData = req.body;
        const tempPassword = generateTempPassword(12);
        let profileImageUrl: string | undefined = undefined;
        const file = (req as any).file;
        if (file) {
            try {
                profileImageUrl = await uploadImageToCloudinary(
                    file.buffer,
                    "store0system"
                );
            } catch (error) {
                return res
                    .status(500)
                    .json({ message: "Error uploading profile image" });
            }
        }

        const token = await JWT.generateJWT({
            email: formData.email as string,
            name: formData.name as string,
            lastName: formData.lastName as string,
        });

        const result = await this.employeeService.create({
            ...formData,
            salary: Number(formData.salary),
            profileImage: profileImageUrl,
            token: token!,
            tokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            password: tempPassword,
        });

        result.fold(
            async () => {
                try {
                    await sendVerificationEmail(
                        formData.email,
                        token!,
                        tempPassword
                    );
                } catch (emailError) {
                    console.error(
                        "Error al enviar el correo de verificación:",
                        emailError
                    );
                }
                res.status(201);
                res.json({ msg: "Employee created successfully" });
            },
            (error) => {
                throw error;
            }
        );
    };

    public update = async (req: Request, res: Response) => {
        const employeeId = req.params.id as string;
        const updateData = req.body;
        const result = await this.employeeService.update(
            employeeId,
            updateData
        );

        result.fold(
            () => res.json({ msg: "Employee updated successfully" }),
            (error) => {
                throw error;
            }
        );
    };

    public getById = async (req: Request, res: Response) => {
        const employeeId = req.params.id as string;
        const result = await this.employeeService.getById(employeeId);
        result.fold(
            (employee) => res.json(employee),
            (error) => {
                throw error;
            }
        );
    };
}
