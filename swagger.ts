import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Store System API",
        description: "API REST del Store System",
    },
    host: "localhost:3000",
    basePath: "/api/v1",
    schemes: ["http"],
    securityDefinitions: {
        csrfToken: {
            type: "apiKey",
            in: "header",
            name: "x-csrf-token",
        },
    },
};

const outputFile = "./swagger-output.json";
const routes = [
    "./src/router/auth.router.ts",
    "./src/router/employee.router.ts",
    "./src/router/security.router.ts",
];

swaggerAutogen()(outputFile, routes, doc);
