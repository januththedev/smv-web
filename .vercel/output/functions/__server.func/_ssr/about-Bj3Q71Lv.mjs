import { c as site, l as waJoin } from "./utils-NfSF64lg.mjs";
import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./router-ZNUj__GK.mjs";
import { t as PageHero } from "./page-hero-CoFkIGwb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-Bj3Q71Lv.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		id: "main",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
				kicker: "About",
				title: site.tagline,
				lede: "A south-coast gym with a coach’s name on the door, a bodybuilding bench, and a cricket team. Not a chain. Not a hotel spa."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 md:grid-cols-12 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/interior.jpg",
						alt: "Inside SMV GYM Wadduwa",
						className: "aspect-[4/5] w-full rounded-xl object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-5 md:col-start-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.22em] text-iron",
							children: site.coach
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight",
							children: "The floor has a name."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-5 text-lg text-muted",
							children: [
								"Saranga Lakmal runs SMV from ",
								site.addressLine,
								". The Facebook page still answers comments like a person, not a brand kit. That is the point."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted",
							children: "Members call it the best gym in Wadduwa because someone watches the lift, someone posts the medal, and someone organises cricket when the season asks for it."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-line bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3 md:px-8",
					children: [
						{
							t: "Community first",
							d: `${site.community.checkins} check-ins. ${site.community.likes} on Facebook. People come back.`
						},
						{
							t: "Compete",
							d: "Western Province bodybuilding, 2026 — a bronze from this floor. Training that has somewhere to go."
						},
						{
							t: "Coast",
							d: "When the program is on, the gym moves to Wadduwa beach. Conditioning with a horizon."
						}
					].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl font-semibold uppercase tracking-tight",
						children: b.t
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted",
						children: b.d
					})] }, b.t))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-12 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.22em] text-iron",
							children: site.sinhalaPlace
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight",
							children: "South of Colombo. On the road to Galle."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-muted",
							children: "Wadduwa is a coastal town, not a downtown mall. SMV sits on Galle Road so you can train before work, after the beach, or on the way home."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: waJoin(),
									children: "Message Saranga"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									children: "Get directions"
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-6 md:col-start-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/sri-lanka.jpg",
						alt: "Sri Lankan south coast near Wadduwa",
						className: "aspect-[4/3] w-full rounded-xl object-cover"
					})
				})]
			})
		]
	});
}
//#endregion
export { About as component };
