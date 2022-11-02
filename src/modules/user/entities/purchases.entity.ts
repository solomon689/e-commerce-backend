import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from './user.entity';

@Entity()
export class Purchase {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'varchar', length: 200, name: 'product_name' })
    public productName!: string;

    @Column({ type: 'float', name: 'product_price' })
    public producPrice!: number;

    @Column({ type: 'int4' })
    public quantity!: number;

    @Column({ type: 'int', name: 'purchase_code' })
    public purchaseCode!: number;

    @Column({ type: 'date', name: 'purchase_date' })
    public purchaseDate!: any;
    
    @Column({ type: 'bool', name: 'is_delivered', default: false })
    public isDelivered!: boolean;

    @Column({ type: 'date', name: 'date_delivered', nullable: true })
    public dateDelivered?: any;

    @ManyToOne(() => User, (user) => user.purchases)
    public user!: User;

    constructor(purchase: Purchase) {
        Object.assign(this, purchase);
    }
}