import db from '../loaders/database';
import logger from '../loaders/logger';

const Group = db.group;
const User = db.user;

export default class GroupService {
    async findAll() {
        logger.info('Finding all groups');
        try {
            const groups = await Group.findAll();
            logger.info('Found all groups successfully');
            return groups;
        } catch (e) {
            logger.error('Error finding all groups', e);
            throw e;
        }
    }

    async findById(group_id) {
        logger.info(`Finding group by id ${group_id}`);
        try {
            const group = await Group.findByPk(group_id);
            logger.info(`Found group by id ${group_id} successfully`);
            return group;
        } catch (e) {
            logger.error(`Error finding group by id ${group_id}`, e);
            throw e;
        }
    }

    async create(group) {
        logger.info('Creating group');
        try {
            const newgroup = await Group.create({
                name: group.name,
                permissions: group.permissions
            });
            logger.info('Created group successfully');
            return newgroup.id;
        } catch (e) {
            logger.error('Error creating group', e);
            throw e;
        }
    }

    async addUsersToGroup(group, userIds) {
        logger.info(`Adding ${userIds.length} users to group ${group.id}`);
        try {
            await db.sequelize.transaction(async transaction => {
                const promises = userIds.map(user_id => User.findByPk(user_id, { transaction }));
                const users = await Promise.all(promises);
                await group.addUsers(users, { transaction });
                logger.info(`Added ${await group.countUsers({ transaction })} users to group ${group.id} successfully`);
            });
        } catch (e) {
            logger.error(`Error adding users to group ${group.id}`);
            throw e;
        }
    }

    async update(target, source) {
        logger.info(`Updating group ${target.id}`);
        try {
            target.name = source.name;
            target.permissions = source.permissions;
            await target.save();
            logger.info(`Updated group ${target.id} successfully`);
        } catch (e) {
            logger.error(`Error updating group ${target.id}`);
            throw e;
        }
    }

    async delete(group) {
        logger.info(`Deleting group by id ${group.id}`);
        try {
            await Group.destroy({
                where: { id: group.id }
            });
            logger.info(`Deleted group by id ${group.id} successfully`);
        } catch (e) {
            logger.error(`Error deleting group by id ${group.id}`, e);
            throw e;
        }
    }
}
