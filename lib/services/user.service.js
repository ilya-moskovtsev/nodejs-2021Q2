import { v4 as uuidv4 } from 'uuid';

export default class UserService {
    constructor() {
        this.users = [{
            id: uuidv4(),
            login: 'c lonely user',
            password: 'hide me',
            age: 100,
            isDeleted: false
        }, {
            id: uuidv4(),
            login: 'a lonely user',
            password: 'hide me',
            age: 100,
            isDeleted: false
        }, {
            id: uuidv4(),
            login: 'b lonely user',
            password: 'hide me',
            age: 100,
            isDeleted: false
        }];
    }

    all() {
        return this.users;
    }

    find(user_id) {
        return this.users.find(user => user.id === user_id);
    }

    create(user) {
        const id = uuidv4();
        this.users.push({ ...user, id });
        return id;
    }

    update(target, source) {
        Object.assign(target, source);
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
        this.users.every(user => {
            if (suggestedUsers.length === Number(limit)) {
                return false;
            }

            if (user.login.includes(loginSubstring)) {
                suggestedUsers.push(user);
            }

            return true;
        });

        return suggestedUsers.sort((a, b) => a.login.localeCompare(b.login));
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
