"use client";
import { registerUserAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  async function handleSubmit(dataForm) {
    const res = await registerUserAction(dataForm);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      router.push("/");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <form
        action={handleSubmit}
        className="flex flex-col gap-4 bg-zinc-900 p-5 sm:p-8 rounded-lg border border-zinc-800 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-yellow-500 text-center mb-4">PR Forge</h1>
        <input
          type="text"
          name="username"
          required
          placeholder="Username"
          className="p-3 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-yellow-500"
        ></input>
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="p-3 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-yellow-500"
        ></input>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="p-3 rounded bg-zinc-800 text-white outline-none focus:ring-2 focus:ring-yellow-500"
        ></input>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="p-3 mt-2 bg-yellow-500 text-zinc-950 rounded font-bold hover:bg-yellow-400 transition"
        >
          Send
        </button>
        <div className="text-center mt-2 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-yellow-500 hover:text-yellow-400 hover:underline transition"
          >
            Log in
          </Link>
        </div>
      </form>
    </main>
  );
}
