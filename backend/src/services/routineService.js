import getRoutineEngine from "./routineFactory.js";
import sequelize from "../config/database.js";

import { Routine, RoutineDay, RoutineDayExercise, Exercise } from "../models/index.js";

const createRoutineService = async (userId, routineData) => {
  return sequelize.transaction(async (transaction) => {
    await Routine.update(
      {
        is_active: false,
      },
      {
        where: {
          user_id: userId,
          is_active: true,
        },
        transaction,
      },
    );

    const newRoutine = await Routine.create(
      {
        user_id: userId,
        name: routineData.name,
        logic_engine: routineData.logic_engine,
        is_active: true,
      },
      {
        transaction,
      },
    );

    const routineEngine = getRoutineEngine(newRoutine.logic_engine);

    for (const dayData of routineData.days) {
      const routineDay = await RoutineDay.create(
        {
          routine_id: newRoutine.id,
          day_number: dayData.day_number,
        },
        {
          transaction,
        },
      );

      const exercisesToCreate = routineEngine.prepareExercises(dayData.exercises, routineDay);

      await RoutineDayExercise.bulkCreate(exercisesToCreate, {
        transaction,
        validate: true,
      });
    }

    return Routine.findByPk(newRoutine.id, {
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
      transaction,
    });
  });
};

export { createRoutineService };
