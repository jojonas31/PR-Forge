import User from "./user.js";
import Exercise from "./exercise.js";
import Routine from "./routine.js";
import WorkoutSession from "./workout_session.js";
import ExerciseLog from "./exercise_log.js";
import UserExerciseMax from "./user_exercise_max.js";
import RoutineDay from "./routine_day.js";
import RoutineDayExercise from "./routine_day_exercise.js";

// User associations
User.hasMany(WorkoutSession, { foreignKey: "user_id" });
WorkoutSession.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserExerciseMax, { foreignKey: "user_id" });
UserExerciseMax.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Routine, { foreignKey: "user_id" });
Routine.belongsTo(User, { foreignKey: "user_id" });

Routine.hasMany(RoutineDay, {
  foreignKey: "routine_id",
  as: "days",
  onDelete: "CASCADE",
});
RoutineDay.belongsTo(Routine, {
  foreignKey: "routine_id",
});

RoutineDay.belongsToMany(Exercise, {
  through: RoutineDayExercise,
  foreignKey: "routine_day_id",
  otherKey: "exercise_id",
  as: "exercises",
});
Exercise.belongsToMany(RoutineDay, {
  through: RoutineDayExercise,
  foreignKey: "exercise_id",
  otherKey: "routine_day_id",
  as: "routineDays",
});

// Workout associations
Routine.hasMany(WorkoutSession, {
  foreignKey: "routine_id",
});
WorkoutSession.belongsTo(Routine, {
  foreignKey: "routine_id",
});

RoutineDay.hasMany(WorkoutSession, {
  foreignKey: "routine_day_id",
  as: "workoutSessions",
});
WorkoutSession.belongsTo(RoutineDay, {
  foreignKey: "routine_day_id",
  as: "routineDay",
});

WorkoutSession.hasMany(ExerciseLog, {
  foreignKey: "workout_session_id",
  as: "exerciseLogs",
  onDelete: "CASCADE",
});

ExerciseLog.belongsTo(WorkoutSession, {
  foreignKey: "workout_session_id",
  as: "workoutSession",
});

// Exercise tracking associations
Exercise.hasMany(ExerciseLog, { foreignKey: "exercise_id" });
ExerciseLog.belongsTo(Exercise, { foreignKey: "exercise_id" });

Exercise.hasMany(UserExerciseMax, { foreignKey: "exercise_id" });
UserExerciseMax.belongsTo(Exercise, { foreignKey: "exercise_id" });

export {
  User,
  Exercise,
  Routine,
  WorkoutSession,
  ExerciseLog,
  UserExerciseMax,
  RoutineDay,
  RoutineDayExercise,
};
