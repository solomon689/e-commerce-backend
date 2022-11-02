import { Router } from "express";
import { AuthController } from '../modules/auth/auth.controller';
import { AuthService } from '../modules/auth/auth.service';

const router: Router = Router();
const authController: AuthController = new AuthController(
    AuthService.getInstance(),
);

router.get('/login', authController.login);

export default router;