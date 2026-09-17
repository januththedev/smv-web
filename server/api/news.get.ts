import { defineEventHandler, setHeader } from "h3";
import { loadNews } from "../../src/lib/news.server";

export default defineEventHandler(async (event) => {
  setHeader(event, "cache-control", "public, max-age=120, stale-while-revalidate=600");
  return loadNews();
});
