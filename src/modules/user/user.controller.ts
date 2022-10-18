import { Request, Response } from "express";
import { UserService } from './user.service';
import { HttpStatus } from '../../utils/enums/http-status';
import { User } from './entities/user.entity';

export class UserController {
    constructor(private readonly userService: UserService) {
        this.createUser = this.createUser.bind(this);
    }

    public async createUser(req: Request, res: Response) {
        try {
            const savedUser: User = await this.userService.createUser(req.body);
            const {password, ...user} = savedUser; 

            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                message: 'Usuario creado con exito!',
                data: user,
            });
        } catch (error) {
            console.error('error =>', error);
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                mesagge: 'Error de formato',
            });
        }
    }
}