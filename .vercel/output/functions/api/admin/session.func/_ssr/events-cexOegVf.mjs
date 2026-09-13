import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as events, d as waJoin, n as Button, u as site } from "./router-Ba6G3y74.mjs";
import { t as PageHero } from "./page-hero-C81mXupM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events-cexOegVf.js
var import_jsx_runtime = require_jsx_runtime();
function Events() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		id: "main",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			kicker: "News",
			title: "SMV in motion.",
			lede: "Updates, competitions and community news from SMV GYM Wadduwa."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 pb-24 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-16",
					children: events.map((ev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "grid items-stretch gap-6 overflow-hidden md:grid-cols-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: i % 2 ? "md:col-span-6 md:col-start-7 md:row-start-1" : "md:col-span-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: ev.image,
								alt: "",
								className: "h-full min-h-72 w-full rounded-xl object-cover"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: i % 2 ? "flex flex-col justify-center md:col-span-5 md:row-start-1" : "flex flex-col justify-center md:col-span-5 md:col-start-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.22em] text-iron",
									children: ev.kicker
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: ev.when
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight md:text-5xl",
									children: ev.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-lg text-muted",
									children: ev.copy
								})
							]
						})]
					}, ev.slug))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: "SMV GYM Facebook news",
						src: "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSarangalakmalFitness&tabs=timeline&width=900&height=760&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false",
						className: "h-[760px] w-full border-0",
						loading: "lazy"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				})
			]
		})]
	});
}
//#endregion
export { Events as component };
