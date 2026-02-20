import {Request, Response, NextFunction} from  'express';
import { JwtUser } from '../types/user.type';
import { JWT } from '../helpers/jwt';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded =  await JWT.validateToken<JwtUser>(token) ;
    if (!decoded) {
        throw new Error("No decoded value found");
    }else{
        req.user =  decoded;
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
