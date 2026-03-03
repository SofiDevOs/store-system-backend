import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";
import { Server } from "../../../src/model/server";
import { createOrUpdateAdmin } from "../../utils/create-admin";
import { getAuthCookie } from "../../utils/auth-helper";
vi.mock("../../../src/helpers/mailer", () => ({
    sendVerificationEmail: vi.fn().mockResolvedValue(true), // Simula que el correo se envió con éxito
}));

describe("Register Employee", () => {
    const server = new Server(0);
    const app = server["app"];
    let csrfToken: string;
    let cookie: string;

    beforeAll(async () => {
        const admin = await createOrUpdateAdmin();
        const auth = await getAuthCookie(app, admin);
        csrfToken = auth.csrfToken;
        cookie = auth.cookie;
    });

    it("should register a new Employee", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .set("x-csrf-token", csrfToken)
            .set("Cookie", cookie)
            .send({
                email: "test@example.com",
                password: "Password123!",
                name: "John",
                lastname: "Doe",
                birthdate: "01/01/1990",
                rfc: "GARC900101XXX",
                nss: "12345678901",
                address: "123 Main St",
                salary: 15000,
            }).expect(201);
    });
});
