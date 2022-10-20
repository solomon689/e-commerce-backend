import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { Product } from './entities/product.entity';
import { CustomTypeOrmError } from "../../utils/errors/typeorm-error";
import { HttpStatus } from '../../utils/enums/http-status';

export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) {
        this.createProduct = this.createProduct.bind(this);
    }

    public async createProduct(req: Request, res: Response) {
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
}