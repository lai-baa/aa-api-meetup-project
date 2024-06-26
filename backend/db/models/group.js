'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, {
        as: 'Organizer',
        foreignKey: 'organizerId', 
      });

      Group.hasMany(models.Event, {
        foreignKey: 'groupId', 
        onDelete: 'CASCADE',
        hooks: true
      });

      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId', 
        as: 'GroupImages',
        onDelete: 'CASCADE',
        hooks: true
      });

      Group.hasMany(models.Venue, {
        foreignKey: 'groupId', 
        onDelete: 'CASCADE',
        as: 'Venues',
        hooks: true
      });

      Group.belongsToMany(
        models.User,
        { through: models.Membership,
          foreignKey: 'groupId',
          otherKey: 'userId',
          as: 'Members'
        }
      );

      Group.hasMany(models.Membership, { foreignKey: 'groupId' }); // Add this line
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 60]
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50, 10000]
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false,
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};