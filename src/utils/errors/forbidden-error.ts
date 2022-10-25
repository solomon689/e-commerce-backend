import { HttpError } from './http-error';
import { HttpStatus } from '../enums/http-status';

export class ForbiddenError extends HttpError {
    constructor(message: string) {
        super(HttpStatus.FORBIDDEN, message);
    }
}