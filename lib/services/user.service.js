import {v4 as uuidv4} from "uuid";

export default class UserService {
    constructor() {
        this.users = [{
            id: uuidv4(),
            login: "lonely user",
            password: "hide me",
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
        this.users.push({...user, id});
        return id;
    }

    update(target, source) {
        Object.assign(target, source);
    }
}
