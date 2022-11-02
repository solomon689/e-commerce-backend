import { HttpError } from './http-error';
import { HttpStatus } from '../enums/http-status';

export class NotFoundError extends HttpError {
    constructor(message: string) {
        super(HttpStatus.NOT_FOUND, message);
    }
}