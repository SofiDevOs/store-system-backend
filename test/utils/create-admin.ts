// tests/utils/create-admin.ts
import { prisma } from "../../prisma/src/index";

export async function createOrUpdateAdmin() {
    return prisma.user.upsert({
        where: { email: "test@admin.com" },
        update: {
            isVerified: true,
        },
        create: {
            email: "test@admin.com",
            password: "Password123!",
            role: "ADMIN",
            isVerified: true,
            employee: {
                create: {
                    name: "Jhon",
                    lastname: "Dev",
                    birthdate: new Date("1990-01-01"),
                    rfc: "ADMIN-MASTER-01",
                    nss: "00000000000",
                    address: "Store System Main Office",
                    salary: 0.0,
                    phone: "5551234567",
                },
            },
        },
        include: {
            employee: true,
        },
    });
}
