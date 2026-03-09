import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Store System API",
        description: "end points del store system XD",
    },
    host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["./src/router/auth.router.ts"];

swaggerAutogen()(outputFile, routes, doc);
