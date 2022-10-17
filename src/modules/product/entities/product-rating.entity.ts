import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('product_rating')
export class ProductRating {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;
    
    @Column({ type: 'float' })
    public rating!: number;

    @Column({ type: 'text', nullable: true })
    public comment!: string;

    @ManyToOne(() => Product, (product) => product.ratings)
    public product!: Product;

    constructor(productRating: ProductRating) {
        Object.assign(this, productRating);
    }
}