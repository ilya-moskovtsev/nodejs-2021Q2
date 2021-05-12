module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('group', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        permissions: {
            type: DataTypes.ARRAY(DataTypes.ENUM('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')),
            allowNull: false
        }
    });

    return Group;
};
