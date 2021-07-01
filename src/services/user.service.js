import db from '../loaders/database';
import logger from '../loaders/logger';

const User = db.user;

export default class UserService {
    constructor() {
        this.exclude = ['password', 'isDeleted'];
    }

    async findAll() {
        logger.info('Finding all users');
        try {
            const users = await User.findAll({
                where: { isDeleted: false },
                attributes: { exclude: this.exclude }
            });
            logger.info('Found all users successfully');
            return users;
        } catch (e) {
            logger.error('Error finding all users', e);
            throw e;
        }
    }

    async findById(user_id) {
        logger.info(`Finding user by id ${user_id}`);
        try {
            const user = await User.findByPk(user_id, {
                where: { isDeleted: false },
                attributes: { exclude: this.exclude }
            });
            logger.info(`Found user by id ${user_id} successfully`);
            return user;
        } catch (e) {
            logger.error(`Error finding user by id ${user_id}`, e);
            throw e;
        }
    }

    async findByLogin(login) {
        logger.info(`Finding user by login ${login}`);
        try {
            const user = await User.findOne({
                where: { login, isDeleted: false }
            });
            logger.info(`Found user by login ${login} successfully`);
            return user;
        } catch (e) {
            logger.error(`Error finding user by login ${login}`, e);
            throw e;
        }
    }

    async create(user) {
        logger.info('Creating user');
        try {
            const newUser = await User.create({
                login: user.login,
                password: user.password,
                age: user.age,
                isDeleted: user.isDeleted
            });
            logger.info('Created user successfully');
            return newUser.id;
        } catch (e) {
            logger.error('Error creating user', e);
            throw e;
        }
    }

    async update(target, source) {
        logger.info(`Updating user ${target.id}`);
        try {
            target.login = source.login;
            target.password = source.password;
            target.age = source.age;
            target.isDeleted = source.isDeleted;
            await target.save();
            logger.info(`Updated user ${target.id} successfully`);
        } catch (e) {
            logger.error(`Error updating user ${target.id}`);
            throw e;
        }
    }

    /**
     * Get auto-suggest list from limit users,
     * sorted by login property and
     * filtered by loginSubstring in the login property
     * @param loginSubstring
     * @param limit
     * @returns {User[]}
     */
    async getAutoSuggestUsers(loginSubstring, limit) {
        logger.info('Suggesting users');
        try {
            const users = await User.findAll({
                where: { isDeleted: false },
                attributes: { exclude: this.exclude },
                order: [['login', 'ASC']],
                limit
            });
            logger.info('Suggested users successfully');
            return users;
        } catch (e) {
            logger.error('Error suggesting users', e);
            throw e;
        }
    }

    async delete(user) {
        logger.info(`Deleting user by id ${user.id}`);
        try {
            await User.destroy({
                where: { id: user.id }
            });
            logger.info(`Deleted user by id ${user.id} successfully`);
        } catch (e) {
            logger.error(`Error deleting user by id ${user.id}`, e);
            throw e;
        }
    }
}
