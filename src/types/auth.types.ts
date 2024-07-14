import { Request } from 'express';
import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import { ParsedQs } from 'qs';


export interface CustomRequest extends Request {
    url: string;
    userId?: string;
}