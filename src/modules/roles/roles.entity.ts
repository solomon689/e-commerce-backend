import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../user/entities/user.entity';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'varchar', length: 100 })
    public name!: string;

    @Column({ type: 'varchar', length: 50 })
    public code!: string;

    @OneToMany(() => User, (user) => user.role)
    public user!: User;

    constructor(role: Role) {
        Object.assign(this, role);
    }
}