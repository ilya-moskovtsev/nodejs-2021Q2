import express from 'express';
import AuthController from '../controllers/auth.controller';
import UserController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const authController = new AuthController();
const userController = new UserController();
const userValidator = new UserValidator();
const createUserLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: 'Too many users created from this IP, please try again after an hour'
});

router.param('user_id', authController.checkToken(), userController.findById());

router.get('/:user_id', authController.checkToken(), userController.getUser());

router.get('/', authController.checkToken(), userValidator.validateQuery(), userController.getUsers());

router.post('/', authController.checkToken(), createUserLimiter, userValidator.validateUser(), userValidator.validateCreate(), userController.create());

router.put('/:user_id', authController.checkToken(), userValidator.validateUser(), userValidator.validateUpdate(), userController.update());

router.delete('/:user_id', authController.checkToken(), userController.delete());

exports.userRoutes = router;
