import express, { Application } from "express";
import cors from "cors";
import { DataSource } from 'typeorm';
import userRoutes from "../routes/user.routes";

export class EcommerceServer {
    private app: Application;
    private paths;

    constructor(private readonly dataSource: DataSource,) {
        this.app = express();
        this.paths = {
            user: '/api/user'
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
    }

    private routes(): void {
        this.app.use(this.paths.user, userRoutes);
    }

    private connectDatabase(): void {
        this.dataSource.initialize()
            .then(() => console.log('Base de datos conectada correctamente'))
            .catch((error) => console.error('Ha ocurrido un error al momento de iniciar la base de datos =>', error));
    }
}