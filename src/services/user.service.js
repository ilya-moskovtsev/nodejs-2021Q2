import db from '../loaders/database';

const User = db.user;

export default class UserService {
    constructor() {
        this.exclude = ['password', 'isDeleted'];
    }

    async findAll() {
        console.log('Finding all users');
        try {
            const users = await User.findAll({
                where: { isDeleted: false },
                attributes: { exclude: this.exclude }
            });
            console.log('Found all users successfully');
            return users;
        } catch (e) {
            console.error('Error finding all users', e);
            throw e;
        }
    }

    async findById(user_id) {
        console.log(`Finding user by id ${user_id}`);
        try {
            const user = await User.findByPk(user_id, {
                where: { isDeleted: false },
                attributes: { exclude: this.exclude }
            });
            console.log(`Found user by id ${user_id} successfully`);
            return user;
        } catch (e) {
            console.error(`Error finding user by id ${user_id}`, e);
            throw e;
        }
    }

    async create(user) {
        console.log('Creating user');
        try {
            const newUser = await User.create({
                login: user.login,
                password: user.password,
                age: user.age,
                isDeleted: user.isDeleted
            });
            console.log('Created user successfully');
            return newUser.id;
        } catch (e) {
            console.error('Error creating user', e);
            throw e;
        }
    }

    async update(target, source) {
        console.log(`Updating user ${target.id}`);
        try {
            target.login = source.login;
            target.password = source.password;
            target.age = source.age;
            target.isDeleted = source.isDeleted;
            await target.save();
            console.log(`Updated user ${target.id} successfully`);
        } catch (e) {
            console.error(`Error updating user ${target.id}`);
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
        console.log('Suggesting users');
        try {
            const users = await User.findAll({
                where: { isDeleted: false },
                attributes: { exclude: this.exclude },
                order: [['login', 'ASC']],
                limit
            });
            console.log('Suggested users successfully');
            return users;
        } catch (e) {
            console.error('Error suggesting users', e);
            throw e;
        }
    }

    async delete(user) {
        console.log(`Deleting user by id ${user.id}`);
        try {
            await User.destroy({
                where: { id: user.id }
            });
            console.log(`Deleted user by id ${user.id} successfully`);
        } catch (e) {
            console.error(`Error deleting user by id ${user.id}`, e);
            throw e;
        }
    }
}
