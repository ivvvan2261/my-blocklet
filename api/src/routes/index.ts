import middleware from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';

import UserController from '../controllers/user.controller';
import authenticate from '../middlewares/auth.middleware';

const router = Router();

router.get('/user', middleware.user(), authenticate, UserController.getUser);
router.put('/user', middleware.user(), authenticate, UserController.updateUser);

export default router;
