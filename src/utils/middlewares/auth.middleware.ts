import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { HttpStatus } from '../enums/http-status';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { InternalServerError } from '../errors/internal-server-error';

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    
    if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json(
            new UnauthorizedError('El token debe ser proporcionado').createResponse(),
        );
    }
    try {
        const isLogged: string | JwtPayload = jwt.verify(token, process.env.TOKEN_PASSWORD || '')
        
        req.body.userId = (isLogged as JwtPayload).id;
        req.body.userRoles = (isLogged as JwtPayload).roles;

        return next();
    } catch (error) {
        switch ((error as any).constructor) {
            case TokenExpiredError: {
                return res.status(HttpStatus.UNAUTHORIZED).json(
                    new UnauthorizedError('Su sesión ha expirado').createResponse(),
                );
            }

            case JsonWebTokenError: {
                return res.status(HttpStatus.UNAUTHORIZED).json(
                    new UnauthorizedError('Su sesión ha expirado').createResponse(),
                );
            }

            default: {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                    new InternalServerError().createResponse(),
                );
            }
        }
        
    }
}