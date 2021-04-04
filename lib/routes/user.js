import express from 'express';
import UserController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';

const router = express.Router();
const userController = new UserController();
const userValidator = new UserValidator();

router.param('user_id', userController.findById());

router.get('/:user_id', userController.getUser());

router.get('/', userValidator.validateQuery(), userController.getUsers());

router.post('/', userValidator.validateUser(), userValidator.validateCreate(), userController.create());

router.put('/:user_id', userValidator.validateUser(), userValidator.validateUpdate(), userController.update());

router.delete('/:user_id', userController.delete());

exports.userRoutes = router;
