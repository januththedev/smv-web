import { r as defineEventHandler } from "../../_libs/h3+rou3+srvx.mjs";
//#region server/api/facebook-news.get.ts
var facebook_news_get_default = defineEventHandler(async () => {
	const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
	if (!token) return {
		configured: false,
		posts: []
	};
	const page = "SarangalakmalFitness";
	const fields = "id,message,created_time,permalink_url,full_picture";
	const pageResponse = await fetch(`https://graph.facebook.com/v23.0/${page}?fields=id&access_token=${encodeURIComponent(token)}`);
	if (!pageResponse.ok) return {
		configured: false,
		posts: []
	};
	const pageData = await pageResponse.json();
	if (!pageData.id) return {
		configured: false,
		posts: []
	};
	const postsResponse = await fetch(`https://graph.facebook.com/v23.0/${pageData.id}/posts?fields=${fields}&limit=10&access_token=${encodeURIComponent(token)}`);
	if (!postsResponse.ok) return {
		configured: false,
		posts: []
	};
	return {
		configured: true,
		posts: (await postsResponse.json()).data ?? []
	};
});
//#endregion
export { facebook_news_get_default as default };
