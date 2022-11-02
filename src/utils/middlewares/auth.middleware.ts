import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { HttpStatus } from '../enums/http-status';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { InternalServerError } from '../errors/internal-server-error';
import { ForbiddenError } from '../errors/forbidden-error';
import { UserService } from '../../modules/user/user.service';
import { RoleService } from '../../modules/roles/role.service';
import { CustomTypeOrmError } from '../errors/typeorm-error';

const userService: UserService = UserService.getInstance();
const roleService: RoleService = RoleService.getInstance();

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

export const roleExistMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.body.userId;
        const userRole: string | null = await userService.getUserRole(userId);

        if (!userRole) {
            return res.status(HttpStatus.FORBIDDEN).json(
                new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
            );
        }

        const roleExist: boolean = await roleService.verifyRole(userRole);
        
        if (!roleExist) {
            return res.status(HttpStatus.FORBIDDEN).json(
                new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
            );
        }

        req.body.userRole = userRole;

        return next();
    } catch (error) {
        console.error(error);
        const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

        return res.status(typeormError.statusCode).json(typeormError.createResponse());
    }
}