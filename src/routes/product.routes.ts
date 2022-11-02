import { Router } from 'express';
import { ProductController } from '../modules/product/product.controller';
import { ProductService } from '../modules/product/product.service';
import { verifyTokenMiddleware, roleExistMiddleware } from '../utils/middlewares/auth.middleware';
import multer from 'multer';
import { CloudinaryService } from '../utils/services/cloudinary.service';

const upload = multer({ dest: './tmp/' });
const router: Router = Router();
const productController: ProductController = new ProductController(
    ProductService.getInstance(),
);

router.post('/', [
    upload.single('product_img'),
    verifyTokenMiddleware,
    roleExistMiddleware,
]
, productController.createProduct);

router.get('/', productController.findProducts);

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