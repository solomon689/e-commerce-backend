import { DataSource, Repository } from 'typeorm';
import { Role } from './roles.entity';
import { Database } from '../../config/database';

export class RoleService {
    private static instance: RoleService;
    private roleRepository: Repository<Role>;

    constructor(private readonly dataSource: DataSource) {
        this.roleRepository = this.dataSource.getRepository(Role);
    }

    public static getInstance(): RoleService {
        if (!RoleService.instance) {
            return new RoleService(Database.getInstance().getDataSource());
        }

        return RoleService.instance;
    }

    public async  verifyRole(role: string): Promise<boolean> {
        const roleExist: Role | null = await this.roleRepository.findOne({
            where: { code: role }
        });

        return (roleExist) ? true : false;
    }
}