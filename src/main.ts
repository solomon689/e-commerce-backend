import dotenv from "dotenv";
import { Database } from "./config/database";
import { EcommerceServer } from './config/ecommerce-server';

dotenv.config();

const server: EcommerceServer = new EcommerceServer(Database.getInstance().getDataSource());

server.listen(process.env.PORT || 3000);