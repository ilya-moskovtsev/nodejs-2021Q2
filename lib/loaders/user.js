import { v4 as uuidv4 } from 'uuid';

export default () => {
    return [{
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
};
