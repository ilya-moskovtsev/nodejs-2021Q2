import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/postgres');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/user.model')(sequelize, Sequelize);
db.group = require('../models/group.model')(sequelize, Sequelize);
db.user.belongsToMany(db.group, { through: 'UserGroup' });
db.group.belongsToMany(db.user, { through: 'UserGroup' });

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error));

export default db;
