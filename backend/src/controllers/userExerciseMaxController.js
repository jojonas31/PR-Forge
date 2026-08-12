import { UserExerciseMax, Exercise } from "../models/index.js";
import { getUserStrengthSummary } from "../services/maxService.js";

const upsertUserMax = async (req, res) => {
  try {
    const userId = req.user.id;
    const { one_rep_max, exercise_id } = req.body;

    if (!exercise_id || !one_rep_max) {
      return res.status(400).json({ error: "ID and 1RM are required" });
    }

    const existingMax = await UserExerciseMax.findOne({
      where: { user_id: userId, exercise_id: exercise_id },
    });

    if (existingMax) {
      existingMax.one_rep_max = one_rep_max;
      await existingMax.save();

      return res.status(200).json(existingMax);
    } else {
      const newMax = await UserExerciseMax.create({
        user_id: userId,
        exercise_id: exercise_id,
        one_rep_max: one_rep_max,
      });
      return res.status(201).json(newMax);
    }
  } catch (error) {
    console.error("Error saving user max:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserStrength = async (req, res) => {
  try {
    const userId = req.user.id;

    const strengthSummary = await getUserStrengthSummary(userId);

    return res.status(200).json(strengthSummary);
  } catch (error) {
    console.error("Error calculating user strength:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getUserMaxes = async (req, res) => {
  try {
    const userId = req.user.id;
    const allMaxes = await UserExerciseMax.findAll({
      where: { user_id: userId },
      include: [{ model: Exercise, attributes: ["name"] }],
    });

    return res.status(200).json(allMaxes);
  } catch (error) {
    console.error("Error getting user max:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getUserMaxes, upsertUserMax, getUserStrength };
