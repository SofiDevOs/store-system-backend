import { Request, Response, NextFunction } from "express";
import { validationResult, Result } from "express-validator";

const validateProperties = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    next();
};
export { validateProperties };
