import { Exercise } from "../models/index.js";

const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll({
      where: {
        metric_type: "TRADITIONAL",
      },
    });

    return res.status(200).json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getAllExercises };
