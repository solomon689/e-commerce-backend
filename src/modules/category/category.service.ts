import { DataSource, Repository } from 'typeorm';
import { Database } from '../../config/database';
import { Category } from './entities/category.entity';

export class CategoryService {
    private static instance: CategoryService;
    private categoryRepository: Repository<Category>;

    constructor(
        private dataSource: DataSource,
    ) {
        this.categoryRepository = this.dataSource.getRepository(Category);
    }

    public getInstance(): CategoryService {
        if (!CategoryService.instance) {
            return new CategoryService(Database.getInstance().getDataSource());
        }

        return CategoryService.instance;
    }
}