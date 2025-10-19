// server/models/post.js  (ESM)
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // Post.belongsTo(models.User);
    }
  }

  Post.init(
    {
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Post",
      // tableName: "Posts",
    }
  );

  return Post;
};
