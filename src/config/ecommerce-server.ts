import express, { Application } from "express";
import cors from "cors";
import { DataSource } from 'typeorm';

export class EcommerceServer {
    private app: Application;
    private paths: any;

    constructor(private readonly dataSource: DataSource,) {
        this.app = express();

        this.connectDatabase();
        this.middlewares();
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
    }

    private connectDatabase(): void {
        this.dataSource.initialize()
            .then(() => console.log('Base de datos conectada correctamente'))
            .catch((error) => console.error('Ha ocurrido un error al momento de iniciar la base de datos =>', error));
    }
}