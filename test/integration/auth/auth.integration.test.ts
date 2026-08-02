import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";
import { Server } from "../../../src/model/server";
import { createOrUpdateAdmin } from "../../utils/create-admin";
import { getAuthCookie } from "../../utils/auth-helper";

vi.mock("../../../src/helpers/mailer", () => ({
    sendVerificationEmail: vi.fn().mockResolvedValue(true),
}));

describe("Register Employee", () => {
    const server = new Server(0);
    const app = server["app"];
    let csrfToken: string;
    let cookie: string;
    let admin: any;

    beforeAll(async () => {
        admin = await createOrUpdateAdmin();
        const auth = await getAuthCookie(app, admin);

        csrfToken = auth.csrfToken;
        cookie = auth.cookie;
    });

    it("should register a new Employee", async () => {
        const res = await request(app)
            .post("/api/v1/employees")
            .set("x-csrf-token", csrfToken)
            .set("Cookie", cookie)
            .send({
                role: "ADMIN",
                email: "test@example.com",
                name: "john",
                lastname: "doe",
                birthdate: "1995-04-15",
                rfc: "garc900101xxx",
                nss: "12345678901",
                address: "123 main st",
                salary: 15000,
                phone: "555-1234",
            });
        expect(res.status).toBe(201);
    });

    it("should update employee and user fields without Prisma validation errors", async () => {
        const employeeId = admin.employee?.id ?? admin.id;

        const res = await request(app)
            .put(`/api/v1/employees/${employeeId}`)
            .set("x-csrf-token", csrfToken)
            .set("Cookie", cookie)
            .send({
                name: "Juanito",
                lastname: "Perez",
                email: "updated-admin@example.com",
                isActive: true,
            });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ msg: "Employee updated successfully" });
    });
});
