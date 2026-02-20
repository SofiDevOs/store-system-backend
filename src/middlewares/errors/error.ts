export class HttpError extends Error {
    public httpCode: number;
    constructor(message: string, httpCode: number) {
        super(message);
        this.httpCode = httpCode;
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message, 404);
    }
}
export class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(message, 403);
    }
}
