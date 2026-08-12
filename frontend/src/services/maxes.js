import { apiUrl } from "./config";

export async function getUserAllMaxService(token) {
  const response = await fetch(apiUrl("/maxes"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch exercise maxes");
  }

  return data;
}

export async function getStrengthPointsService(token) {
  const response = await fetch(apiUrl("/maxes/strength"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch strength points");
  }

  return data;
}
