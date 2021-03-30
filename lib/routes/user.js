import express from 'express';
import UserController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';

const router = express.Router();
const userController = new UserController();
const userValidator = new UserValidator();

router.param('user_id', (req, res, next, user_id) => {
    userController.find(req, res, next, user_id);
});

router.get('/:user_id', (req, res) => {
    userController.getUser(req, res);
});

router.get('/', (req, res) => {
    userController.getUsers(req, res);
});

router.post('/', userValidator.validate(), (req, res) => {
    userController.create(req, res);
});

router.put('/:user_id', userValidator.validate(), (req, res) => {
    userController.update(req, res);
});

router.delete('/:user_id', (req, res) => {
    userController.delete(req, res);
});

exports.userRoutes = router;
