import express from "express";
import {v4 as uuidv4} from 'uuid';

const router = express.Router();
const users = [{
    id: uuidv4(),
    login: "lonely user",
    password: "hide me",
    age: 100,
    isDeleted: false
}];

router.param('user_id', (req, res, next, user_id) => {
    req.user = users.find(user => user.id === user_id);
    if (req.user) {
        next();
    } else {
        res.status(404).json({message: `User with id ${user_id} not found`});
    }
});

router.get('/:user_id', (req, res) => {
    res.json(req.user);
});

router.get('/', (req, res) => {
    res.json(users);
});

router.post('/', (req, res) => {
    const id = uuidv4();
    users.push({...req.body, id});
    res.json({id});
});

router.put('/:user_id', (req, res) => {
    Object.assign(req.user, req.body);
    res.json(req.user);
});

exports.userRoutes = router;
exports.users = users;