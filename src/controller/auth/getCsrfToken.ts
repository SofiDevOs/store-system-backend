import {Request, Response} from "express"

// interface Icsrf extends Request{csrfToken?: string}

export const getCsrfToken = (req:Request, res:Response)=>{
    res.json({
        csrfToken: req.csrfToken
    })
}