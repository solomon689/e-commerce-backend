import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';
import { Product } from '../../product/entities/product.entity';
import { Purchase } from './purchases.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'varchar', length: 150 })
    public name!: string;

    @Column({ type: 'varchar', length: 150 })
    public lastname!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    public email!: string;

    @Column({ type: 'text' })
    public password!: string;

    @Column({ type: 'varchar', array: true, default: ["USER"] })
    public roles?: string[];

    @OneToMany(() => Address, (address) => address.user)
    public addresses!: Address[];

    @OneToMany(() => Purchase, (purchase) => purchase.user)
    public purchases!: Purchase[];

    @ManyToMany(() => Product)
    @JoinTable()
    public favorites?: Product[];

    constructor(user: User) {
        Object.assign(this, user);
    }
}