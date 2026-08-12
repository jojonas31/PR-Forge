import { apiUrl } from "./config";

export async function getWorkoutPreparationService(routineId, token) {
  const response = await fetch(apiUrl(`/workouts/prepare/${routineId}`), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to prepare the workout");
  }

  return data;
}

export async function getWeeklyProgressService(token) {
  const response = await fetch(apiUrl("/workouts/weekly-progress"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch weekly progress");
  }

  return data;
}

export async function finishWorkoutRequest(workoutData, token) {
  const response = await fetch(apiUrl("/workouts/history"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(workoutData),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to save the workout");
  }

  return data;
}
