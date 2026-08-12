import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Routine = sequelize.define(
  "Routine",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logic_engine: {
      type: DataTypes.STRING,
      defaultValue: "MANUAL",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Routine;
