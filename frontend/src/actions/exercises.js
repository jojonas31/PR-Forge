"use server";

import { getExercisesService } from "@/services/exercise";

export async function getExercisesAction() {
  return getExercisesService();
}
