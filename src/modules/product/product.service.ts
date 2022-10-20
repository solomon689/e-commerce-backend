import { DataSource, Repository } from 'typeorm';
import { Database } from '../../config/database';
import { Product } from './entities/product.entity';
import { ProductDetail } from './entities/product-detail.entity';
export class ProductService {
    private static instance: ProductService;
    private readonly productRepository: Repository<Product>;
    private readonly productDetailRepo: Repository<ProductDetail>;

    constructor(
        private readonly dataSource: DataSource,
    ) {
        this.productRepository = this.dataSource.getRepository(Product);
        this.productDetailRepo = this.dataSource.getRepository(ProductDetail);
    }

    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            return new ProductService(Database.getInstance().getDataSource());
        }

        return ProductService.instance;
    }

    public createProduct(product: any): Promise<Product> {
        let details: ProductDetail[] = [];
        const newProduct: Product = this.productRepository.create(product as Object);

        if (product.details && product.details.length > 0) {
            for (const detail of product.details) {
                if (!detail) continue;

                const mappedDetail: ProductDetail = this.productDetailRepo.create(detail as Object);
                details.push(mappedDetail);
            }
        }

        newProduct.details = details;
        
        return this.productRepository.save(newProduct);
    }
}