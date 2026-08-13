import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import generateToken from "../../utils/generateToken.js";
import bcrypt from "bcrypt";

import app from "../../app.js";
import sequelize from "../../config/database.js";
import { User } from "../../models/index.js";

async function createUserFixture() {
  const plainPassword = "password123";

  const user = await User.create({
    username: "test-user",
    email: "test@example.com",
    password: await bcrypt.hash(plainPassword, 10),
  });

  return {
    user,
    plainPassword,
  };
}

describe("Users API", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await User.destroy({
      where: {},
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /api/users/register", () => {
    it("registers a user and stores the hashed password", async () => {
      const userData = {
        username: "test-user",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app).post("/api/users/register").send(userData);

      expect(response.status).toBe(201);

      expect(response.body).toMatchObject({
        user: {
          username: userData.username,
          email: userData.email,
        },
        token: expect.any(String),
      });

      expect(response.body.user.password).toBeUndefined();

      const savedUser = await User.findOne({
        where: {
          email: userData.email,
        },
      });

      expect(savedUser).not.toBeNull();
      expect(savedUser.password).not.toBe(userData.password);

      const passwordMatches = await bcrypt.compare(userData.password, savedUser.password);

      expect(passwordMatches).toBe(true);
    });

    it("returns 400 when required data is missing", async () => {
      const response = await request(app).post("/api/users/register").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Username, email and password are required",
      });

      expect(await User.count()).toBe(0);
    });

    it("returns 400 when the password is shorter than 8 characters", async () => {
      const response = await request(app).post("/api/users/register").send({
        username: "test-user",
        email: "test@example.com",
        password: "short",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Password must contain at least 8 characters",
      });
      expect(await User.count()).toBe(0);
    });

    it("returns 409 when the email is already registered", async () => {
      const firstUser = {
        username: "first-user",
        email: "duplicate@example.com",
        password: "password123",
      };

      const firstResponse = await request(app).post("/api/users/register").send(firstUser);

      expect(firstResponse.status).toBe(201);

      const response = await request(app).post("/api/users/register").send({
        username: "second-user",
        email: firstUser.email,
        password: "another-password",
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        error: "Username or email already in use",
      });

      expect(await User.count()).toBe(1);
    });
  });

  describe("POST /api/users/login", () => {
    it("logs in with valid credentials", async () => {
      const { user, plainPassword } = await createUserFixture();

      const response = await request(app).post("/api/users/login").send({
        email: user.email,
        password: plainPassword,
      });

      expect(response.status).toBe(200);

      expect(response.body).toMatchObject({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token: expect.any(String),
      });

      expect(response.body.user.password).toBeUndefined();
    });

    it("returns 401 when the password is incorrect", async () => {
      const { user } = await createUserFixture();

      const response = await request(app).post("/api/users/login").send({
        email: user.email,
        password: "incorrect-password",
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: "Invalid credentials",
      });
    });
  });

  describe("GET /api/users/profile", () => {
    it("returns the authenticated user profile", async () => {
      const { user } = await createUserFixture();
      const token = generateToken(user.id);

      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);

      expect(response.body).toMatchObject({
        id: user.id,
        username: user.username,
        email: user.email,
        level: 1,
        experience: 0,
      });

      expect(response.body.password).toBeUndefined();
    });

    it("rejects requests without a valid token", async () => {
      const missingTokenResponse = await request(app).get("/api/users/profile");

      expect(missingTokenResponse.status).toBe(401);
      expect(missingTokenResponse.body).toEqual({
        error: "Missing token",
      });

      const invalidTokenResponse = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer invalid-token");

      expect(invalidTokenResponse.status).toBe(401);
      expect(invalidTokenResponse.body).toEqual({
        error: "Invalid token",
      });
    });
  });
});
