'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    static associate(models) {
      // Associazione uno molti, ogni Stato può essere associato a più Todos
      State.hasMany(models.Todo, {
        foreignKey: 'stateId',
        as: 'todos',
      });
    }
  }
  State.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'State',
      timestamps: false,
    }
  );
  return State;
};
