import Ajv from 'ajv';
import userSchema from './user.schema.json';
import CommonValidator from '../validators/common.validator';
import userService from '../loaders/user.service';

const ajv = new Ajv({ allErrors: true });

export default class UserValidator {
    constructor() {
        this.userValidator = ajv.compile(userSchema);
        this.commonValidator = new CommonValidator();
        this.userService = userService;
    }

    errorResponse(schemaErrors) {
        const errors = schemaErrors.map(error => {
            const { dataPath, message } = error;
            return { dataPath, message };
        });
        return {
            status: 'failed',
            errors
        };
    }

    validateUser() {
        return (req, res, next) => {
            const isValid = this.userValidator(req.body);
            if (isValid) return next();

            res.status(400).json(this.errorResponse(this.userValidator.errors));
        };
    }

    validateCreate() {
        return (req, res, next) => {
            const isValid = this.isLoginAvailable(req.body.login);
            if (isValid) return next();

            res.status(400).json({ message: `User login ${req.body.login} is not available` });
        };
    }

    validateUpdate() {
        return (req, res, next) => {
            const isSameLogin = req.user.login === req.body.login;
            const isValid = isSameLogin || this.isLoginAvailable(req.body.login);
            if (isValid) return next();

            res.status(400).json({ message: `User login ${req.body.login} is not available` });
        };
    }

    isLoginAvailable(login) {
        return this.userService.users
            .filter(user => user.login === login)
            .filter(user => user.isDeleted === false)
            .length === 0;
    }

    validateQuery() {
        return (req, res, next) => {
            const { loginSubstring, limit } = req.query;

            if (loginSubstring && limit) {
                if (this.commonValidator.isNotPositive(limit)) {
                    return res.status(400).json({ message: `Limit ${limit} is not positive` });
                }
            }

            next();
        };
    }
}
