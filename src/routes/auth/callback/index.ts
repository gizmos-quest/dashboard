import type { RequestHandler } from "@builder.io/qwik-city";
import { SignJWT } from "jose";

export const onGet: RequestHandler = async ({
  query,
  redirect,
  env,
  url,
  cookie,
}) => {
  const code = query.get("code");
  const state = query.get("state");
  const storedState = cookie.get("oauth_state")?.value;

  if (!code || !state || state !== storedState) {
    throw redirect(302, "/auth/login");
  }

  cookie.delete("oauth_state", { path: "/" });

  const issuer = env.get("AUTH_KEYCLOAK_ISSUER")!;
  const clientId = env.get("AUTH_KEYCLOAK_CLIENT_ID")!;
  const clientSecret = env.get("AUTH_KEYCLOAK_CLIENT_SECRET")!;
  const secret = env.get("AUTH_SECRET")!;
  const allowedUsers = env
    .get("AUTH_ALLOWED_USERS")!
    .split(",")
    .map((u) => u.trim());

  const tokenRes = await fetch(
    `${issuer}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${url.origin}/auth/callback`,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    },
  );

  if (!tokenRes.ok) {
    throw redirect(302, "/auth/login");
  }

  const tokens = await tokenRes.json();
  const idToken = JSON.parse(atob(tokens.id_token.split(".")[1]));

  if (!allowedUsers.includes(idToken.preferred_username)) {
    throw redirect(302, "/auth/denied");
  }

  const key = new TextEncoder().encode(secret);
  const session = await new SignJWT({
    sub: idToken.sub,
    username: idToken.preferred_username,
    name: idToken.name || idToken.preferred_username,
    email: idToken.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);

  cookie.set("session", session, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: [86400, "seconds"],
  });

  throw redirect(302, "/");
};
