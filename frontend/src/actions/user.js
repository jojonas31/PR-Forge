"use server";

import { cookies } from "next/headers";
import { getUserProfileService } from "@/services/user";

export async function getUsernameAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const user = await getUserProfileService(token);
  return user?.username ?? "";
}
