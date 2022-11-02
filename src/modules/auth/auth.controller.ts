import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { HttpStatus } from '../../utils/enums/http-status';
export class AuthController {
    
    constructor(
        private readonly authService: AuthService,
    ) {
        this.login = this.login.bind(this);
    }
    
    public async login(req: Request, res: Response) {
        try {
            const email: string = req.get('email') as string;
            const password: string = req.get('password') as string;
            const token: string | null = await this.authService.login(email, password);

            if (!token) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Credencial(es) incorrecta(s)',
                });
            }

            res.cookie('token', token, {
                maxAge: 3600000,
                httpOnly: true,
                secure: false
            });

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Login existoso!'
            });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Ha ocurrido un error al momento de autenticar la información', 
            });
        }
    }
}