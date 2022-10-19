import { Request, Response } from "express";
import { UserService } from './user.service';
import { HttpStatus } from '../../utils/enums/http-status';
import { User } from './entities/user.entity';
import { CustomTypeOrmError } from '../../utils/errors/typeorm-error';

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
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }
}