import GroupService from '../services/group.service';

export default class GroupController {
    constructor() {
        this.groupService = new GroupService();
    }

    findById() {
        return async (req, res, next, group_id) => {
            req.group = await this.groupService.findById(group_id);
            if (req.group) {
                return next();
            }

            res.status(404).json({ message: `Group with id ${group_id} not found` });
        };
    }

    getGroup() {
        return (req, res) => {
            res.json(req.group);
        };
    }

    getGroups() {
        return async (req, res) => {
            res.json(await this.groupService.findAll());
        };
    }

    create() {
        return async (req, res) => {
            const id = await this.groupService.create(req.body);
            res.json({ id });
        };
    }

    addUsersToGroup() {
        return async (req, res) => {
            res.json(await this.groupService.addUsersToGroup(req.group, req.body));
        };
    }

    update() {
        return async (req, res) => {
            res.json(await this.groupService.update(req.group, req.body));
        };
    }

    delete() {
        return async (req, res) => {
            await this.groupService.delete(req.group);
            res.status(204).end();
        };
    }
}
