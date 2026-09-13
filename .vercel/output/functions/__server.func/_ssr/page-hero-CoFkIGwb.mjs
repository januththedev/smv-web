import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-hero-CoFkIGwb.js
var import_jsx_runtime = require_jsx_runtime();
function PageHero({ kicker, title, lede, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mx-auto max-w-6xl px-5 pt-40 pb-12 md:px-8 md:pt-48 md:pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.24em] text-iron",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold uppercase leading-[0.88] tracking-tight text-fg",
				children: title
			}),
			lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-xl text-lg text-muted",
				children: lede
			}) : null,
			children
		]
	});
}
//#endregion
export { PageHero as t };
