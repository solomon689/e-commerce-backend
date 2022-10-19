export class HttpError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message),

        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode,
        this.name = 'Custom Error',
        Error.captureStackTrace(this);
    }

    public createResponse() {
        return {
            statusCode: this.statusCode,
            message: this.message,
        };
    }
}