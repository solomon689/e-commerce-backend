import { HttpError } from './http-error';
import { HttpStatus } from '../enums/http-status';

export class BadRequestError extends HttpError {
    constructor(message: string) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}