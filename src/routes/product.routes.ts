import { Router } from 'express';
import { ProductController } from '../modules/product/product.controller';
import { ProductService } from '../modules/product/product.service';

const router: Router = Router();
const productController: ProductController = new ProductController(
    ProductService.getInstance(),
);

router.post('/', productController.createProduct);

export default router;