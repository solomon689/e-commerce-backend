import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from './category.entity';

@Entity('sub_category')
export class SubCategory {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'varchar', length: 100 })
    public name!: string;

    @ManyToOne(() => Category, (category) => category.subCategories, { onDelete: 'CASCADE' })
    public category!: Category;

    constructor() {}
}