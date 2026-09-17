import { createServerFn } from "@tanstack/react-start";

export const getNews = createServerFn({ method: "GET" }).handler(async () => {
  const { loadNews } = await import("./news.server");
  return loadNews();
});
