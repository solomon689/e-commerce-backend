import { DataSource } from 'typeorm';
import { Database } from '../../config/database';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { comparePassword, createToken } from '../../utils/functions/security';

export class AuthService {
    private static instance: AuthService;

    private constructor(
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
    ) {

    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            return new AuthService(
                Database.getInstance().getDataSource(),
                UserService.getInstance(),
            );
        }

        return AuthService.instance;
    }

    public async login(email: string, password: string): Promise<string | null> {
        const user: User | null = await this.userService.findUserByEmail(email);

        if (!user) return user;

        const isSamePassword: boolean = await comparePassword(password, user.password);

        if (!isSamePassword) return null;

        const token: string = createToken({ 
            id: user.id,
            role: user.role, 
        });

        return token;
    }
}