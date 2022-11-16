import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductDetail } from './product-detail.entity';
import { ProductRating } from './product-rating.entity';
import { Category } from '../../category/entities/category.entity';
import { SubCategory } from '../../category/entities/sub-category.entity';

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'varchar', length: 255 })
    public title!: string;

    @Column({ type: 'varchar', length: 30, name: 'sku_code' })
    public skuCode!: string;

    @Column({ type: 'int4' })
    public stock!: number;

    @Column({ type: 'float' })
    public price!: number;

    @Column({ type: 'int4', nullable: true })
    public mpn?: number; // número de pieza del fabricante.

    @Column({ type: 'varchar', nullable: true, array: true })
    public color?: string[];

    @Column({ type: 'text', nullable: true, name: 'url_image' })
    public urlImage?: string;

    @Column({ type: 'text', nullable: true })
    public description?: string;

    @OneToMany(() => ProductDetail, (detail) => detail.product, { cascade: ['insert', 'update'] })
    public details!: ProductDetail[];

    @OneToMany(() => ProductRating, (productRating) => productRating.product, { eager: true })
    public ratings?: ProductRating[];

    @ManyToMany(() => SubCategory, { eager: true, cascade: true })
    @JoinTable()
    public categories!: SubCategory[];

    constructor(product: Product) {
        Object.assign(this, product);
    }
}