"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { finishWorkoutRequest, getWorkoutPreparationService } from "@/services/workout";

export async function finishWorkoutAction(exerciseLogs, routineId, routineDayId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  await finishWorkoutRequest(
    {
      exercise_logs: exerciseLogs,
      routine_id: routineId,
      routine_day_id: routineDayId,
    },
    token,
  );

  revalidatePath("/", "layout");

  redirect("/routines");
}

export async function getWorkoutPreparationAction(routineId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return getWorkoutPreparationService(routineId, token);
}
