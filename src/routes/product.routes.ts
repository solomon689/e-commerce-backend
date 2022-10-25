import { Router } from 'express';
import { ProductController } from '../modules/product/product.controller';
import { ProductService } from '../modules/product/product.service';
import { verifyTokenMiddleware } from '../utils/middlewares/auth.middleware';
import { RoleService } from '../modules/roles/role.service';

const router: Router = Router();
const productController: ProductController = new ProductController(
    ProductService.getInstance(),
    RoleService.getInstance(),
);

router.post('/', [
    verifyTokenMiddleware,
]
, productController.createProduct);

router.get('/', [
    verifyTokenMiddleware,
] 
, productController.findProducts);

router.get('/:productId',[
    verifyTokenMiddleware,
]
, productController.findProductById);

router.put('/:productId',[
    verifyTokenMiddleware,
]
, productController.updateProduct);

router.delete('/:productId',[
    verifyTokenMiddleware,
]
, productController.deleteProduct);

export default router;