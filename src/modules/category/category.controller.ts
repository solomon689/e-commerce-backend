import { Request, Response } from "express";
import { CategoryService } from './category.service';
import { UserService } from '../user/user.service';

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly userService: UserService,
    ) {
        this.createCategory = this.createCategory.bind(this);
    }

    public createCategory(req: Request, res: Response) {
        
    }
}