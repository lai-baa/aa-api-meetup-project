'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupImage.belongsTo(models.Group, {
        foreignKey: 'groupId', 
        // onDelete: 'CASCADE' 
      });
    }
  };

  GroupImage.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        groupImageValidate(val){
          if(val !== true || val !== false){
            throw new Error('Preview field must be true or false');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};