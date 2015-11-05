'use strict';
module.exports = function(sequelize, DataTypes) {
  var favorite = sequelize.define('favorite', {
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.favorite.belongsTo(models.user);
      }
    }
  });
  return favorite;
};
