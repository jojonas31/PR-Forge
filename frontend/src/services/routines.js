import { apiUrl } from "./config";

export async function fetchRoutines(token) {
  const response = await fetch(apiUrl("/routines"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch routines");
  }

  return data;
}

export async function createRoutineRequest(routineData, token) {
  const response = await fetch(apiUrl("/routines"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(routineData),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to create the routine");
  }

  return data;
}

export async function deleteRoutineRequest(routineId, token) {
  const response = await fetch(apiUrl(`/routines/${routineId}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to delete the routine");
  }

  return data;
}

export async function getActiveRoutineService(token) {
  const response = await fetch(apiUrl("/routines/active"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch the active routine");
  }

  return data;
}
