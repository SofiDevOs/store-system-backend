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

    beforeAll(async () => {
        const admin = await createOrUpdateAdmin();
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
            })
        expect(res.status).toBe(201);
    });
});
