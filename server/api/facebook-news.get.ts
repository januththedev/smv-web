import { defineEventHandler } from "h3";

type FacebookPost = {
  id: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  full_picture?: string;
};

export default defineEventHandler(async () => {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!token) return { configured: false, posts: [] as FacebookPost[] };

  const page = "SarangalakmalFitness";
  const fields = "id,message,created_time,permalink_url,full_picture";
  const pageResponse = await fetch(
    `https://graph.facebook.com/v23.0/${page}?fields=id&access_token=${encodeURIComponent(token)}`,
  );
  if (!pageResponse.ok) return { configured: false, posts: [] as FacebookPost[] };
  const pageData = (await pageResponse.json()) as { id?: string };
  if (!pageData.id) return { configured: false, posts: [] as FacebookPost[] };

  const postsResponse = await fetch(
    `https://graph.facebook.com/v23.0/${pageData.id}/posts?fields=${fields}&limit=10&access_token=${encodeURIComponent(token)}`,
  );
  if (!postsResponse.ok) return { configured: false, posts: [] as FacebookPost[] };
  const postsData = (await postsResponse.json()) as { data?: FacebookPost[] };
  return { configured: true, posts: postsData.data ?? [] };
});
