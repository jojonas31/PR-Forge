import { apiUrl } from "./config";

export async function loginAPI(email, password) {
  const response = await fetch(apiUrl("/users/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to log in");
  }

  return data;
}

export async function registerAPI(username, email, password) {
  const response = await fetch(apiUrl("/users/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to register the user");
  }

  return data;
}

export async function getUserProfileService(token) {
  const response = await fetch(apiUrl("/users/profile"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch the user profile");
  }

  return data;
}
