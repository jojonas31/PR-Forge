"use server";

import { cookies } from "next/headers";
import {
  createRoutineRequest,
  deleteRoutineRequest,
  fetchRoutines,
  getActiveRoutineService,
} from "@/services/routines";

export async function CreateRoutineAction(routineData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return createRoutineRequest(routineData, token);
}

export async function getRoutinesAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return fetchRoutines(token);
}

export async function DeleteRoutineAction(routineId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return deleteRoutineRequest(routineId, token);
}

export async function getActiveRoutineAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return getActiveRoutineService(token);
}
