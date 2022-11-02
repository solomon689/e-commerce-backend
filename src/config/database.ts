import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();
export class Database {
    private static instance: Database;
    private dataSource: DataSource;

    private constructor() {
        this.dataSource = new DataSource({
            type: 'postgres',
            host: process.env.DATABASE_HOST || 'localhost',
            port: 5432,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: false,
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    public getDataSource(): DataSource {
        return this.dataSource;
    }
}