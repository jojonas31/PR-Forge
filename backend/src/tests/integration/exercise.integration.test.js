import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../app.js";
import sequelize from "../../config/database.js";
import { Exercise } from "../../models/index.js";

describe("Exercises API", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Exercise.destroy({
      where: {},
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("GET /api/exercises", () => {
    it("returns only traditional exercises", async () => {
      await Exercise.bulkCreate([
        {
          name: "Bench Press",
          metric_type: "TRADITIONAL",
        },
        {
          name: "Plank",
          metric_type: "ISOMETRIC",
        },
      ]);

      const response = await request(app).get("/api/exercises");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        name: "Bench Press",
        metric_type: "TRADITIONAL",
      });
    });
  });
});
