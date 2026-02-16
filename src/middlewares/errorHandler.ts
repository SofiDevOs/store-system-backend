import { HttpError } from "../helpers/errors/error";
import { Request, Response, NextFunction } from "express";
export const errorHandler = (
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (error instanceof HttpError) {
        return res.status(error.httpCode).json({
            status: error.httpCode,
            name: error.name,
            msg: error.message,
        });
    }

    res.status(500).json({
        status: 500,
        name: "InternalServerError",
        msg: "An unexpected error occurred",
    });
};
