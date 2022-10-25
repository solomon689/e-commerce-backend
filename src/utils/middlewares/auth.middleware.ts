import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { HttpStatus } from '../enums/http-status';

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    
    if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'El token debe ser proporcionado',
        });
    }
    try {
        const isLogged: string | JwtPayload = jwt.verify(token, process.env.TOKEN_PASSWORD || '')
        
        req.body.userId = (isLogged as JwtPayload).id;
        req.body.userRoles = (isLogged as JwtPayload).roles;

        return next();
    } catch (error) {
        switch ((error as any).constructor) {
            case TokenExpiredError: {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Su sesión ha expirado',
                });
            }

            case JsonWebTokenError: {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: (error as any).message,
                });
            }

            default: {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Ha ocurrido un error inesperado',
                });
            }
        }
        
    }
}