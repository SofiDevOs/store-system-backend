import { Router, Request, Response } from "express";

const securityRouter = Router();

securityRouter.get("/csrf-token", (req: Request, res: Response) => {
    res.json({ csrfToken: req.csrfToken });
});

export default securityRouter;
