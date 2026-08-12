import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RoutineDay = sequelize.define(
  "RoutineDay",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    day_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 7,
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["routine_id", "day_number"],
      },
    ],
  },
);

export default RoutineDay;
