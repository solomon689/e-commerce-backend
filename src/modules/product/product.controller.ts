import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { Product } from './entities/product.entity';
import { CustomTypeOrmError } from "../../utils/errors/typeorm-error";
import { HttpStatus } from '../../utils/enums/http-status';
import { UpdateResult, DeleteResult } from 'typeorm';
import { RoleService } from '../roles/role.service';
import { Roles } from '../../utils/enums/roles.enum';
import { Role } from '../roles/roles.entity';

export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly roleService: RoleService,
    ) {
        this.createProduct = this.createProduct.bind(this);
        this.findProducts = this.findProducts.bind(this);
        this.findProductById = this.findProductById.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    public async createProduct(req: Request, res: Response) {
        const userRole: string = req.body.userRole;

        if (userRole != Roles.ADMINISTRATOR) {
            return res.status(HttpStatus.FORBIDDEN).json({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'No tiene permisos para ejecutar esta acción',
            });
        }

        try {
            const createdProduct: Product = await this.productService
                .createProduct(req.body);
            
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                message: 'Producto creado con exito!',
                data: createdProduct,
            });
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }

    public async findProducts(req: Request, res: Response) {
        try {
            const products: Product[] = await this.productService
                .findProducts({ details: true });

            if (!products) {
                return res.status(HttpStatus.NO_CONTENT).json();
            }

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Productos encontrados con exito!',
                data: products,
            });
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }

    public async findProductById(req: Request, res: Response) {
        try {
            const productId: string = req.params.productId;
            const product: Product | null = await this.productService
                .findProductById(productId, {
                    details: true,
                });

            if (!product) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'El producto no existe',
                });
            }

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Producto encontrado con exito!',
                data: product,
            });
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);
            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }

    public async updateProduct(req: Request, res: Response) {
        const userRole: string = req.body.userRole;

        if (userRole === Roles.USER) {
            return res.status(HttpStatus.FORBIDDEN).json({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'No tiene permisos para ejecutar esta acción',
            });
        }

        try {
            const productId: string = req.params.productId;

            if (!productId) return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Debe ingresar el id del producto',
            })

            const updatedProduct: UpdateResult = await this.productService.updateProduct(productId, req.body);

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Producto actualizado con exito!',
            });
        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }

    public async deleteProduct(req: Request, res: Response) {
        const userRole: string = req.body.userRole;

        if (userRole === Roles.USER) {
            return res.status(HttpStatus.FORBIDDEN).json({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'No tiene permisos para ejecutar esta acción',
            });
        }

        try {
            const productId: string = req.params.productId;

            if (!productId) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Debe de ingresar el id del producto',
                });
            }

            const deletedProduct: DeleteResult = await this.productService
                .deleteProductById(productId);

            if (deletedProduct?.affected && deletedProduct?.affected > 0) {
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    message: 'Producto eliminado con exito!',
                });
            } else {
                if (deletedProduct?.affected && deletedProduct?.affected === 0) {
                    return res.status(HttpStatus.OK).json({
                        statusCode: HttpStatus.OK,
                        message: 'La petición fue realizada pero ningún producto fue afectado',
                    })
                }
            }

        } catch (error) {
            console.error(error);
            const typeormError: CustomTypeOrmError = new CustomTypeOrmError(error);

            return res.status(typeormError.statusCode).json(typeormError.createResponse());
        }
    }
}