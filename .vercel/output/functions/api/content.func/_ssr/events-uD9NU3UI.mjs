import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as waJoin, n as Button, u as site } from "./router-BoH5XlZT.mjs";
import { t as PageHero } from "./page-hero-C81mXupM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events-uD9NU3UI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Events() {
	const [posts, setPosts] = (0, import_react.useState)([]);
	const [configured, setConfigured] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		fetch("/api/facebook-news").then((response) => response.json()).then((data) => {
			setConfigured(data.configured !== false);
			setPosts(data.posts ?? []);
		}).catch(() => setConfigured(false));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		id: "main",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			kicker: "News",
			title: "SMV in motion.",
			lede: "Updates, competitions and community news from SMV GYM Wadduwa."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 pb-24 md:px-8",
			children: [posts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]",
					children: [post.full_picture ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: post.full_picture,
						alt: "",
						className: "aspect-[16/9] w-full object-cover"
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.18em] text-iron",
								children: post.created_time ? new Date(post.created_time).toLocaleDateString() : "SMV News"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 whitespace-pre-wrap text-muted",
								children: post.message ?? "SMV GYM update"
							}),
							post.permalink_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "mt-5 inline-flex text-sm text-fg no-underline hover:text-iron",
								href: post.permalink_url,
								target: "_blank",
								rel: "noreferrer",
								children: "View post"
							}) : null
						]
					})]
				}, post.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-8 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-semibold uppercase tracking-tight",
					children: "Latest from SMV"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-muted",
					children: configured ? "Loading the latest updates from Facebook..." : "Connect the Facebook Page access token to show the latest 10 posts here."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-20 rounded-xl bg-surface p-8 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-semibold uppercase tracking-tight",
						children: "Want in on the next one?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-muted",
						children: "Dates are shared on Facebook first. Message us and we will add you to the list."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: waJoin("Hi SMV — I want details on the next event."),
								children: "WhatsApp"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: site.facebook,
								target: "_blank",
								rel: "noreferrer",
								children: "Facebook"
							})
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { Events as component };
