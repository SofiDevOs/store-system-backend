import { join } from "path";
import { config } from "dotenv";
// import { prisma } from "./src/index";
import { prisma } from "../src/config/prisma";
async function main() {
    if (process.env.NODE_ENV === "production") {
        console.error(
            "Critical: Seed script is blocked in production environment.",
        );
        return;
    }

    const logData = {
        adminEmail: "mail@sofi.dev",
        password: "sofievO",
    };

    console.log("Iniciando siembra de datos para @store-system...");

    const firstAdmin = await prisma.user.upsert({
        where: { email: logData.adminEmail },
        update: {
            // if admin exists, update it
            isActive: true,
            isVerified: true,
        },
        create: {
            email: logData.adminEmail,
            password: logData.password,
            role: "ADMIN",
            isActive: true,
            isVerified: true,
            employee: {
                create: {
                    name: "Sofi",
                    lastname: "Dev",
                    birthdate: new Date("1990-01-01"),
                    rfc: "ADMIN-MASTER-01",
                    nss: "00000000000",
                    address: "Store System Main Office",
                    salary: 0.0,
                },
            },
        },
    });

    console.log(`Seed ready: Admin ${firstAdmin.email} is set up.`);
}

main().catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
});
