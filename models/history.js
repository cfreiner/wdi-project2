'use strict';
module.exports = function(sequelize, DataTypes) {
  var history = sequelize.define('history', {
    userId: DataTypes.INTEGER,
    placeId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.history.belongsTo(models.user);
      }
    }
  });
  return history;
};
