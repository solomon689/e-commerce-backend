import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Database } from '../../config/database';
import { Product } from './entities/product.entity';
import { ProductDetail } from './entities/product-detail.entity';
import { SubCategory } from '../category/entities/sub-category.entity';
import { CloudinaryService } from '../../utils/services/cloudinary.service';
export class ProductService {
    private static instance: ProductService;
    private readonly productRepository: Repository<Product>;
    private readonly productDetailRepo: Repository<ProductDetail>;

    constructor(
        private readonly dataSource: DataSource,
        private readonly cloudinaryService: CloudinaryService,
    ) {
        this.productRepository = this.dataSource.getRepository(Product);
        this.productDetailRepo = this.dataSource.getRepository(ProductDetail);
    }

    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            return new ProductService(
                Database.getInstance().getDataSource(),
                CloudinaryService.getInstance(),
            );
        }

        return ProductService.instance;
    }

    public async createProduct(product: any, file?: any): Promise<Product> {
        let details: ProductDetail[] = [];
        let categories: SubCategory[] = [];
        const newProduct: Product = this.productRepository.create(product as Object);

        if (product.details && product.details.length > 0) {
            for (const detail of product.details) {
                if (!detail) continue;

                const mappedDetail: ProductDetail = this.productDetailRepo.create(detail as Object);
                details.push(mappedDetail);
            }
        }

        if (product.categories?.length > 0) {
            for (const category of product.categories) {
                if (!category) continue;

                let mappedCategory = new SubCategory();

                mappedCategory.id = category.id;
                mappedCategory.name = category.name;
                categories.push(mappedCategory);
            }
        }

        if (file) {
            newProduct.urlImage = await this.cloudinaryService.uploadImage(file, 'products');
        }

        newProduct.details = details;
        newProduct.categories = categories;
        
        return this.productRepository.save(newProduct);
    }

    public findProducts(page: number): Promise<Product[]> {
        let totalCount: number = 0;

        if (page <= 0) page = 1;

        totalCount = (page * 10) - 10;
    
        return this.productRepository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.details", "product.ratings")
            .skip(totalCount)
            .take(10)
            .getMany();
    }

    public totalProducts(): Promise<number> {
        return this.productRepository.count();
    }

    public findProductById(
        productId: string, 
        options?: { details?: boolean, ratings?: boolean },
    ): Promise<Product | null> {
        return this.productRepository.findOne({
            where: { id: productId },
            relations: { details: options?.details, ratings: options?.ratings },
        });
    }

    public updateProduct(productId: string, body: any): Promise<Product> {
        let newData: Partial<Product> = {};
        const acceptedProperties: string[] = ['id', 'title', 'skuCode', 'stock', 'price', 'mpn', 'color', 'description', 'urlImage'];
        const acceptedPropertiesDetail: string[] = ['id', 'detailName', 'description'];
        const acceptedCategoryProperties: string[] = ['id', 'name'];

        for (const property in body) {
            if (!property) continue;
            if (acceptedProperties.indexOf(property) === -1) continue;
            
            newData[property as keyof Product] = body[property]
        }

        if (body?.details && body?.details?.length > 0) {
            newData.details = []; // Se inicializa array.
            
            for (const detail of body.details) {
                let newDetailData: Partial<ProductDetail> = {};

                for (const property in detail) {
                    if (!property) continue;
                    if (acceptedPropertiesDetail.indexOf(property) === -1) continue;

                    newDetailData[property as keyof ProductDetail] = detail[property];
                }

                newData.details?.push(newDetailData as ProductDetail);
            }
        }

        if (body.categories?.length > 0) {
            newData.categories = []; // Se inicializa el array.
            
            for (const category of body.categories) {
                let newCategoryData: Partial<SubCategory> = {};

                for (const property in category) {
                    if (!property) continue;
                    if (acceptedCategoryProperties.indexOf(property) === -1) continue;

                    newCategoryData[property as keyof SubCategory] = category[property]
                }

                newData.categories.push(newCategoryData as SubCategory);
            }
        }

        return this.productRepository.save(newData);
    }

    public deleteProductById(productId: string): Promise<DeleteResult> {
        return this.dataSource
            .createQueryBuilder()
            .delete()
            .from(Product)
            .where({ id: productId })
            .returning('id')
            .execute();
    }
}