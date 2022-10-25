import { Router } from "express";
import { CategoryController } from '../modules/category/category.controller';
import { CategoryService } from "../modules/category/category.service";
import { UserService } from '../modules/user/user.service';
import { verifyTokenMiddleware } from '../utils/middlewares/auth.middleware';
import { RoleService } from '../modules/roles/role.service';

const router: Router = Router();
const categoryController: CategoryController = new CategoryController(
    CategoryService.getInstance(),
    UserService.getInstance(),
    RoleService.getInstance(),
);

router.post('/', [
    verifyTokenMiddleware,
], categoryController.createCategory);

router.get('/', [
    verifyTokenMiddleware,
], categoryController.findCategories);

router.get('/:categoryId', [
    verifyTokenMiddleware,
], categoryController.findCategoryById);

router.delete('/:categoryId', [
    verifyTokenMiddleware,
], categoryController.deleteCategoryById);

router.put('/', [
    verifyTokenMiddleware,
], categoryController.updateCategory);

export default router;