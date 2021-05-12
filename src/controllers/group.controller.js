import GroupService from '../services/group.service';

export default class GroupController {
    constructor() {
        this.groupService = new GroupService();
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
                return next(e);
            }
        };
    }

    addUsersToGroup() {
        return async (req, res, next) => {
            try {
                res.json(await this.groupService.addUsersToGroup(req.group, req.body));
            } catch (e) {
                return next(e);
            }
        };
    }

    update() {
        return async (req, res, next) => {
            try {
                res.json(await this.groupService.update(req.group, req.body));
            } catch (e) {
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
                return next(e);
            }
        };
    }
}
