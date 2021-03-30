import Ajv from 'ajv';
import userSchema from './user.schema.json';

const ajv = new Ajv({ allErrors: true });

export default class UserValidator {
    constructor() {
        this.userValidator = ajv.compile(userSchema);
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

    validate() {
        return (req, res, next) => {
            const valid = this.userValidator(req.body);
            if (valid) {
                return next();
            }

            res.status(400).json(this.errorResponse(this.userValidator.errors));
        };
    }

    isLoginAvailable(userService, login) {
        return userService.users
            .filter(user => user.login === login)
            .filter(user => user.isDeleted === false)
            .length === 0;
    }
}
