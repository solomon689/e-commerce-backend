import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { Product } from './entities/product.entity';
import { CustomTypeOrmError } from "../../utils/errors/typeorm-error";
import { HttpStatus } from '../../utils/enums/http-status';
import { DeleteResult } from 'typeorm';
import { Roles } from '../../utils/enums/roles.enum';
import { ForbiddenError } from '../../utils/errors/forbidden-error';
import { BadRequestError } from '../../utils/errors/bad-request-error';

export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) {
        this.createProduct = this.createProduct.bind(this);
        this.findProducts = this.findProducts.bind(this);
        this.findProductById = this.findProductById.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    public async createProduct(req: Request, res: Response) {
        try {
            const userRole: string = req.body.userRole;
            const product: any = JSON.parse(req.body.data);

            if (userRole != Roles.ADMINISTRATOR) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse(),
                );
            }
            
            const createdProduct: Product = await this.productService
                .createProduct(product, req.file?.path);
            
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
            const page: number = parseInt(req.query.page as string || '1');
            const products: Product[] = await this.productService
                .findProducts(page);
            
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
        const productId: string = req.params.productId;

        if (userRole === Roles.USER) {
            return res.status(HttpStatus.FORBIDDEN).json(
                new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse()
            );
        }

        if (!productId) return res.status(HttpStatus.BAD_REQUEST).json(
            new BadRequestError('Debe ingresar el id del producto').createResponse(),
        )

        try {
            const updatedProduct: Product = await this.productService.updateProduct(productId, req.body);

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
        try {
            const userRole: string = req.body.userRole;

            if (userRole === Roles.USER) {
                return res.status(HttpStatus.FORBIDDEN).json(
                    new ForbiddenError('No tiene permisos para ejecutar esta acción').createResponse()
                );
            }

            const productId: string = req.params.productId;

            if (!productId) {
                return res.status(HttpStatus.BAD_REQUEST).json(
                    new BadRequestError('Debe de ingresar el id del producto').createResponse(),
                );
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