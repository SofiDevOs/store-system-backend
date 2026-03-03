import { NextFunction, Request, Response } from "express";

export const ensureAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (userRole !== "ADMIN") {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
}
