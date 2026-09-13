import { i as __toESM } from "../_runtime.mjs";
import { r as gallery, t as cn } from "./utils-NfSF64lg.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageHero } from "./page-hero-CoFkIGwb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gallery-Bokm0rXc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tags = [
	"All",
	"Floor",
	"Strength",
	"Conditioning",
	"Coast",
	"Community"
];
function Gallery() {
	const [tag, setTag] = (0, import_react.useState)("All");
	const [active, setActive] = (0, import_react.useState)(null);
	const items = (0, import_react.useMemo)(() => tag === "All" ? gallery : gallery.filter((g) => g.tag === tag), [tag]);
	const current = gallery.find((g) => g.src === active);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		id: "main",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
				kicker: "Gallery",
				title: "The floor.",
				lede: "Iron, coast, and the people who keep coming back. Tap a frame to open it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-6xl px-5 pb-6 md:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					role: "tablist",
					"aria-label": "Gallery filters",
					children: tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": tag === t,
						onClick: () => setTag(t),
						className: cn("h-10 rounded-full px-4 text-sm transition-[background-color,color] duration-150 ease-out", tag === t ? "bg-fg text-bg" : "text-muted shadow-[0_0_0_1px_rgb(238_234_227_/_14%)] hover:text-fg"),
						children: t
					}, t))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto columns-1 gap-3 px-5 pb-24 sm:columns-2 md:columns-3 md:px-8",
				children: items.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActive(g.src),
					className: "mb-3 block w-full overflow-hidden rounded-lg p-0 text-left",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: g.src,
						alt: g.alt,
						className: "w-full object-cover"
					})
				}, g.src))
			}),
			current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-[60] flex items-center justify-center bg-bg/92 p-4 backdrop-blur-sm",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": current.alt,
				onClick: () => setActive(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: current.src,
					alt: current.alt,
					className: "max-h-[88dvh] max-w-full rounded-lg object-contain"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute top-4 right-4 h-11 rounded-full bg-fg px-4 text-sm text-bg",
					onClick: () => setActive(null),
					children: "Close"
				})]
			}) : null
		]
	});
}
//#endregion
export { Gallery as component };
