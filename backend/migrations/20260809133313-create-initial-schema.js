"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        "Users",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
          },
          username: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          level: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
          },
          experience: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction },
      );

      await queryInterface.addConstraint("Users", {
        fields: ["username"],
        type: "unique",
        name: "users_username_unique",
        transaction,
      });

      await queryInterface.addConstraint("Users", {
        fields: ["email"],
        type: "unique",
        name: "users_email_unique",
        transaction,
      });

      await queryInterface.createTable(
        "Exercises",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          metric_type: {
            type: Sequelize.ENUM("TRADITIONAL", "ISOMETRIC", "GRIP"),
            allowNull: false,
          },
          strength_factor: {
            type: Sequelize.DECIMAL(4, 2),
            allowNull: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
        },
        { transaction },
      );

      await queryInterface.addConstraint("Exercises", {
        fields: ["name"],
        type: "unique",
        name: "exercises_name_unique",
        transaction,
      });

      await queryInterface.createTable(
        "Routines",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          logic_engine: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "MANUAL",
          },
          is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "Users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        "RoutineDays",
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          day_number: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          routine_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "Routines",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction },
      );

      await queryInterface.addConstraint("RoutineDays", {
        fields: ["routine_id", "day_number"],
        type: "unique",
        name: "routine_days_routine_day_unique",
        transaction,
      });

      await queryInterface.createTable(
        "RoutineDayExercises",
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          sets: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          reps: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          target_time: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          sequence_number: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          routine_day_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "RoutineDays",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          exercise_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "Exercises",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
        },
        { transaction },
      );

      await queryInterface.addConstraint("RoutineDayExercises", {
        fields: ["routine_day_id", "exercise_id"],
        type: "unique",
        name: "routine_day_exercises_day_exercise_unique",
        transaction,
      });

      await queryInterface.addConstraint("RoutineDayExercises", {
        fields: ["routine_day_id", "sequence_number"],
        type: "unique",
        name: "routine_day_exercises_day_sequence_unique",
        transaction,
      });

      await queryInterface.createTable(
        "WorkoutSessions",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
          },
          date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_DATE"),
          },
          notes: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "Users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          routine_id: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: "Routines",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          routine_day_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: "RoutineDays",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        "ExerciseLogs",
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          set_number: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          weight: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: true,
          },
          reps: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          duration_seconds: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          is_pr: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          workout_session_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "WorkoutSessions",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          exercise_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "Exercises",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        "UserExerciseMaxes",
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          one_rep_max: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: false,
          },
          date_achieved: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_DATE"),
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "Users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          exercise_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: "Exercises",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction },
      );

      await queryInterface.addConstraint("UserExerciseMaxes", {
        fields: ["user_id", "exercise_id"],
        type: "unique",
        name: "user_exercise_maxes_user_exercise_unique",
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable("UserExerciseMaxes", { transaction });
      await queryInterface.dropTable("ExerciseLogs", { transaction });
      await queryInterface.dropTable("WorkoutSessions", { transaction });
      await queryInterface.dropTable("RoutineDayExercises", { transaction });
      await queryInterface.dropTable("RoutineDays", { transaction });
      await queryInterface.dropTable("Routines", { transaction });
      await queryInterface.dropTable("Exercises", { transaction });
      await queryInterface.dropTable("Users", { transaction });

      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Exercises_metric_type";', {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
