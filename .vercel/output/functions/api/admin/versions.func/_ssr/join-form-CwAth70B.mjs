import { o as __toESM } from "../_runtime.mjs";
import { c as site, i as goals, l as waJoin, t as cn } from "./utils-Dsg1aIPd.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./router-B2wiT9Et.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join-form-CwAth70B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	ref,
	className: cn("flex h-12 w-full rounded-md bg-raised px-4 text-base text-fg shadow-[0_0_0_1px_rgb(238_234_227_/_12%)] placeholder:text-subtle outline-none transition-[box-shadow] duration-150 ease-out focus-visible:shadow-[0_0_0_1px_var(--color-iron)]", className),
	...props
}));
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
	ref,
	className: cn("text-xs font-medium uppercase tracking-[0.16em] text-muted", className),
	...props
}));
Label.displayName = "Label";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("flex min-h-32 w-full rounded-lg bg-raised px-4 py-3 text-base text-fg shadow-[0_0_0_1px_rgb(238_234_227_/_12%)] placeholder:text-subtle outline-none transition-[box-shadow] duration-150 ease-out focus-visible:shadow-[0_0_0_1px_var(--color-iron)]", className),
	...props
}));
Textarea.displayName = "Textarea";
var STORAGE_KEY = "smv-join-inquiries";
function JoinForm({ compact }) {
	const formRef = (0, import_react.useRef)(null);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [payload, setPayload] = (0, import_react.useState)({
		name: "",
		goal: goals[0],
		note: ""
	});
	function capture(form) {
		const fd = new FormData(form);
		const nextName = String(fd.get("name") ?? "").trim();
		const nextPhone = String(fd.get("phone") ?? "").trim();
		const nextGoal = String(fd.get("goal") ?? goals[0]);
		const nextNote = String(fd.get("note") ?? "").trim();
		if (!nextName || !nextPhone) return false;
		const entry = {
			name: nextName,
			phone: nextPhone,
			goal: nextGoal,
			note: nextNote,
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
			localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev].slice(0, 20)));
		} catch {}
		setPayload({
			name: nextName,
			goal: goals.includes(nextGoal) ? nextGoal : goals[0],
			note: nextNote
		});
		setSent(true);
		return true;
	}
	function onSubmit(e) {
		e.preventDefault();
		e.stopPropagation();
		capture(e.currentTarget);
	}
	if (sent) {
		const message = `Hi SMV GYM — I'm ${payload.name}. Goal: ${payload.goal}. ${payload.note}`.trim();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-raised p-6 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl font-semibold uppercase tracking-tight text-fg",
					children: "We have your note."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted",
					children: "Send your details on WhatsApp so we can reply today."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: waJoin(message),
							children: "Open WhatsApp"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${site.phoneTel}`,
							children: ["Call ", site.phone]
						})
					})]
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		ref: formRef,
		onSubmit,
		method: "dialog",
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "join-name",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "join-name",
						name: "name",
						required: true,
						autoComplete: "name"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "join-phone",
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "join-phone",
						name: "phone",
						required: true,
						type: "tel",
						autoComplete: "tel"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "join-goal",
					children: "Goal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "join-goal",
					name: "goal",
					defaultValue: goals[0],
					className: "h-12 rounded-md bg-raised px-3 text-base text-fg shadow-[0_0_0_1px_rgb(238_234_227_/_12%)] outline-none focus-visible:shadow-[0_0_0_1px_var(--color-iron)]",
					children: goals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: g,
						children: g
					}, g))
				})]
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "join-note",
					children: "Anything we should know"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "join-note",
					name: "note",
					placeholder: "Training history, preferred time, competition plans…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				className: "mt-2 self-start pr-5",
				children: "Send on WhatsApp"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "We will explain the membership price when we reply."
			})
		]
	});
}
//#endregion
export { JoinForm as t };
