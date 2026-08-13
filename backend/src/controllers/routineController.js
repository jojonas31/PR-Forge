import { Routine, RoutineDay, RoutineDayExercise, Exercise } from "../models/index.js";
import { createRoutineService } from "../services/routineService.js";

const createRoutine = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, logic_engine = "MANUAL", days } = req.body;

    if (!name || !Array.isArray(days) || days.length === 0) {
      return res.status(400).json({
        error: "A routine must contain at least one day",
      });
    }

    if (!["MANUAL", "BEGINNER"].includes(logic_engine)) {
      return res.status(400).json({
        error: "Invalid routine engine",
      });
    }

    const hasEmptyDay = days.some(
      (day) => !Array.isArray(day.exercises) || day.exercises.length === 0,
    );

    if (hasEmptyDay) {
      return res.status(400).json({
        error: "Every routine day must contain an exercise",
      });
    }

    if (days.length > 7) {
      return res.status(400).json({
        error: "A routine cannot contain more than 7 days",
      });
    }

    const newRoutine = await createRoutineService(userId, {
      name,
      logic_engine,
      days,
    });

    return res.status(201).json(newRoutine);
  } catch (error) {
    console.error("Error creating routine:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getAllRoutines = async (req, res) => {
  try {
    const userId = req.user.id;

    const routines = await Routine.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: RoutineDay,
          as: "days",
          include: [
            {
              model: Exercise,
              as: "exercises",
              through: {
                attributes: ["sets", "reps", "target_time", "sequence_number"],
              },
            },
          ],
        },
      ],
      order: [
        [{ model: RoutineDay, as: "days" }, "day_number", "ASC"],
        [
          { model: RoutineDay, as: "days" },
          { model: Exercise, as: "exercises" },
          RoutineDayExercise,
          "sequence_number",
          "ASC",
        ],
      ],
    });
    return res.status(200).json(routines);
  } catch (error) {
    console.log("Error fetching routines", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRoutine = async (req, res) => {
  try {
    const { routineId } = req.params;
    const userId = req.user.id;

    const deleted = await Routine.destroy({
      where: { id: routineId, user_id: userId },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Routine not found" });
    }

    return res.status(200).json({ message: "Routine deleted successfully" });
  } catch (error) {
    console.error("Error deleting routine:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getActiveRoutine = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeRoutine = await Routine.findOne({
      where: { user_id: userId, is_active: true },
    });

    if (!activeRoutine) {
      return res.status(200).json(null);
    }

    return res.status(200).json(activeRoutine);
  } catch (error) {
    console.error("Error fetching active routine:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getAllRoutines, createRoutine, deleteRoutine, getActiveRoutine };
