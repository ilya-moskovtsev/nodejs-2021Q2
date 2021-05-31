import jwt from 'jsonwebtoken';
import userService from '../loaders/user.service';
import logger from '../loaders/logger';

export default class AuthService {
    constructor() {
        this.userService = userService;
    }

    async login(username, password) {
        logger.info('Logging in user');
        try {
            const user = await this.userService.findByLogin(username);
            let token;
            if (user && user.password === password) {
                // TODO: move secret and expiresIn to dotenv
                token = jwt.sign({ sub: user.id }, 'secret', { expiresIn: 60 });
                logger.info('Logged in user successfully');
            }
            return token;
        } catch (e) {
            logger.error('Error logging in user', e);
            throw e;
        }
    }

    checkToken(token) {
        logger.info('Checking token');
        try {
            // TODO: move secret to dotenv
            return jwt.verify(token, 'secret');
        } catch (e) {
            logger.error('Error checking token', e);
            throw e;
        }
    }
}