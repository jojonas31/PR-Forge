import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RoutineDayExercise = sequelize.define(
  "RoutineDayExercise",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    sets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },

    reps: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },

    target_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    sequence_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["routine_day_id", "sequence_number"],
      },
    ],
  },
);

export default RoutineDayExercise;
