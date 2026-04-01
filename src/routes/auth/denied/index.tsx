import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Access Denied</h1>
      <p>Your account is not authorized to access this dashboard.</p>
      <a href="/auth/login">Try another account</a>
    </div>
  );
});
