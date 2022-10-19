import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Database } from '../../config/database';
import { Address } from './entities/address.entity';
import { hashPassword } from '../../utils/functions/security';

export class UserService {
    private static instance: UserService;
    private userRepository: Repository<User>;
    private addressRepository: Repository<Address>;

    private constructor(private readonly dataSource: DataSource,) {
        this.userRepository = this.dataSource.getRepository(User);
        this.addressRepository = this.dataSource.getRepository(Address);
    }

    public static getInstance() {
        if (!UserService.instance) {
            return new UserService(Database.getInstance().getDataSource());
        }

        return UserService.instance;
    }

    public async createUser(user: User): Promise<User> {
        let createdAddresses: Address[] = [];

        if (user.addresses && user.addresses.length > 0) {
            for (const address of user.addresses) {
                if (!address) continue;

                const addressEntity: Address = this.addressRepository
                    .create(address);
                
                if (addressEntity) createdAddresses.push(addressEntity);
            }
        }

        const hashedPassword: string = await hashPassword(user?.password);

        let userEntity: User = this.userRepository.create({
            name: user.name?.trim(),
            lastname: user.lastname?.trim(),
            email: user.email?.trim(),
            password: hashedPassword,
            addresses: createdAddresses,            
        });

        return await this.userRepository.save(userEntity);
    }

    public async findUserById(userId: string, options?: {
        addresses?: boolean, favorites?: boolean, purchases?: boolean,
    }): Promise<User | null> {
        const foundedUser: User | null = await this.userRepository
            .findOne({
                relations: {
                    addresses: options?.addresses,
                    favorites: options?.favorites,
                    purchases: options?.purchases,
                },
                where: { id: userId },
            });

        return foundedUser;
    }
}