export interface EmployeeDetailDTO {
    id: string;
    name: string;
    lastname: string;
    department: string;
    profileImage?: string | null;
    createdAt: Date;
    email: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    phone?: string | null;
    address?: string | null;
    birthdate?: Date | null;
    rfc?: string | null;
    nss?: string | null;
    salary?: number | null;
    position?: string | null;
}
