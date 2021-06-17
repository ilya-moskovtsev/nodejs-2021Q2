import groupService from '../services/group.service';
import logger from '../loaders/logger';

export default class GroupController {
    constructor() {
        this.groupService = groupService;
    }

    findById() {
        return async (req, res, next, group_id) => {
            try {
                req.group = await this.groupService.findById(group_id);
                if (req.group) {
                    return next();
                }

                res.status(404).json({ message: `Group with id ${group_id} not found` });
            } catch (e) {
                logger.error(`GroupController findById group_id: ${group_id} ${e.message}`);
                return next(e);
            }
        };
    }

    getGroup() {
        return (req, res) => {
            res.json(req.group);
        };
    }

    getGroups() {
        return async (req, res, next) => {
            try {
                res.json(await this.groupService.findAll());
            } catch (e) {
                logger.error(`GroupController getGroups ${e.message}`);
                return next(e);
            }
        };
    }

    create() {
        return async (req, res, next) => {
            try {
                const id = await this.groupService.create(req.body);
                res.json({ id });
            } catch (e) {
                logger.error(`GroupController create group ${req.body} ${e.message}`);
                return next(e);
            }
        };
    }

    addUsersToGroup() {
        return async (req, res, next) => {
            try {
                res.json(await this.groupService.addUsersToGroup(req.group, req.body));
            } catch (e) {
                logger.error(`GroupController addUsersToGroup group ${req.group} userIds ${req.body} ${e.message}`);
                return next(e);
            }
        };
    }

    update() {
        return async (req, res, next) => {
            try {
                res.json(await this.groupService.update(req.group, req.body));
            } catch (e) {
                logger.error(`GroupController update target ${req.group} source ${req.body} ${e.message}`);
                return next(e);
            }
        };
    }

    delete() {
        return async (req, res, next) => {
            try {
                await this.groupService.delete(req.group);
                res.status(204).end();
            } catch (e) {
                logger.error(`GroupController delete group ${req.group} ${e.message}`);
                return next(e);
            }
        };
    }
}
