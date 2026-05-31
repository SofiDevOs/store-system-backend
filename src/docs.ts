export const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Store System API",
        description: "end points del store system XD",
        version: "1.0.0",
    },
    paths: {
        "/auth/csrf-token": {
            get: {
                summary: "Obtener un token CSRF",
                tags: ["CSRF"],
                responses: {
                    "200": {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        csrfToken: {
                                            type: "string",
                                            example:
                                                "c200*********************************",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/login": {
            post: {
                summary: "Create a new Employee",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            type: "object",
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                    },
                                    password: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        msg: {
                                            type: "string",
                                            example: "login exitoso",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Bad Request",
                    },
                },
            },
        },
        "/auth/register": {
            post: {
                description: "",
                responses: {
                    "400": {
                        description: "Bad Request",
                    },
                    "401": {
                        description: "Unauthorized",
                    },
                    "403": {
                        description: "Forbidden",
                    },
                },
            },
        },
    },
};
