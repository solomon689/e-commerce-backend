import { Router } from "express";
import { CategoryController } from '../modules/category/category.controller';
import { CategoryService } from "../modules/category/category.service";
import { UserService } from '../modules/user/user.service';
import { verifyTokenMiddleware } from '../utils/middlewares/auth.middleware';

const router: Router = Router();
const categoryController: CategoryController = new CategoryController(
    CategoryService.getInstance(),
    UserService.getInstance(),
);

router.post('/', [
    verifyTokenMiddleware,
], categoryController.createCategory);

export default router;