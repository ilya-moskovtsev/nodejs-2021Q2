import { v4 as uuidv4 } from 'uuid';
import userLoader from '../loaders/user';

export default class UserService {
    constructor() {
        this.users = userLoader();
    }

    all() {
        return this.users
            .filter(user => user.isDeleted === false)
            .map(user => {
                const { ...copy } = user;
                delete copy.password;
                delete copy.isDeleted;

                return copy;
            });
    }

    find(user_id) {
        const user = this.users
            .filter(u => u.isDeleted === false)
            .find(u => u.id === user_id);

        if (user) {
            const { ...copy } = user;
            delete copy.password;
            delete copy.isDeleted;

            return copy;
        }

        return undefined;
    }

    create(user) {
        const id = uuidv4();
        this.users.push({ ...user, id });
        return id;
    }

    update(target, source) {
        const user = this.users
            .filter(u => u.isDeleted === false)
            .find(u => u.id === target.id);

        const { ...copy } = Object.assign(user, source);
        delete copy.password;
        delete copy.isDeleted;

        return copy;
    }

    /**
     * Get auto-suggest list from limit users,
     * sorted by login property and
     * filtered by loginSubstring in the login property
     * @param loginSubstring
     * @param limit
     * @returns {User[]}
     */
    getAutoSuggestUsers(loginSubstring, limit) {
        const suggestedUsers = [];
        this.users
            .filter(u => u.isDeleted === false)
            .every(user => {
                if (suggestedUsers.length === Number(limit)) {
                    return false;
                }

                if (user.login.includes(loginSubstring)) {
                    suggestedUsers.push(user);
                }

                return true;
            });

        return suggestedUsers
            .map(user => {
                const { ...copy } = user;
                delete copy.password;
                delete copy.isDeleted;

                return copy;
            })
            .sort((a, b) => a.login.localeCompare(b.login));
    }

    delete(user) {
        const result = this.users.findIndex(element => {
            if (element.id === user.id) {
                if (element.isDeleted) {
                    return false;
                }

                element.isDeleted = true;
                return true;
            }
        });

        return result !== -1;
    }
}
