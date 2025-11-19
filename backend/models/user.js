'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      //Associazione uno a molti, uno User ha molti Todos
      User.hasMany(models.Todo, {
        foreignKey: 'UserId',
        as: 'todos',
      });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      secondName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
    }
  );
  return User;
};
