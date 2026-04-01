import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ redirect, env, url, cookie }) => {
  const issuer = env.get("AUTH_KEYCLOAK_ISSUER")!;
  const clientId = env.get("AUTH_KEYCLOAK_CLIENT_ID")!;

  const state = crypto.randomUUID();
  cookie.set("oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: [300, "seconds"],
  });

  const authUrl =
    `${issuer}/protocol/openid-connect/auth?` +
    new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      scope: "openid profile email",
      redirect_uri: `${url.origin}/auth/callback`,
      state,
    });

  throw redirect(302, authUrl);
};
