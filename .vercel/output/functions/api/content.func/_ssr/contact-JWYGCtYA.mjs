import { c as site, l as waJoin } from "./utils-Dsg1aIPd.mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./router-B2wiT9Et.mjs";
import { t as PageHero } from "./page-hero-C81mXupM.mjs";
import { t as JoinForm } from "./join-form-CwAth70B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-JWYGCtYA.js
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		id: "main",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
				kicker: "Visit",
				title: "Galle Road, Wadduwa.",
				lede: site.hoursNote,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: waJoin(),
							children: "WhatsApp"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: site.mapsUrl,
							target: "_blank",
							rel: "noreferrer",
							children: "Open maps"
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl gap-10 px-5 pb-16 md:grid-cols-12 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-[0.18em] text-subtle",
								children: "Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-lg text-fg",
								children: site.address
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-[0.18em] text-subtle",
								children: "Phone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-lg text-fg no-underline hover:text-iron",
										href: `tel:${site.phoneTel}`,
										children: site.phone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-lg text-fg no-underline hover:text-iron",
										href: `tel:${site.phoneAltTel}`,
										children: site.phoneAlt
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-[0.18em] text-subtle",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "text-lg text-fg no-underline hover:text-iron",
									href: `mailto:${site.email}`,
									children: site.email
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-[0.18em] text-subtle",
								children: "Social"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-1 flex flex-col gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "text-fg no-underline hover:text-iron",
									href: site.facebook,
									target: "_blank",
									rel: "noreferrer",
									children: "Facebook — SMV GYM Wadduwa"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "text-fg no-underline hover:text-iron",
									href: site.instagram,
									target: "_blank",
									rel: "noreferrer",
									children: ["Instagram ", site.instagramHandle]
								})]
							})] })
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-xl md:col-span-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: "Map of SMV GYM Wadduwa",
						src: site.mapsEmbed,
						className: "h-[22rem] w-full border-0 md:h-full md:min-h-[22rem]",
						loading: "lazy",
						referrerPolicy: "no-referrer-when-downgrade"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-6xl px-5 pb-24 md:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 rounded-xl bg-surface p-6 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)] md:grid-cols-12 md:p-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-4xl font-semibold uppercase tracking-tight",
							children: "Contact SMV GYM"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted",
							children: "WhatsApp is the fastest way to contact us. Fill in the form and we will reply."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-7",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinForm, {})
					})]
				})
			})
		]
	});
}
//#endregion
export { Contact as component };
