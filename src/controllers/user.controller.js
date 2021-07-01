import userService from '../loaders/user.service';
import UserValidator from '../validators/user.validator';
import logger from '../loaders/logger';

export default class UserController {
    constructor() {
        this.userService = userService;
        this.userValidator = new UserValidator();
    }

    findById() {
        return async (req, res, next, user_id) => {
            try {
                req.user = await this.userService.findById(user_id);
                if (req.user) {
                    return next();
                }

                res.status(404).json({ message: `User with id ${user_id} not found` });
            } catch (e) {
                logger.error(`UserController findById user_id ${user_id} ${e.message}`);
                return next(e);
            }
        };
    }

    getUser() {
        return (req, res) => {
            res.json(req.user);
        };
    }

    getUsers() {
        return async (req, res, next) => {
            const { loginSubstring, limit } = req.query;
            try {
                if (loginSubstring && limit) {
                    res.json(await this.userService.getAutoSuggestUsers(loginSubstring, limit));
                } else {
                    res.json(await this.userService.findAll());
                }
            } catch (e) {
                logger.error(`UserController getUsers loginSubstring ${loginSubstring} limit ${limit} ${e.message}`);
                return next(e);
            }
        };
    }

    create() {
        return async (req, res, next) => {
            try {
                const id = await this.userService.create(req.body);
                res.json({ id });
            } catch (e) {
                logger.error(`UserController create user ${req.body} ${e.message}`);
                return next(e);
            }
        };
    }

    update() {
        return async (req, res, next) => {
            try {
                res.json(await this.userService.update(req.user, req.body));
            } catch (e) {
                logger.error(`UserController update target ${req.user} source ${req.body} ${e.message}`);
                return next(e);
            }
        };
    }

    delete() {
        return async (req, res, next) => {
            try {
                await this.userService.delete(req.user);
                res.status(204).end();
            } catch (e) {
                logger.error(`UserController delete user ${req.user} ${e.message}`);
                return next(e);
            }
        };
    }
}
