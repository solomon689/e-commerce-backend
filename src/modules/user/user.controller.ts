import { Request, Response } from "express";
import { UserService } from './user.service';
import { HttpStatus } from '../../utils/enums/http-status';
import { User } from './entities/user.entity';
import { CustomTypeOrmError } from '../../utils/errors/typeorm-error';
import { NotFoundError } from '../../utils/errors/not-found-error';

export class UserController {
    constructor(private readonly userService: UserService) {
        this.createUser = this.createUser.bind(this);
        this.findUserById = this.findUserById.bind(this);
        this.addProductToFavorite = this.addProductToFavorite.bind(this);
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

    public async findUserById(req: Request, res: Response) {
        try {
            const userId: string = req.params.userId;
            const foundedUser: User | null = await this.userService.findUserById(userId);
            
            if (!foundedUser) {
                return res.status(HttpStatus.NOT_FOUND).json(
                    new NotFoundError('El usuario solicitado no existe dentro de la base de datos').createResponse(),
                );
            }

            const { password, ...user } = foundedUser;

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Usuario encontrado con exito!',
                data: user,
            });
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }

    public async addProductToFavorite(req: Request, res: Response) {
        try {
            const userId: string = req.body.userId;
            const productId: string = req.body.productId;

            const savedProductToFavorite: User | null = await this.userService
                .addProductToUserFavorite(userId,productId);

            if (savedProductToFavorite) {
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    message: 'Producto agregado a favoritos con exito!',
                });
            }
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }
}