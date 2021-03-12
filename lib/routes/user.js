import express from "express";
import UserService from "../services/user.service";

const router = express.Router();
const userService = new UserService();

router.param('user_id', (req, res, next, user_id) => {
    req.user = userService.find(user_id);
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
    const {loginSubstring, limit} = req.query;
    if (loginSubstring && limit) {
        res.json(userService.getAutoSuggestUsers(loginSubstring, limit));
    } else {
        res.json(userService.all());
    }
});

router.post('/', (req, res) => {
    const id = userService.create(req.body);
    res.json({id});
});

router.put('/:user_id', (req, res) => {
    userService.update(req.user, req.body);
    res.json(req.user);
});

exports.userRoutes = router;