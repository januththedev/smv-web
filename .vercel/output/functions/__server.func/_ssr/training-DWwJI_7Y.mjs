import { l as waJoin } from "./utils-NfSF64lg.mjs";
import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./router-ZNUj__GK.mjs";
import { t as PageHero } from "./page-hero-CoFkIGwb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/training-DWwJI_7Y.js
var import_jsx_runtime = require_jsx_runtime();
var blocks = [
	{
		id: "strength",
		kicker: "Iron",
		title: "Strength floor",
		copy: "The work starts with a bar. Squats, pulls, presses — coached enough that you do not guess, quiet enough that you still have to do it. This is a gym that respects heavy days.",
		image: "/images/deadlift.jpg",
		alt: "Deadlift on the strength floor"
	},
	{
		id: "bodybuilding",
		kicker: "Physique",
		title: "Bodybuilding",
		copy: "Off-season volume and contest prep live here. In 2026 Pubudu Nimsara took 3rd in the 60kg Open at the Western Province Bodybuilding Championship. If you want a stage, the floor already knows the path.",
		image: "/images/physique.jpg",
		alt: "Bodybuilding physique training"
	},
	{
		id: "coaching",
		kicker: "Coach",
		title: "Personal coaching",
		copy: "Saranga Lakmal programs, watches the lift, and tells you the truth. Members keep calling it the best coaching on this stretch of Galle Road — because someone is actually in the room.",
		image: "/images/coach.jpg",
		alt: "Personal coaching on the gym floor"
	},
	{
		id: "beach",
		kicker: "Coast",
		title: "Beach training",
		copy: "Physical fitness sessions on Wadduwa beach. Conditioning that does not need air-con. Call or WhatsApp for the next outdoor date — same numbers the beach program posters already carry.",
		image: "/images/beach.jpg",
		alt: "Wadduwa beach used for outdoor training"
	}
];
function Training() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		id: "main",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			kicker: "Training",
			title: "Four ways to work.",
			lede: "Strength, physique, a coach who stays on the floor, and the Indian Ocean as a second gym. Pick a lane — or use all of them."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 pb-24 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-24",
				children: blocks.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					id: b.id,
					className: "grid scroll-mt-28 items-center gap-8 md:grid-cols-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: i % 2 === 1 ? "md:col-span-6 md:col-start-7 md:row-start-1" : "md:col-span-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: b.image,
							alt: b.alt,
							className: "aspect-[4/5] w-full rounded-xl object-cover"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: i % 2 === 1 ? "md:col-span-5 md:row-start-1" : "md:col-span-5 md:col-start-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.22em] text-iron",
								children: b.kicker
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight",
								children: b.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-lg text-muted",
								children: b.copy
							})
						]
					})]
				}, b.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-24 flex flex-col items-start gap-4 rounded-xl bg-surface p-8 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)] md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-semibold uppercase tracking-tight",
					children: "Walk in. Ask for Saranga."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: "Membership is quoted on the floor — not guessed on a page."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: waJoin(),
							children: "WhatsApp"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/membership",
							children: "Join SMV"
						})
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { Training as component };
