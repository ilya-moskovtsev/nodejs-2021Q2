import UserService from '../services/user.service';
import CommonValidator from '../validators/common.validator';
import UserValidator from '../validators/user.validator';

export default class UserController {
    constructor() {
        this.userService = new UserService();
        this.commonValidator = new CommonValidator();
        this.userValidator = new UserValidator();
    }

    find(req, res, next, user_id) {
        req.user = this.userService.find(user_id);
        if (req.user) {
            return next();
        }

        res.status(404).json({ message: `User with id ${user_id} not found` });
    }

    getUser(req, res) {
        res.json(req.user);
    }

    getUsers(req, res) {
        const { loginSubstring, limit } = req.query;

        if (loginSubstring && limit) {
            if (this.commonValidator.isNotPositive(limit)) {
                return res.status(400).json({ message: `Limit ${limit} is not positive` });
            }
            res.json(this.userService.getAutoSuggestUsers(loginSubstring, limit));
        } else {
            res.json(this.userService.all());
        }
    }

    create(req, res) {
        if (this.userValidator.isLoginAvailable(this.userService, req.body.login)) {
            const id = this.userService.create(req.body);
            res.json({ id });
        } else {
            res.status(400).json({ message: `User login ${req.body.login} is not available` });
        }
    }

    update(req, res) {
        if (req.user.login === req.body.login || this.userValidator.isLoginAvailable(this.userService, req.body.login)) {
            res.json(this.userService.update(req.user, req.body));
        } else {
            res.status(400).json({ message: `User login ${req.body.login} is not available` });
        }
    }

    delete(req, res) {
        if (this.userService.delete(req.user)) {
            res.status(204).end();
        } else {
            res.status(410).json({ message: `User with id ${req.user.id} already deleted` });
        }
    }
}
