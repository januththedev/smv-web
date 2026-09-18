import { createServerFn } from "@tanstack/react-start";

/**
 * Which database backend the admin edits land in: real Neon when
 * `DATABASE_URL` is configured, otherwise the embedded PGLite preview
 * fallback. Surfaced so the admin UI never claims a backend it is not
 * actually using.
 */
export const getDbSource = createServerFn({ method: "GET" }).handler(async () => {
  const { dbSource } = await import("./db");
  return dbSource;
});
