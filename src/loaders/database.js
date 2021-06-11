import { Sequelize } from 'sequelize';

import logger from '../loaders/logger';

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/user.model')(sequelize, Sequelize);
db.group = require('../models/group.model')(sequelize, Sequelize);
db.user.belongsToMany(db.group, { through: 'UserGroup' });
db.group.belongsToMany(db.user, { through: 'UserGroup' });

sequelize.authenticate()
    .then(() => logger.info('Connection has been established successfully.'))
    .catch(error => logger.error('Unable to connect to the database:', error));

export default db;
