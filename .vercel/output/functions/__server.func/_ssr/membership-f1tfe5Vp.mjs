import { c as site, l as waJoin } from "./utils-NfSF64lg.mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./router-ZNUj__GK.mjs";
import { t as PageHero } from "./page-hero-CoFkIGwb.mjs";
import { t as JoinForm } from "./join-form-D0XcBj82.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/membership-f1tfe5Vp.js
var import_jsx_runtime = require_jsx_runtime();
var paths = [
	{
		title: "Walk-in day",
		copy: "See the floor, meet the coach, lift. We will tell you if this is the right gym before you pay for a month."
	},
	{
		title: "Monthly & longer",
		copy: "Quoted in person. Rates change with how you train — open floor, coaching, or contest prep — so we do not post a fake menu."
	},
	{
		title: "Coaching add-on",
		copy: "Personal sessions with Saranga. Programming, form, and the uncomfortable honesty that actually moves a physique."
	}
];
function Membership() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		id: "main",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
				kicker: "Membership",
				title: "Come lift. Then decide.",
				lede: "No brochure prices. SMV is a neighbourhood gym — you join by walking in, calling, or sending a WhatsApp.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: waJoin(),
							children: "WhatsApp to join"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${site.phoneTel}`,
							children: site.phone
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto grid max-w-6xl gap-4 px-5 pb-16 md:grid-cols-3 md:px-8",
				children: paths.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-surface p-6 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold uppercase tracking-tight",
						children: p.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted",
						children: p.copy
					})]
				}, p.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl gap-12 px-5 pb-24 md:grid-cols-12 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.22em] text-iron",
							children: "Enquire"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight",
							children: "Tell us what you want from the floor."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted",
							children: "We will come back on WhatsApp or a call. Bring a goal. Leave with a plan."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-8 space-y-3 text-sm text-fg/85",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Open floor, seven days — confirm hours when you call." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Coaching with ",
									site.coach,
									"."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Beach sessions when the program is running." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A community that actually competes." })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-6 md:col-start-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinForm, {})
				})]
			})
		]
	});
}
//#endregion
export { Membership as component };
