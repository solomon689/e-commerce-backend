import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Database } from '../../config/database';
import { Address } from './entities/address.entity';
import { hashPassword } from '../../utils/functions/security';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entities/product.entity';

export class UserService {
    private static instance: UserService;
    private userRepository: Repository<User>;
    private addressRepository: Repository<Address>;

    private constructor(
        private readonly dataSource: DataSource,
        private readonly productService: ProductService,
    ) {
        this.userRepository = this.dataSource.getRepository(User);
        this.addressRepository = this.dataSource.getRepository(Address);
    }

    public static getInstance() {
        if (!UserService.instance) {
            return new UserService(
                Database.getInstance().getDataSource(),
                ProductService.getInstance(),
            );
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

    public async findUserById(userId: string): Promise<User | null> {
        const foundedUser: User | null = await this.userRepository
            .findOne({ where: { id: userId } });

        return foundedUser;
    }

    public async findUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    public async getUserRole(userId: string): Promise<string | null> {
        const user: Partial<User> | null = await this.userRepository
            .findOne({
                select: { role: { code: true } },
                where: { id: userId },
            });

        const userRole: string | undefined = user?.role?.code;

        return (userRole) ? userRole : null;
    }

    public async addProductToUserFavorite(userId: string, productId: string) {
        const user: User | null = await this.findUserById(userId);

        if (!user) return null;

        const product: Product | null = await this.productService.findProductById(productId, {
            details: false, ratings: false,
        });

        if (!product) return null;

        user.favorites?.push(product);
        console.log(user);
        return this.userRepository.save(user);
    }
}