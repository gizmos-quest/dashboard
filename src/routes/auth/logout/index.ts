import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ redirect, env, url, cookie }) => {
  cookie.delete("session", { path: "/" });

  const issuer = env.get("AUTH_KEYCLOAK_ISSUER");
  if (issuer) {
    const logoutUrl =
      `${issuer}/protocol/openid-connect/logout?` +
      new URLSearchParams({
        post_logout_redirect_uri: url.origin,
        client_id: env.get("AUTH_KEYCLOAK_CLIENT_ID")!,
      });
    throw redirect(302, logoutUrl);
  }

  throw redirect(302, "/");
};
