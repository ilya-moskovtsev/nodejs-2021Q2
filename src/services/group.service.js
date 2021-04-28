import db from '../loaders/database';

const Group = db.group;
const User = db.user;

export default class GroupService {
    async findAll() {
        console.log('Finding all groups');
        try {
            const groups = await Group.findAll();
            console.log('Found all groups successfully');
            return groups;
        } catch (e) {
            console.error('Error finding all groups', e);
        }
    }

    async findById(group_id) {
        console.log(`Finding group by id ${group_id}`);
        try {
            const group = await Group.findByPk(group_id);
            console.log(`Found group by id ${group_id} successfully`);
            return group;
        } catch (e) {
            console.error(`Error finding group by id ${group_id}`, e);
        }
    }

    async create(group) {
        console.log('Creating group');
        try {
            const newgroup = await Group.create({
                name: group.name,
                permissions: group.permissions
            });
            console.log('Created group successfully');
            return newgroup.id;
        } catch (e) {
            console.error('Error creating group', e);
        }
    }

    async addUsersToGroup(group, userIds) {
        console.log(`Adding ${userIds.length} users to group ${group.id}`);
        try {
            const promises = userIds.map(user_id => User.findByPk(user_id));
            const users = await Promise.all(promises);
            await group.addUsers(users);
            console.log(`Added ${await group.countUsers()} users to group ${group.id} successfully`);
        } catch (e) {
            console.error(`Error adding users to group ${group.id}`);
        }
    }

    async update(target, source) {
        console.log(`Updating group ${target.id}`);
        try {
            target.name = source.name;
            target.permissions = source.permissions;
            await target.save();
            console.log(`Updated group ${target.id} successfully`);
        } catch (e) {
            console.error(`Error updating group ${target.id}`);
        }
    }

    async delete(group) {
        console.log(`Deleting group by id ${group.id}`);
        try {
            await Group.destroy({
                where: { id: group.id }
            });
            console.log(`Deleted group by id ${group.id} successfully`);
        } catch (e) {
            console.error(`Error deleting group by id ${group.id}`, e);
        }
    }
}
