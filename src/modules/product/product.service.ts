import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
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

    public findProducts(options?: { details?: boolean, ratings?: boolean }): Promise<Product[]> {
        return this.productRepository.find({
            relations: {
                details: options?.details,
                ratings: options?.ratings,
            }
        });
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

    public updateProduct(productId: string, body: any): Promise<any> {
        let newData: Partial<Product> = {};
        const acceptedProperties: string[] = ['id', 'title', 'skuCode', 'stock', 'price', 'mpn', 'color', 'description'];
        const acceptedPropertiesDetail: string[] = ['id', 'detailName', 'description'];

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