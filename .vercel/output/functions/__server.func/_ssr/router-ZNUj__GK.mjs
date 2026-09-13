import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as nav, c as site, l as waJoin, t as cn } from "./utils-NfSF64lg.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as require_jsx_runtime, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowUpRight, i as Menu, n as TriangleAlert, r as Phone, t as X } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as Lenis } from "../_libs/lenis.mjs";
import { n as gsapWithCSS, t as ScrollTrigger } from "../_libs/gsap.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-ZNUj__GK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-line bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-12 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-5xl font-semibold uppercase tracking-tight text-fg",
							children: "SMV GYM"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm uppercase tracking-[0.2em] text-iron",
							children: [
								site.sinhalaPlace,
								" · ",
								site.city
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-5 max-w-sm text-muted",
							children: [site.tagline, ". On Galle Road, not in a brochure."]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-subtle",
						children: "Navigate"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.href,
							className: "text-fg/90 no-underline hover:text-fg",
							children: item.label
						}) }, item.href))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.18em] text-subtle",
							children: "Visit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("address", {
							className: "mt-4 not-italic text-fg/90",
							children: [
								site.addressLine,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								site.city,
								", ",
								site.country
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "text-fg no-underline hover:text-iron",
									href: `tel:${site.phoneTel}`,
									children: site.phone
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "text-fg no-underline hover:text-iron",
									href: `mailto:${site.email}`,
									children: site.email
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: site.facebook,
								className: "inline-flex items-center gap-1 text-muted no-underline hover:text-fg",
								rel: "noreferrer",
								target: "_blank",
								children: ["Facebook ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: site.instagram,
								className: "inline-flex items-center gap-1 text-muted no-underline hover:text-fg",
								rel: "noreferrer",
								target: "_blank",
								children: ["Instagram ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-line px-5 py-5 text-xs text-subtle md:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					site.fullName,
					". All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: site.hoursNote })]
			})
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium tracking-wide whitespace-nowrap select-none rounded-full outline-none transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40", {
	variants: {
		variant: {
			primary: "bg-fg text-bg hover:bg-fg/90 shadow-[0_0_0_1px_rgb(238_234_227_/_8%)]",
			iron: "bg-iron text-fg hover:bg-iron/90",
			ghost: "bg-transparent text-fg shadow-[0_0_0_1px_rgb(238_234_227_/_16%)] hover:bg-fg/6",
			quiet: "bg-transparent text-muted hover:text-fg"
		},
		size: {
			md: "h-11 px-5 text-sm",
			lg: "h-12 px-6 text-[0.9375rem]",
			sm: "h-9 px-4 text-xs",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
function MagneticNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [hidden, setHidden] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const lastY = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		setOpen(false);
		window.__lenis?.scrollTo(0, { immediate: true });
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		const onScroll = (e) => {
			const direction = e.detail?.direction ?? 0;
			const y = window.scrollY;
			if (y < 24) {
				setHidden(false);
				lastY.current = y;
				return;
			}
			if (open) {
				setHidden(false);
				return;
			}
			setHidden(direction === 1 && y > lastY.current + 8);
			lastY.current = y;
		};
		const onWin = () => {
			const y = window.scrollY;
			if (y < 24) setHidden(false);
			else if (!open) setHidden(y > lastY.current);
			lastY.current = y;
		};
		window.addEventListener("smv-scroll", onScroll);
		window.addEventListener("scroll", onWin, { passive: true });
		return () => {
			window.removeEventListener("smv-scroll", onScroll);
			window.removeEventListener("scroll", onWin);
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: "#main",
			className: "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg",
			children: "Skip to content"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: cn("fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-4 md:pt-4", hidden && !open ? "-translate-y-[120%]" : "translate-y-0"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				"aria-label": "Primary",
				className: "glass-dock flex w-full max-w-5xl items-center justify-between gap-2 rounded-full px-2 py-1.5 pl-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-baseline gap-2 py-2 pr-2 no-underline",
						"aria-label": `${site.fullName} home`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-semibold tracking-[0.08em] text-fg",
							children: "SMV"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-[0.65rem] uppercase tracking-[0.22em] text-muted sm:inline",
							children: "Wadduwa"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "hidden items-center gap-0.5 lg:flex",
						children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MagneticLink, {
							href: item.href,
							active: item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
							children: item.label
						}) }, item.href))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								className: "hidden sm:inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${site.phoneTel}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }), "Call"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								className: "hidden sm:inline-flex pr-3.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: waJoin(),
									children: "Join"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "inline-flex size-11 items-center justify-center rounded-full text-fg lg:hidden",
								"aria-expanded": open,
								"aria-controls": "mobile-nav",
								onClick: () => setOpen((v) => !v),
								children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: open ? "Close menu" : "Open menu"
								})]
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "mobile-nav",
			hidden: !open,
			className: cn("fixed inset-0 z-40 bg-bg/95 px-6 pt-32 backdrop-blur-xl lg:hidden", open ? "block" : "hidden"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-1",
				children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.href,
					onClick: () => setOpen(false),
					className: "block py-3 font-display text-4xl font-semibold uppercase tracking-tight text-fg no-underline",
					children: item.label
				}) }, item.href))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: waJoin(),
						children: "WhatsApp the floor"
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
			})]
		})
	] });
}
function MagneticLink({ href, active, children }) {
	const ref = (0, import_react.useRef)(null);
	function onMove(e) {
		const el = ref.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const x = e.clientX - (r.left + r.width / 2);
		const y = e.clientY - (r.top + r.height / 2);
		el.style.transform = `translate(${x * .28}px, ${y * .32}px)`;
	}
	function onLeave() {
		const el = ref.current;
		if (!el) return;
		el.style.transform = "translate(0, 0)";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		ref,
		to: href,
		onMouseMove: onMove,
		onMouseLeave: onLeave,
		className: cn("inline-flex h-10 items-center rounded-full px-3.5 text-[0.8rem] tracking-wide no-underline transition-[color,background-color,transform] duration-150 ease-out will-change-transform", active ? "bg-fg/8 text-fg" : "text-muted hover:text-fg"),
		children
	});
}
function SmoothScroll({ children }) {
	const hash = useRouterState({ select: (s) => s.location.hash });
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		gsapWithCSS.registerPlugin(ScrollTrigger);
		if (reduce) {
			ScrollTrigger.normalizeScroll(false);
			return;
		}
		const lenis = new Lenis({
			autoRaf: false,
			lerp: .09,
			smoothWheel: true
		});
		window.__lenis = lenis;
		lenis.on("scroll", (e) => {
			ScrollTrigger.update();
			window.dispatchEvent(new CustomEvent("smv-scroll", { detail: {
				velocity: e.velocity,
				direction: e.direction
			} }));
		});
		const tick = (time) => {
			lenis.raf(time * 1e3);
		};
		gsapWithCSS.ticker.add(tick);
		gsapWithCSS.ticker.lagSmoothing(0);
		const onResize = () => ScrollTrigger.refresh();
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
			gsapWithCSS.ticker.remove(tick);
			lenis.destroy();
			window.__lenis = void 0;
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const id = hash.replace(/^#/, "");
		if (!id) return;
		const go = () => {
			const el = document.getElementById(id);
			if (!el) return;
			if (window.__lenis) window.__lenis.scrollTo(el, { offset: -96 });
			else el.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		};
		const t = window.setTimeout(go, 80);
		return () => window.clearTimeout(t);
	}, [hash, pathname]);
	return children;
}
var styles_default = "/assets/styles-CzU0xs_z.css";
var APP_NAME = site.fullName;
var Route$7 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: site.description
			},
			{
				name: "theme-color",
				content: "#09090b"
			},
			{
				name: "author",
				content: site.coach
			},
			{
				name: "robots",
				content: "index,follow"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "HealthClub",
		name: site.fullName,
		description: site.description,
		url: "https://smvgym.lk",
		telephone: site.phone,
		email: site.email,
		image: "/images/hero-floor.jpg",
		address: {
			"@type": "PostalAddress",
			streetAddress: site.addressLine,
			addressLocality: site.city,
			addressCountry: "LK"
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: 6.6667,
			longitude: 79.9333
		},
		sameAs: [site.facebook, site.instagram]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SmoothScroll, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grain",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MagneticNav, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
				] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
					type: "application/ld+json",
					dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-D5r5B10_.mjs");
var Route$6 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [{ title: `${site.fullName} — ${site.tagline}` }, {
		name: "description",
		content: site.description
	}] })
});
var $$splitComponentImporter$5 = () => import("./about-Bj3Q71Lv.mjs");
var Route$5 = createFileRoute("/about")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: `About — ${site.fullName}` }, {
		name: "description",
		content: "SMV GYM Wadduwa is Saranga Lakmal’s community gym on Galle Road — the best gym in the city, according to the people who train here."
	}] })
});
var $$splitComponentImporter$4 = () => import("./contact-CHpvfe9Y.mjs");
var Route$4 = createFileRoute("/contact")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: `Visit — ${site.fullName}` }, {
		name: "description",
		content: `Visit SMV GYM at ${site.address}. Call ${site.phone} or WhatsApp the floor.`
	}] })
});
var $$splitComponentImporter$3 = () => import("./events-CQfsljR1.mjs");
var Route$3 = createFileRoute("/events")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: `Events — ${site.fullName}` }, {
		name: "description",
		content: "SMV GYM Cricket Tournament 2026, Western Province bodybuilding, and beach training in Wadduwa."
	}] })
});
var $$splitComponentImporter$2 = () => import("./gallery-Bokm0rXc.mjs");
var Route$2 = createFileRoute("/gallery")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: `Floor — ${site.fullName}` }, {
		name: "description",
		content: "Inside SMV GYM Wadduwa — the floor, the coast, and the community."
	}] })
});
var $$splitComponentImporter$1 = () => import("./membership-f1tfe5Vp.mjs");
var Route$1 = createFileRoute("/membership")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: `Join — ${site.fullName}` }, {
		name: "description",
		content: "Join SMV GYM Wadduwa. Walk in on Galle Road or WhatsApp Saranga Lakmal for membership."
	}] })
});
var $$splitComponentImporter = () => import("./training-DWwJI_7Y.mjs");
var Route = createFileRoute("/training")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: `Training — ${site.fullName}` }, {
		name: "description",
		content: "Strength, bodybuilding, personal coaching with Saranga Lakmal, and beach training at SMV GYM Wadduwa."
	}] })
});
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	AboutRoute: Route$5.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$7
	}),
	ContactRoute: Route$4.update({
		id: "/contact",
		path: "/contact",
		getParentRoute: () => Route$7
	}),
	EventsRoute: Route$3.update({
		id: "/events",
		path: "/events",
		getParentRoute: () => Route$7
	}),
	GalleryRoute: Route$2.update({
		id: "/gallery",
		path: "/gallery",
		getParentRoute: () => Route$7
	}),
	MembershipRoute: Route$1.update({
		id: "/membership",
		path: "/membership",
		getParentRoute: () => Route$7
	}),
	TrainingRoute: Route.update({
		id: "/training",
		path: "/training",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		defaultPreload: "intent",
		scrollRestoration: true
	});
}
//#endregion
export { Button as n, router_exports as t };
