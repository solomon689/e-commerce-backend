import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'varchar', length: 150 })
    public region!: string;

    @Column({ type: 'varchar', length: 150 })
    public commune!: string;

    @Column({ type: 'varchar', length: 150 })
    public street!: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    public streetNumber?: string;

    @ManyToOne(() => User, (user) => user.addresses)
    public user!: User;

    constructor(address: Address) {
        Object.assign(this, address);
    }
}