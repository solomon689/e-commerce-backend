import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('product_detail')
export class ProductDetail {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'varchar', length: 150 })
    public detailName!: string;

    @Column({ type: 'text' })
    public description!: string;

    constructor(productDetail: ProductDetail) {
        Object.assign(this, productDetail);
    }
}