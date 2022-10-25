import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubCategory } from './sub-category.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'varchar', length: 50 })
    public name!: string;

    @OneToMany(() => SubCategory, (subCategory) => subCategory.category, { eager: true, cascade: ['insert', 'update'] })
    public subCategories?: SubCategory[];

    constructor() {}
}