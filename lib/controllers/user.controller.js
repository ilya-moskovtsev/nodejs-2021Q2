import userService from '../loaders/user.service';
import UserValidator from '../validators/user.validator';

export default class UserController {
    constructor() {
        this.userService = userService;
        this.userValidator = new UserValidator();
    }

    findById() {
        return (req, res, next, user_id) => {
            req.user = this.userService.findById(user_id);
            if (req.user) {
                return next();
            }

            res.status(404).json({ message: `User with id ${user_id} not found` });
        };
    }

    getUser() {
        return (req, res) => {
            res.json(req.user);
        };
    }

    getUsers() {
        return (req, res) => {
            const { loginSubstring, limit } = req.query;

            if (loginSubstring && limit) {
                res.json(this.userService.getAutoSuggestUsers(loginSubstring, limit));
            } else {
                res.json(this.userService.all());
            }
        };
    }

    create() {
        return (req, res) => {
            const id = this.userService.create(req.body);
            res.json({ id });
        };
    }

    update() {
        return (req, res) => {
            res.json(this.userService.update(req.user, req.body));
        };
    }

    delete() {
        return (req, res) => {
            if (this.userService.delete(req.user)) {
                res.status(204).end();
            } else {
                res.status(410).json({ message: `User with id ${req.user.id} already deleted` });
            }
        };
    }
}
