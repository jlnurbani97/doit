'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      //Associazione uno a uno, il Todo appartiene ad un solo User
      Todo.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      ////Associazione uno a uno, il Todo è associato ad un solo State
      Todo.belongsTo(models.State, {
        foreignKey: 'stateId',
        as: 'state',
      });
    }
  }

  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true,
      },
      startingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Todo',
      timestamps: true,
    }
  );
  return Todo;
};
