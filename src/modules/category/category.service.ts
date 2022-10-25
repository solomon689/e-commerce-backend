import { DataSource, Repository } from 'typeorm';
import { Database } from '../../config/database';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';

export class CategoryService {
    private static instance: CategoryService;
    private categoryRepository: Repository<Category>;

    constructor(
        private dataSource: DataSource,
    ) {
        this.categoryRepository = this.dataSource.getRepository(Category);
    }

    public static getInstance(): CategoryService {
        if (!CategoryService.instance) {
            return new CategoryService(Database.getInstance().getDataSource());
        }

        return CategoryService.instance;
    }

    public createCategory(category: any): Promise<Category> {
        let subCategories: SubCategory[] = [];
        
        if (category.subCategories?.length > 0) {
            for (const subCategory of category.subCategories) {
                if (!subCategory) continue;

                const newSubCategory: SubCategory = new SubCategory();
                newSubCategory.name = subCategory.trim();
                subCategories.push(newSubCategory);
            }
        }
        
        const newCategory = new Category();

        newCategory.name = category.name.trim();
        newCategory.subCategories = subCategories;

        return this.categoryRepository.save(newCategory);
    }
}