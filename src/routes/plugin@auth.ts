import type { RequestHandler } from "@builder.io/qwik-city";
import { jwtVerify } from "jose";

export const onRequest: RequestHandler = async ({
  pathname,
  cookie,
  redirect,
  env,
  sharedMap,
}) => {
  if (pathname.startsWith("/auth/")) return;

  const secret = env.get("AUTH_SECRET");
  if (!secret) throw new Error("AUTH_SECRET not configured");

  const sessionCookie = cookie.get("session");
  if (!sessionCookie) {
    throw redirect(302, "/auth/login");
  }

  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(sessionCookie.value, key);
    sharedMap.set("user", payload);
  } catch {
    cookie.delete("session", { path: "/" });
    throw redirect(302, "/auth/login");
  }
};
