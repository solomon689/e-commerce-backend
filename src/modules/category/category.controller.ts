import { Request, Response } from "express";
import { CategoryService } from './category.service';
import { UserService } from '../user/user.service';
import { HttpStatus } from '../../utils/enums/http-status';
import { ForbiddenError } from '../../utils/errors/forbidden-error';
import { Roles } from '../../utils/enums/roles.enum';
import { CustomTypeOrmError } from '../../utils/errors/typeorm-error';
import { Category } from './entities/category.entity';
import { RoleService } from '../roles/role.service';
import { DeleteResult, UpdateResult } from 'typeorm';

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
    ) {
        this.createCategory = this.createCategory.bind(this);
        this.findCategories = this.findCategories.bind(this);
        this.findCategoryById = this.findCategoryById.bind(this);
        this.deleteCategoryById = this.deleteCategoryById.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
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

    public async findCategories(req: Request, res: Response) {
        try {
            const userId: string = req.body.userId;
            const userRole: string | null = await this.userService.getUserRole(userId);

            if (!userRole) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }

            const roleExist: boolean = await this.roleService.verifyRole(userRole);

            if (!roleExist) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }

            const foundedCategories: Category[] = await this.categoryService.findCategories();
            
            if (foundedCategories.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).json();
            }

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Categorias encontradas con exito!',
                data: foundedCategories,
            });
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }

    public async findCategoryById(req: Request, res: Response) {
        try {
            const categoryId: string = req.params.categoryId;
            const userId: string = req.body.userId;
            const userRole: string | null = await this.userService.getUserRole(userId);

            if (!userRole) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }

            const roleExist: boolean = await this.roleService.verifyRole(userRole);

            if (!roleExist) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }

            const foundedCategory: Category | null = await this.categoryService
                .findCategoryById(categoryId);

            if (!foundedCategory) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Categoria no existe',
                });
            }

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Categoria encontrada con exito!',
                data: foundedCategory,
            });
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);
 
            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }

    public async deleteCategoryById(req: Request, res: Response) {
        try {
            const categoryId: string = req.params.categoryId;
            const userId: string = req.body.userId;
            const userRole: string | null = await this.userService.getUserRole(userId);

            if (!userRole) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }

            const roleExist: boolean = await this.roleService.verifyRole(userRole);

            if (!roleExist) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }

            const deletedCategory: DeleteResult = await this.categoryService
                .deleteCategoryById(categoryId);

            if (deletedCategory.affected === 0) {
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    message: 'Se ha realizado la petición pero ninguna categoria fue afectada',
                });
            } else {
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    message: 'Categoria eliminada con exito!',
                });
            }
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }

    public async updateCategory(req: Request, res: Response) {
        try {
            const categoryId: string = req.params.categoryId;
            const userId: string = req.body.userId;
            const userRole: string | null = await this.userService.getUserRole(userId);

            if (!userRole) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }

            const roleExist: boolean = await this.roleService.verifyRole(userRole);

            if (!roleExist) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }

            const updatedCategory: Category = await this.categoryService
                .updateCategory(req.body);

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Categoria actualizada con exito!',
            });
            
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }
}