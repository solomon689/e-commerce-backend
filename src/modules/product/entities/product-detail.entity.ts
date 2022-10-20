import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './product.entity';

@Entity('product_detail')
export class ProductDetail {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'varchar', length: 150 })
    public detailName!: string;

    @Column({ type: 'text' })
    public description!: string;

    @ManyToOne(() => Product, (product) => product.details)
    public product!: Product;

    constructor(productDetail: ProductDetail) {
        Object.assign(this, productDetail);
    }
}