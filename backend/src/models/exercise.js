import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Exercise = sequelize.define(
  "Exercise",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    metric_type: {
      type: DataTypes.ENUM("TRADITIONAL", "ISOMETRIC", "GRIP"),
      allowNull: false,
    },
    strength_factor: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    // Catalog entries are static reference data
    timestamps: false,
  },
);

export default Exercise;
