import express from 'express';
import GroupController from '../controllers/group.controller';

const router = express.Router();
const groupController = new GroupController();

router.param('group_id', groupController.findById());

router.get('/:group_id', groupController.getGroup());

router.get('/', groupController.getGroups());

router.post('/', groupController.create());

router.post('/:group_id', groupController.addUsersToGroup());

router.put('/:group_id', groupController.update());

router.delete('/:group_id', groupController.delete());

exports.groupRoutes = router;
