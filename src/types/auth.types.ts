import { Request } from 'express';
import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';


export interface CustomRequest extends Request {
    url: string;
    userId?: string;
}