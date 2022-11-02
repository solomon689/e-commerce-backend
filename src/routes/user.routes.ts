import { Router } from 'express';
import { UserController } from '../modules/user/user.controller';
import { UserService } from '../modules/user/user.service';
import { verifyTokenMiddleware, roleExistMiddleware } from '../utils/middlewares/auth.middleware';

const userController: UserController = new UserController(
    UserService.getInstance(),
);
const router: Router = Router();

router.post('/', userController.createUser);
router.get('/:userId', [
    verifyTokenMiddleware,
    roleExistMiddleware,
], userController.findUserById);

export default router;