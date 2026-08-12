import { apiUrl } from "./config";

export async function getExercisesService() {
  const response = await fetch(apiUrl("/exercises"), {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch exercises");
  }

  return data;
}
