import express, { Router } from 'express';
import authController from '../controllers/auth.controllers';
import userController from '../controllers/user.controllers';
const router: Router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/login', authController.logIn);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);
router.delete('/delete-me', userController.getMe, userController.deleteMe);
router.patch('/update-me/:id', userController.updateMe);
router.patch('/update-my-password', authController.updatePassword);
router.post('/logout', authController.logOut);
router.post('/deactivate', userController.deactivate);

router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getUser).delete(userController.deleteUser);

export default router;
