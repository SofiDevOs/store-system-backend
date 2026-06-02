export type EmployeeDTO = {
    id: string;
    role: string;
    isActive: boolean;
    name: string;
    lastname: string;
    department: string;
    profileImage?: string | null;
    createdAt: Date;
};
