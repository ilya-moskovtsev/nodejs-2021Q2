import express from 'express';
import AuthController from '../controllers/auth.controller';
import GroupController from '../controllers/group.controller';

const router = express.Router();
const authController = new AuthController();
const groupController = new GroupController();

router.param('group_id', authController.checkToken(), groupController.findById());

router.get('/:group_id', authController.checkToken(), groupController.getGroup());

router.get('/', authController.checkToken(), groupController.getGroups());

router.post('/', authController.checkToken(), groupController.create());

router.post('/:group_id', authController.checkToken(), groupController.addUsersToGroup());

router.put('/:group_id', authController.checkToken(), groupController.update());

router.delete('/:group_id', authController.checkToken(), groupController.delete());

exports.groupRoutes = router;
