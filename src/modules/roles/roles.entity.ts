import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'varchar', length: 100 })
    public name!: string;

    @Column({ type: 'varchar', length: 50 })
    public code!: string;

    constructor(role: Role) {
        Object.assign(this, role);
    }
}