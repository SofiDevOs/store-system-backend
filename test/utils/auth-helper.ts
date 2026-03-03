// tests/utils/auth-helper.ts
import request from "supertest";
import jwt from "jsonwebtoken";

export async function getAuthCookie(app: any, admin: any) {
    const res = await request(app).get("/api/v1/auth/csrf-token");

    const csrfToken = res.body.csrfToken;

    let cookies = res.headers["set-cookie"] || [];
    cookies = (cookies as any)
        .map((cookie: string) => cookie.split(";")[0])
        .join("; ");

    const token = jwt.sign(
        { email: admin.email, id: admin.id, role: admin.role },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: "1h" }
    );

    const cookie = cookies
        ? `${cookies}; token=${token}`
        : `token=${token}`;

    return { cookie, csrfToken };
}
