import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../app.js";
import sequelize from "../../config/database.js";
import generateToken from "../../utils/generateToken.js";

import {
  Exercise,
  ExerciseLog,
  Routine,
  RoutineDay,
  RoutineDayExercise,
  User,
  UserExerciseMax,
  WorkoutSession,
} from "../../models/index.js";

async function createWorkoutFixture() {
  const user = await User.create({
    username: "workout-user",
    email: "workout@example.com",
    password: "hashed-password",
  });

  const exercise = await Exercise.create({
    name: "Bench Press",
    metric_type: "TRADITIONAL",
    strength_factor: 2.4,
  });

  const routine = await Routine.create({
    user_id: user.id,
    name: "Strength Routine",
    logic_engine: "MANUAL",
    is_active: true,
  });

  const routineDay = await RoutineDay.create({
    routine_id: routine.id,
    day_number: 1,
  });

  await RoutineDayExercise.create({
    routine_day_id: routineDay.id,
    exercise_id: exercise.id,
    sets: 3,
    reps: 5,
    sequence_number: 1,
  });

  return {
    user,
    exercise,
    routine,
    routineDay,
    token: generateToken(user.id),
  };
}

describe("Workouts API", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await ExerciseLog.destroy({ where: {} });
    await WorkoutSession.destroy({ where: {} });
    await UserExerciseMax.destroy({ where: {} });
    await RoutineDayExercise.destroy({ where: {} });
    await RoutineDay.destroy({ where: {} });
    await Routine.destroy({ where: {} });
    await Exercise.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /api/workouts/history", () => {
    it("saves a workout and its main side effects", async () => {
      const { user, exercise, routine, routineDay, token } = await createWorkoutFixture();

      const response = await request(app)
        .post("/api/workouts/history")
        .set("Authorization", `Bearer ${token}`)
        .send({
          routine_id: routine.id,
          routine_day_id: routineDay.id,
          notes: "Good workout",
          exercise_logs: [
            {
              exercise_id: exercise.id,
              set_number: 1,
              weight: 100,
              reps: 5,
            },
          ],
        });

      expect(response.status).toBe(201);

      expect(response.body).toMatchObject({
        message: "Workout saved successfully",
        sessionId: expect.any(String),
        experience: {
          gained: 100,
          current: 100,
        },
      });

      const storedSession = await WorkoutSession.findByPk(response.body.sessionId);

      expect(storedSession).not.toBeNull();
      expect(storedSession.user_id).toBe(user.id);
      expect(storedSession.routine_id).toBe(routine.id);

      const storedLogs = await ExerciseLog.findAll({
        where: {
          workout_session_id: storedSession.id,
        },
      });

      expect(storedLogs).toHaveLength(1);
      expect(storedLogs[0].exercise_id).toBe(exercise.id);

      const storedMaxCount = await UserExerciseMax.count({
        where: {
          user_id: user.id,
          exercise_id: exercise.id,
        },
      });

      expect(storedMaxCount).toBe(1);

      await user.reload();

      expect(user.experience).toBe(100);
    });

    it("returns 400 when the exercise does not belong to the routine day", async () => {
      const { routine, routineDay, token } = await createWorkoutFixture();
      const otherExercise = await Exercise.create({
        name: "Back Squat",
        metric_type: "TRADITIONAL",
        strength_factor: 3,
      });

      const response = await request(app)
        .post("/api/workouts/history")
        .set("Authorization", `Bearer ${token}`)
        .send({
          routine_id: routine.id,
          routine_day_id: routineDay.id,
          exercise_logs: [
            {
              exercise_id: otherExercise.id,
              set_number: 1,
              weight: 100,
              reps: 5,
            },
          ],
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Exercise does not belong to routine day" });
      expect(await WorkoutSession.count()).toBe(0);
    });

    it("returns 400 when an exercise log has invalid values", async () => {
      const { exercise, routine, routineDay, token } = await createWorkoutFixture();

      const response = await request(app)
        .post("/api/workouts/history")
        .set("Authorization", `Bearer ${token}`)
        .send({
          routine_id: routine.id,
          routine_day_id: routineDay.id,
          exercise_logs: [
            {
              exercise_id: exercise.id,
              set_number: 1,
              weight: -10,
              reps: 5,
            },
          ],
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid exercise log values" });
      expect(await WorkoutSession.count()).toBe(0);
    });
  });
});
