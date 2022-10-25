import { Request, Response } from "express";
import { CategoryService } from './category.service';
import { UserService } from '../user/user.service';
import { HttpStatus } from '../../utils/enums/http-status';
import { ForbiddenError } from '../../utils/errors/forbidden-error';
import { Roles } from '../../utils/enums/roles.enum';
import { CustomTypeOrmError } from '../../utils/errors/typeorm-error';
import { Category } from './entities/category.entity';

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly userService: UserService,
    ) {
        this.createCategory = this.createCategory.bind(this);
    }

    public async createCategory(req: Request, res: Response) {
        try {
            const userId: string = req.body.userId;
            const userRole: string | null = await this.userService
                .getUserRole(userId);

            if (!userRole) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }

            if (userRole === Roles.USER) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }
            
            const createdCategory: Category = await this.categoryService
                .createCategory(req.body);

            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                message: 'Categoria creada con exito!',
                data: createdCategory,
            });
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }
}