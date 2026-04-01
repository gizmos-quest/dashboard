import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  type DocumentHead,
} from "@builder.io/qwik-city";

export const useUser = routeLoader$(({ sharedMap }) => {
  return sharedMap.get("user") as {
    username: string;
    name: string;
    email: string;
  };
});

export default component$(() => {
  const user = useUser();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>
        Welcome, {user.value.name} ({user.value.username})
      </p>
      <a href="/auth/logout">Logout</a>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard",
};
