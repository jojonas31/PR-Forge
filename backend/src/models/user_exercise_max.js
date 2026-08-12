import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserExerciseMax = sequelize.define(
  "UserExerciseMax",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    one_rep_max: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    date_achieved: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  },
);

export default UserExerciseMax;
