import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../app.js";
import sequelize from "../../config/database.js";
import generateToken from "../../utils/generateToken.js";

import { Exercise, Routine, RoutineDay, RoutineDayExercise, User } from "../../models/index.js";

async function createRoutineFixture() {
  const user = await User.create({
    username: "routine-user",
    email: "routine@example.com",
    password: "hashed-password",
  });

  const exercise = await Exercise.create({
    name: "Bench Press",
    metric_type: "TRADITIONAL",
    description: "Barbell bench press",
  });

  return {
    user,
    exercise,
    token: generateToken(user.id),
  };
}

describe("Routines API", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await RoutineDayExercise.destroy({ where: {} });
    await RoutineDay.destroy({ where: {} });
    await Routine.destroy({ where: {} });
    await Exercise.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /api/routines", () => {
    it("creates a routine with its days and exercises", async () => {
      const { user, exercise, token } = await createRoutineFixture();

      const routineData = {
        name: "Push Day",
        logic_engine: "MANUAL",
        days: [
          {
            day_number: 1,
            exercises: [
              {
                exercise_id: exercise.id,
                sets: 4,
                reps: 8,
                sequence_number: 1,
              },
            ],
          },
        ],
      };

      const response = await request(app)
        .post("/api/routines")
        .set("Authorization", `Bearer ${token}`)
        .send(routineData);

      expect(response.status).toBe(201);

      expect(response.body).toMatchObject({
        user_id: user.id,
        name: routineData.name,
        logic_engine: routineData.logic_engine,
        is_active: true,
      });

      expect(response.body.days).toHaveLength(1);
      expect(response.body.days[0].day_number).toBe(1);
      expect(response.body.days[0].exercises).toHaveLength(1);

      expect(response.body.days[0].exercises[0]).toMatchObject({
        id: exercise.id,
        name: exercise.name,
        RoutineDayExercise: {
          sets: 4,
          reps: 8,
          sequence_number: 1,
        },
      });

      const storedRoutine = await Routine.findOne({
        where: {
          user_id: user.id,
        },
      });

      expect(storedRoutine).not.toBeNull();
      expect(storedRoutine.name).toBe(routineData.name);

      expect(await RoutineDay.count()).toBe(1);
      expect(await RoutineDayExercise.count()).toBe(1);
    });

    it("returns 400 when the routine has no days", async () => {
      const { token } = await createRoutineFixture();

      const response = await request(app)
        .post("/api/routines")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Invalid Routine",
          logic_engine: "MANUAL",
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "A routine must contain at least one day",
      });

      expect(await Routine.count()).toBe(0);
    });
  });

  describe("GET /api/routines", () => {
    it("returns only the authenticated user's routines", async () => {
      const { user, token } = await createRoutineFixture();

      const ownRoutine = await Routine.create({
        user_id: user.id,
        name: "My Routine",
        logic_engine: "MANUAL",
        is_active: true,
      });

      const otherUser = await User.create({
        username: "other-user",
        email: "other@example.com",
        password: "hashed-password",
      });

      await Routine.create({
        user_id: otherUser.id,
        name: "Other User Routine",
        logic_engine: "MANUAL",
        is_active: true,
      });

      const response = await request(app)
        .get("/api/routines")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);

      expect(response.body[0]).toMatchObject({
        id: ownRoutine.id,
        user_id: user.id,
        name: "My Routine",
      });
    });
  });

  describe("Active routine behavior", () => {
    it("deactivates the previous routine and returns the new one as active", async () => {
      const { user, exercise, token } = await createRoutineFixture();

      const previousRoutine = await Routine.create({
        user_id: user.id,
        name: "Previous Routine",
        logic_engine: "MANUAL",
        is_active: true,
      });

      const newRoutineData = {
        name: "New Routine",
        logic_engine: "MANUAL",
        days: [
          {
            day_number: 1,
            exercises: [
              {
                exercise_id: exercise.id,
                sets: 3,
                reps: 10,
                sequence_number: 1,
              },
            ],
          },
        ],
      };

      const createResponse = await request(app)
        .post("/api/routines")
        .set("Authorization", `Bearer ${token}`)
        .send(newRoutineData);

      expect(createResponse.status).toBe(201);

      await previousRoutine.reload();

      expect(previousRoutine.is_active).toBe(false);
      expect(createResponse.body.is_active).toBe(true);

      const activeRoutineCount = await Routine.count({
        where: {
          user_id: user.id,
          is_active: true,
        },
      });

      expect(activeRoutineCount).toBe(1);

      const activeResponse = await request(app)
        .get("/api/routines/active")
        .set("Authorization", `Bearer ${token}`);

      expect(activeResponse.status).toBe(200);
      expect(activeResponse.body.id).toBe(createResponse.body.id);
    });
  });
});
