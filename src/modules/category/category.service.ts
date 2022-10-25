import { DataSource, Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Database } from '../../config/database';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';

export class CategoryService {
    private static instance: CategoryService;
    private categoryRepository: Repository<Category>;
    private subCategoryRepository: Repository<SubCategory>;

    constructor(
        private dataSource: DataSource,
    ) {
        this.categoryRepository = this.dataSource.getRepository(Category);
        this.subCategoryRepository = this.dataSource.getRepository(SubCategory);
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

    public findCategories(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    public findCategoryById(categoryId: string): Promise<Category | null> {
        return this.categoryRepository.findOne({
            where: { id: categoryId },
        });
    }

    public deleteCategoryById(categoryId: string): Promise<DeleteResult> {
        return this.dataSource.createQueryBuilder()
            .delete()
            .from(Category)
            .where({ id: categoryId })
            .returning('*')
            .execute();
    }

    public async updateCategory(newData: any): Promise<Category> {
        const category: Category = new Category();
        const subCategories: Partial<SubCategory[]> = [];
        const acceptedProperties: string[] = ['id', 'name'];

        if (newData.subCategories?.length > 0) {
            for (const subcategory of newData.subCategories) {
                let newSubCategory: Partial<SubCategory> = {};

                if (!subcategory) continue;
                
                for (const property in subcategory) {
                    if (!property) continue;
                    if (acceptedProperties.indexOf(property) === -1) continue;

                    newSubCategory[property as keyof SubCategory] = subcategory[property];
                }
                
                subCategories.push(newSubCategory as SubCategory);
            }
        }

        for (const property in newData) {
            if (!property) continue;
            if (acceptedProperties.indexOf(property) === -1) continue;

            category[property as keyof Category] = newData[property];
        }

        category.subCategories = subCategories as SubCategory[];

        return this.categoryRepository.save(category as Category);
    }
}