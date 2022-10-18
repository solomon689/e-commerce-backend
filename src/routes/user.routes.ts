import { Router } from 'express';
import { UserController } from '../modules/user/user.controller';
import { UserService } from '../modules/user/user.service';

const userController: UserController = new UserController(
    UserService.getInstance(),
);
const router: Router = Router();

router.post('/', userController.createUser);

export default router;