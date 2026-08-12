"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginAPI, registerAPI } from "@/services/user";

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
};

export async function loginUserAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const data = await loginAPI(email, password);
    const cookieStore = await cookies();

    cookieStore.set("jwt_token", data.token, authCookieOptions);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function registerUserAction(formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const data = await registerAPI(username, email, password);
    const cookieStore = await cookies();

    cookieStore.set("jwt_token", data.token, authCookieOptions);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt_token");

  redirect("/login");
}
