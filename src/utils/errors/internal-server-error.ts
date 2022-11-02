import { HttpError } from './http-error';
import { HttpStatus } from '../enums/http-status';

export class InternalServerError extends HttpError {
    constructor(message: string = 'Ha ocurrido un error inesperado') {
        super(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
}