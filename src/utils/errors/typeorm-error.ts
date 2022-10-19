import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { HttpError } from './http-error';
import { HttpStatus } from '../enums/http-status';

export class CustomTypeOrmError extends HttpError {
    constructor(error: any) {
        switch(error.constructor) {
            case QueryFailedError: {
                console.log(error.message);
                super(HttpStatus.UNPROCESSABLE_ENTITY, error.message);
                break;
            }

            case EntityNotFoundError: {
                super(HttpStatus.UNPROCESSABLE_ENTITY, error.message);
                break;
            }

            default: {
                super(HttpStatus.INTERNAL_SERVER_ERROR, 'Ha ocurrido un error al momento de procesar la petición');
            }
        }
    }
}