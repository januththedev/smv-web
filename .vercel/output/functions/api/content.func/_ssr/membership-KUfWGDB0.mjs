import { c as site, l as waJoin } from "./utils-Dsg1aIPd.mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./router-B2wiT9Et.mjs";
import { t as PageHero } from "./page-hero-C81mXupM.mjs";
import { t as JoinForm } from "./join-form-CwAth70B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/membership-KUfWGDB0.js
var import_jsx_runtime = require_jsx_runtime();
var paths = [
	{
		title: "Walk-in day",
		copy: "See the gym, meet the coach and try a session. We will help you decide before you pay for a month."
	},
	{
		title: "Monthly & longer",
		copy: "Membership depends on how you want to train. Ask us for the current price when you visit or message us."
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
				title: "Come and try the gym.",
				lede: "Visit us, call us or send a WhatsApp message. We will explain the membership clearly.",
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
							children: "Tell us your fitness goal."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted",
							children: "Tell us your goal. We will reply on WhatsApp or by phone and help you choose the right plan."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-8 space-y-3 text-sm text-fg/85",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Open every day — confirm the hours when you call." }),
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
