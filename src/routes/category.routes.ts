import { Router } from "express";
import { CategoryController } from '../modules/category/category.controller';
import { CategoryService } from "../modules/category/category.service";
import { verifyTokenMiddleware, roleExistMiddleware } from '../utils/middlewares/auth.middleware';

const router: Router = Router();
const categoryController: CategoryController = new CategoryController(
    CategoryService.getInstance(),
);

router.post('/', [
    verifyTokenMiddleware,
    roleExistMiddleware,
], categoryController.createCategory);

router.get('/', [
    verifyTokenMiddleware,
    roleExistMiddleware,
], categoryController.findCategories);

router.get('/:categoryId', [
    verifyTokenMiddleware,
    roleExistMiddleware,
], categoryController.findCategoryById);

router.delete('/:categoryId', [
    verifyTokenMiddleware,
    roleExistMiddleware,
], categoryController.deleteCategoryById);

router.put('/', [
    verifyTokenMiddleware,
    roleExistMiddleware,
], categoryController.updateCategory);

export default router;