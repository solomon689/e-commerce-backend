import request from "supertest";
import { HttpStatus } from '../../src/utils/enums/http-status';
import { Product } from '../../src/modules/product/entities/product.entity';

const baseUrl: string = 'http://localhost:3000/api/product';

describe("Obtener productos segun las categorias dadas por el cliente y retornar una respuesta exitosa", () => {
    it("GET /category/recommended", async () => {
        const res = await request(baseUrl)
            .get('/category/recommended')
            .query({ limit: 9, offset: 0, categoryIds: '5aea811f-b9bf-4110-a261-68052d1df8a4' })
            .expect(HttpStatus.OK)
            .expect('Content-Type', 'application/json; charset=utf-8');

        expect(res.body.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.message).toEqual('Productos encontrados con exito!');
        expect(res.body.limit).toEqual(9);
        expect(res.body.offset).toEqual(0);
        expect(res.body).toEqual(expect.objectContaining({ data: expect.anything() }));
    });
});

describe("Obtener productos segun las categorias dadas por el cliente y retornar una respuesta erronea por formato invalido", () => {
    test("GET /category/recommended", async () => {
        const res = await request(baseUrl)
            .get('/category/recommended')
            .query({ limit: 9, offset: 0, categoryIds: 'lkasdhjmaskd' })
            .expect(HttpStatus.UNPROCESSABLE_ENTITY)
            .expect('Content-Type', 'application/json; charset=utf-8');

        expect(res.body).toEqual(expect.objectContaining({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: expect.any(String),
        }));
    });
});

describe("Obtener productos según el limite y offset enviados deste el cliente y retornar una respuesta exitosa", () => {
    test("GET /", async () => {
        const res = await request(baseUrl)
            .get('/')
            .query({ limit: 9, offset: 0 })
            .expect(HttpStatus.OK)
            .expect('Content-Type', 'application/json; charset=utf-8');

        expect(res.body).toEqual(expect.objectContaining({
            statusCode: HttpStatus.OK,
            message: 'Productos encontrados con exito!',
            limit: 9,
            offset: 0,
            totalProducts: expect.any(Number),
        }));
        expect(res.body.data).toEqual(expect.any(Array<Product>));
    });
});