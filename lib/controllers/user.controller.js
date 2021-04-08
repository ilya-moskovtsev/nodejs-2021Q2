import userService from '../loaders/user.service';
import UserValidator from '../validators/user.validator';

export default class UserController {
    constructor() {
        this.userService = userService;
        this.userValidator = new UserValidator();
    }

    findById() {
        return async (req, res, next, user_id) => {
            req.user = await this.userService.findById(user_id);
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
        return async (req, res) => {
            const { loginSubstring, limit } = req.query;

            if (loginSubstring && limit) {
                res.json(await this.userService.getAutoSuggestUsers(loginSubstring, limit));
            } else {
                res.json(await this.userService.findAll());
            }
        };
    }

    create() {
        return async (req, res) => {
            const id = await this.userService.create(req.body);
            res.json({ id });
        };
    }

    update() {
        return async (req, res) => {
            res.json(await this.userService.update(req.user, req.body));
        };
    }

    delete() {
        return async (req, res) => {
            await this.userService.delete(req.user);
            res.status(204).end();
        };
    }
}
