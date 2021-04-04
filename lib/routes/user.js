import express from 'express';
import UserController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const userController = new UserController();
const userValidator = new UserValidator();
const createUserLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: 'Too many users created from this IP, please try again after an hour'
});

router.param('user_id', userController.findById());

router.get('/:user_id', userController.getUser());

router.get('/', userValidator.validateQuery(), userController.getUsers());

router.post('/', createUserLimiter, userValidator.validateUser(), userValidator.validateCreate(), userController.create());

router.put('/:user_id', userValidator.validateUser(), userValidator.validateUpdate(), userController.update());

router.delete('/:user_id', userController.delete());

exports.userRoutes = router;
