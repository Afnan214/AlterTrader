// server/models/user.js  (ESM)
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define associations here, e.g.:
      // User.hasMany(models.Post);
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      balance: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "User",
      // tableName: "Users",     // uncomment if your table name is explicitly "Users"
      // timestamps: true,       // uncomment if you use createdAt/updatedAt
    }
  );

  return User;
};