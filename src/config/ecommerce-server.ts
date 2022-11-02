import express, { Application } from "express";
import cors from "cors";
import { DataSource } from 'typeorm';
import userRoutes from "../routes/user.routes";
import authRoutes from "../routes/auth.routes";
import productRoutes from "../routes/product.routes";
import categoryRoutes from "../routes/category.routes";
import cookieParser from "cookie-parser";

export class EcommerceServer {
    private app: Application;
    private paths: any;

    constructor(private readonly dataSource: DataSource,) {
        this.app = express();
        this.paths = {
            user: '/api/user',
            auth: '/api/auth',
            product: '/api/product',
            category: '/api/category',
        }

        this.connectDatabase();
        this.middlewares();
        this.routes();
    }

    public listen(port: string | number) {
        this.app.listen(port, () => {
            console.log('Servidor corriendo en el puerto ', port);
        });
    }

    private middlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    private routes(): void {
        this.app.use(this.paths.user, userRoutes);
        this.app.use(this.paths.auth, authRoutes);
        this.app.use(this.paths.product, productRoutes);
        this.app.use(this.paths.category, categoryRoutes);
    }

    private connectDatabase(): void {
        this.dataSource.initialize()
            .then(() => console.log('Base de datos conectada correctamente'))
            .catch((error) => console.error('Ha ocurrido un error al momento de iniciar la base de datos =>', error));
    }
}