import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

import { getRequiredExperience, getExperiencePercentage } from "../utils/levelCalculations.js";

import { User } from "../models/index.js";

const serializeUser = (user) => {
  const userResponse = user.toJSON();
  delete userResponse.password;
  const level = Number(userResponse.level) || 1;
  const experience = Number(userResponse.experience) || 0;
  const experienceRequired = getRequiredExperience(level);

  return {
    ...userResponse,
    level,
    experience,
    experience_required: experienceRequired,
    experience_percentage: getExperiencePercentage(experience, experienceRequired),
  };
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email and password are required",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        error: "Password must contain at least 8 characters",
      });
    }

    const saltRounds = 10;

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    const token = generateToken(newUser.id);

    return res.status(201).json({
      user: serializeUser(newUser),
      token,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Username or email already in use",
      });
    }

    console.error("Error creating user:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      message: "Login successful",
      user: serializeUser(user),
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json(serializeUser(user));
  } catch (error) {
    console.error("Error fetching user:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export { createUser, loginUser, getUserProfile };
