import sequelize from "../config/database.js";
import { Exercise } from "../models/index.js";

const exercises = [
  {
    name: "Bench Press",
    metric_type: "TRADITIONAL",
    strength_factor: 2.4,
    description: "Barbell bench press",
  },
  {
    name: "Incline Bench Press",
    metric_type: "TRADITIONAL",
    strength_factor: 2.2,
    description: "Incline barbell bench press",
  },
  {
    name: "Overhead Press",
    metric_type: "TRADITIONAL",
    strength_factor: 2.7,
    description: "Standing barbell overhead press",
  },
  {
    name: "Barbell Row",
    metric_type: "TRADITIONAL",
    strength_factor: 2.2,
    description: "Bent-over barbell row",
  },
  {
    name: "Pull-Up",
    metric_type: "TRADITIONAL",
    strength_factor: 2.3,
    description: "Bodyweight or weighted pull-up",
  },
  {
    name: "Lat Pulldown",
    metric_type: "TRADITIONAL",
    strength_factor: 1.7,
    description: "Cable lat pulldown",
  },
  {
    name: "Deadlift",
    metric_type: "TRADITIONAL",
    strength_factor: 2.7,
    description: "Conventional barbell deadlift",
  },
  {
    name: "Romanian Deadlift",
    metric_type: "TRADITIONAL",
    strength_factor: 2.4,
    description: "Barbell Romanian deadlift",
  },
  {
    name: "Back Squat",
    metric_type: "TRADITIONAL",
    strength_factor: 3.0,
    description: "Barbell back squat",
  },
  {
    name: "Front Squat",
    metric_type: "TRADITIONAL",
    strength_factor: 3.2,
    description: "Barbell front squat",
  },
  {
    name: "Leg Press",
    metric_type: "TRADITIONAL",
    strength_factor: 1.4,
    description: "Machine leg press",
  },
  {
    name: "Bulgarian Split Squat",
    metric_type: "TRADITIONAL",
    strength_factor: 2.0,
    description: "Rear-foot elevated split squat",
  },
  {
    name: "Hip Thrust",
    metric_type: "TRADITIONAL",
    strength_factor: 1.8,
    description: "Barbell hip thrust",
  },
  {
    name: "Leg Curl",
    metric_type: "TRADITIONAL",
    strength_factor: 1.1,
    description: "Machine hamstring curl",
  },
  {
    name: "Leg Extension",
    metric_type: "TRADITIONAL",
    strength_factor: 1.0,
    description: "Machine leg extension",
  },
  {
    name: "Barbell Curl",
    metric_type: "TRADITIONAL",
    strength_factor: 1.0,
    description: "Standing barbell biceps curl",
  },
  {
    name: "Triceps Pushdown",
    metric_type: "TRADITIONAL",
    strength_factor: 1.0,
    description: "Cable triceps pushdown",
  },
  {
    name: "Lateral Raise",
    metric_type: "TRADITIONAL",
    strength_factor: 0.8,
    description: "Dumbbell lateral raise",
  },
  {
    name: "Plank",
    metric_type: "ISOMETRIC",
    strength_factor: null,
    description: "Timed front plank",
  },
  {
    name: "Farmer's Hold",
    metric_type: "GRIP",
    strength_factor: null,
    description: "Timed weighted grip hold",
  },
];

async function seedExercises() {
  try {
    await sequelize.authenticate();

    for (const exerciseData of exercises) {
      const [exercise, created] = await Exercise.findOrCreate({
        where: {
          name: exerciseData.name,
        },
        defaults: exerciseData,
      });

      if (!created) {
        await exercise.update({
          metric_type: exerciseData.metric_type,
          strength_factor: exerciseData.strength_factor,
          description: exerciseData.description,
        });
      }
    }

    console.log("Exercises seeded successfully.");
  } catch (error) {
    console.error("Failed to seed exercises:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedExercises();
