import { Router } from 'express';
import { ProductController } from '../modules/product/product.controller';
import { ProductService } from '../modules/product/product.service';
import { verifyTokenMiddleware, roleExistMiddleware } from '../utils/middlewares/auth.middleware';
import { RoleService } from '../modules/roles/role.service';
import { UserService } from '../modules/user/user.service';

const router: Router = Router();
const productController: ProductController = new ProductController(
    ProductService.getInstance(),
);

router.post('/', [
    verifyTokenMiddleware,
    roleExistMiddleware,
]
, productController.createProduct);

router.get('/', [
    verifyTokenMiddleware,
    roleExistMiddleware,
] 
, productController.findProducts);

router.get('/:productId',[
    verifyTokenMiddleware,
    roleExistMiddleware,
]
, productController.findProductById);

router.put('/:productId',[
    verifyTokenMiddleware,
    roleExistMiddleware,
]
, productController.updateProduct);

router.delete('/:productId',[
    verifyTokenMiddleware,
    roleExistMiddleware,
]
, productController.deleteProduct);

export default router;