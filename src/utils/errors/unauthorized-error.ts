import { HttpError } from './http-error';
import { HttpStatus } from '../enums/http-status';

export class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}