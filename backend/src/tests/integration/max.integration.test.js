import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../app.js";
import sequelize from "../../config/database.js";
import generateToken from "../../utils/generateToken.js";

import { Exercise, User, UserExerciseMax } from "../../models/index.js";

async function createMaxFixture() {
  const user = await User.create({
    username: "max-user",
    email: "max@example.com",
    password: "hashed-password",
  });

  const exercise = await Exercise.create({
    name: "Bench Press",
    metric_type: "TRADITIONAL",
    strength_factor: 2.4,
  });

  return {
    user,
    exercise,
    token: generateToken(user.id),
  };
}

describe("User exercise maxes API", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await UserExerciseMax.destroy({ where: {} });
    await Exercise.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /api/maxes", () => {
    it("creates and then updates the same user exercise max", async () => {
      const { user, exercise, token } = await createMaxFixture();

      const createResponse = await request(app)
        .post("/api/maxes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          exercise_id: exercise.id,
          one_rep_max: 100,
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.user_id).toBe(user.id);
      expect(createResponse.body.exercise_id).toBe(exercise.id);
      expect(Number(createResponse.body.one_rep_max)).toBe(100);

      const updateResponse = await request(app)
        .post("/api/maxes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          exercise_id: exercise.id,
          one_rep_max: 120,
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.id).toBe(createResponse.body.id);
      expect(Number(updateResponse.body.one_rep_max)).toBe(120);

      const storedMaxes = await UserExerciseMax.findAll({
        where: {
          user_id: user.id,
          exercise_id: exercise.id,
        },
      });

      expect(storedMaxes).toHaveLength(1);
      expect(Number(storedMaxes[0].one_rep_max)).toBe(120);
    });

    it("returns 400 when the 1RM is not positive", async () => {
      const { exercise, token } = await createMaxFixture();

      const response = await request(app)
        .post("/api/maxes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          exercise_id: exercise.id,
          one_rep_max: -100,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "ID and a positive 1RM are required" });
      expect(await UserExerciseMax.count()).toBe(0);
    });
  });
});
