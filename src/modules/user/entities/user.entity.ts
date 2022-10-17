import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';

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

    @OneToMany(() => Address, (address) => address.user)
    public addresses!: Address[];

    constructor(user: User) {
        Object.assign(this, user);
    }
}