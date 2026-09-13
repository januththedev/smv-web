import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as waJoin, n as Button, u as site } from "./router-DC9oJOaw.mjs";
import { t as PageHero } from "./page-hero-C81mXupM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events-_mq8OtaE.js
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: "SMV GYM Facebook news",
					src: site.facebookEmbed,
					className: "h-[760px] w-full border-0 bg-white",
					loading: "lazy"
				})
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
