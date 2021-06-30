import authService from '../loaders/auth.service';
import logger from '../loaders/logger';

export default class AuthController {
    constructor() {
        this.authService = authService;
    }

    login() {
        return async (req, res, next) => {
            try {
                const { username, password } = req.body;
                const token = await this.authService.login(username, password);
                if (token) {
                    res.json({ token });
                } else {
                    res.status(403).send({ success: false, message: 'Bad username/password combination.' });
                }
            } catch (e) {
                logger.error(`AuthController login ${e.message}`);
                return next(e);
            }
        };
    }

    checkToken() {
        return async (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (token) {
                    this.authService.checkToken(token);
                    return next();
                }
                res.status(401).send({ success: false, message: 'Unauthorized.' });
            } catch (e) {
                logger.error(`AuthController checkToken ${e.message}`);
                res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
            }
        };
    }
}
