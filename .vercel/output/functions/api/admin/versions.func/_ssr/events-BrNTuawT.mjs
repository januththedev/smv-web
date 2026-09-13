import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as waJoin, n as Button, u as site } from "./router-C-ve2VjG.mjs";
import { t as PageHero } from "./page-hero-C81mXupM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events-BrNTuawT.js
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-8 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-semibold uppercase tracking-tight",
						children: "Latest from SMV"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-muted",
						children: "See the latest posts, announcements and photos directly on our Facebook page."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "mt-6 inline-flex rounded-full bg-fg px-5 py-3 text-sm text-bg no-underline hover:bg-iron hover:text-fg",
						href: site.facebook,
						target: "_blank",
						rel: "noreferrer",
						children: "Open SMV on Facebook"
					})
				]
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
