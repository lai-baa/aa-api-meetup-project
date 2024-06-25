'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId', 
        // onDelete: 'CASCADE' 
      });

      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId', 
        // onDelete: 'CASCADE' 
      });

      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId', 
        onDelete: 'CASCADE',
        hooks: true
      });

      Event.belongsToMany(
        models.User,
        { through: models.Attendance,
          foreignKey: 'eventId',
          otherKey: 'userId'
        }
      );
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Months are zero-indexed
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Online', 'In Person'),
      allowNull: false,
      validate: {
        typeValidator(val){
          if(val !== 'Online' || val !== 'In Person'){
            throw new Error("Type must be Online or In Person")
          }
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isDecimal: true,
        priceValidator(val){
          if(val < 0){
            throw new Error("Price is invalid")
          }
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: getCurrentDate()
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isBefore: this.startDate
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};