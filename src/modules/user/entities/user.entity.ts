import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';
import { Product } from '../../product/entities/product.entity';
import { Purchase } from './purchases.entity';
import { Role } from '../../roles/roles.entity';

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

    @ManyToOne(() => Role, (role) => role.user, { eager: true } )
    @JoinColumn({ name: 'role_id' })
    public role!: Role;

    @OneToMany(() => Address, (address) => address.user, { eager: true })
    public addresses!: Address[];

    @OneToMany(() => Purchase, (purchase) => purchase.user, { eager: true })
    public purchases!: Purchase[];

    @ManyToMany(() => Product)
    @JoinTable()
    public favorites?: Product[];

    constructor(user: User) {
        Object.assign(this, user);
    }
}