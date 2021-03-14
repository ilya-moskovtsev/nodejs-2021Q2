import express from 'express';
import UserService from '../services/user.service';
import UserValidator from '../validators/user.validator';

const router = express.Router();
const userService = new UserService();
const userValidator = new UserValidator();

router.param('user_id', (req, res, next, user_id) => {
    req.user = userService.find(user_id);
    if (req.user) {
        return next();
    }

    res.status(404).json({ message: `User with id ${user_id} not found` });
});

router.get('/:user_id', (req, res) => {
    res.json(req.user);
});

router.get('/', (req, res) => {
    const { loginSubstring, limit } = req.query;
    if (loginSubstring && limit) {
        res.json(userService.getAutoSuggestUsers(loginSubstring, limit));
    } else {
        res.json(userService.all());
    }
});

router.post('/', userValidator.validate(), (req, res) => {
    if (userService.isLoginAvailable(req.body.login)) {
        const id = userService.create(req.body);
        res.json({ id });
    } else {
        res.status(400).json({ message: `User login ${req.body.login} is not available` });
    }
});

router.put('/:user_id', userValidator.validate(), (req, res) => {
    if (req.user.login === req.body.login || userService.isLoginAvailable(req.body.login)) {
        userService.update(req.user, req.body);
        res.json(req.user);
    } else {
        res.status(400).json({ message: `User login ${req.body.login} is not available` });
    }
});

router.delete('/:user_id', (req, res) => {
    if (userService.delete(req.user)) {
        res.status(204).end();
    } else {
        res.status(410).json({ message: `User with id ${req.user.id} already deleted` });
    }
});

exports.userRoutes = router;
