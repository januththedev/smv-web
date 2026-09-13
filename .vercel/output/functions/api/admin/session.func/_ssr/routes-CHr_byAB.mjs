import { o as __toESM } from "../_runtime.mjs";
import { c as site, l as waJoin, n as events, o as programs, r as gallery, s as quotes, t as cn } from "./utils-Dsg1aIPd.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { n as gsapWithCSS, t as ScrollTrigger } from "../_libs/gsap.mjs";
import { n as Button, r as useSiteContent } from "./router-B2wiT9Et.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CHr_byAB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Hero() {
	const root = (0, import_react.useRef)(null);
	const content = useSiteContent();
	(0, import_react.useEffect)(() => {
		const el = root.current;
		if (!el) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const items = el.querySelectorAll("[data-hero]");
		if (reduce) {
			gsapWithCSS.set(items, {
				opacity: 1,
				y: 0,
				filter: "none"
			});
			return;
		}
		const ctx = gsapWithCSS.context(() => {
			gsapWithCSS.fromTo(items, {
				opacity: 0,
				y: 22,
				filter: "blur(8px)"
			}, {
				opacity: 1,
				y: 0,
				filter: "blur(0px)",
				duration: .9,
				stagger: .1,
				ease: "power3.out",
				delay: .08
			});
		}, el);
		return () => ctx.revert();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref: root,
		className: "relative min-h-[100dvh] overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					className: "h-full w-full object-cover",
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					poster: "/images/hero-floor.jpg",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
						src: "/videos/floor.mp4",
						type: "video/mp4"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-mask absolute inset-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 opacity-70",
					style: { background: "radial-gradient(720px 480px at 72% 38%, rgb(196 92 50 / 28%), transparent 60%)" }
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					"data-hero": true,
					src: content.logoUrl,
					alt: "SMV GYM Wadduwa",
					className: "mb-5 h-16 w-16 object-contain outline-none md:h-20 md:w-20"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-hero": true,
					className: "text-xs uppercase tracking-[0.28em] text-fg/70",
					children: "Galle Road · Wadduwa · Sri Lanka"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					"data-hero": true,
					className: "mt-4 font-display text-[clamp(4.4rem,16vw,12rem)] font-semibold uppercase leading-[0.8] tracking-tight text-fg",
					children: [
						"SMV",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"GYM"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					"data-hero": true,
					className: "mt-6 max-w-md text-lg text-fg/80 md:text-xl",
					children: [
						content.headline,
						" ",
						content.intro
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-hero": true,
					className: "mt-8 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: waJoin(),
							children: "Start on WhatsApp"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${site.phoneTel}`,
							children: "Call us"
						})
					})]
				})
			]
		})]
	});
}
var ITEMS = [
	site.tagline,
	"Strength",
	"Bodybuilding",
	"Beach training",
	"Wadduwa",
	"Personal coaching",
	"South coast",
	"Galle Road"
];
function VelocityMarquee() {
	const wrap = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = wrap.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let raf = 0;
		const onScroll = (e) => {
			const v = e.detail?.velocity ?? 0;
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const skew = Math.max(-12, Math.min(12, v * 1.4));
				const duration = Math.max(10, 28 - Math.abs(v) * 3);
				el.style.setProperty("--marquee-skew", `${skew}deg`);
				el.style.setProperty("--marquee-duration", `${duration}s`);
			});
		};
		window.addEventListener("smv-scroll", onScroll);
		return () => {
			window.removeEventListener("smv-scroll", onScroll);
			cancelAnimationFrame(raf);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrap,
		className: "relative overflow-hidden border-y border-line bg-surface py-4",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "marquee-track gap-10 text-fg",
			children: [0, 1].map((copy) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-10 pr-10",
				children: ITEMS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-display text-4xl font-semibold uppercase tracking-[0.08em] text-fg/90 md:text-5xl",
					children: [item, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-10 inline-block text-iron",
						children: "/"
					})]
				}, `${copy}-${item}`))
			}, copy))
		})
	});
}
function ScrubHeading({ text }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			el.style.backgroundPosition = "0% 0";
			return;
		}
		gsapWithCSS.registerPlugin(ScrollTrigger);
		const tween = gsapWithCSS.fromTo(el, { backgroundPosition: "100% 0" }, {
			backgroundPosition: "0% 0",
			ease: "none",
			scrollTrigger: {
				trigger: el,
				start: "top 80%",
				end: "top 28%",
				scrub: .6
			}
		});
		return () => {
			tween.scrollTrigger?.kill();
			tween.kill();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		ref,
		className: "scrub-fill font-display text-[clamp(3.2rem,11vw,9.5rem)] font-semibold uppercase leading-[0.88] tracking-tight",
		children: text
	});
}
function SpotlightCard({ children, className }) {
	const ref = (0, import_react.useRef)(null);
	function onMove(e) {
		const el = ref.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const x = e.clientX - r.left;
		const y = e.clientY - r.top;
		const px = x / r.width * 2 - 1;
		const py = y / r.height * 2 - 1;
		el.style.setProperty("--spot-x", `${x}px`);
		el.style.setProperty("--spot-y", `${y}px`);
		el.style.transform = `perspective(1000px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
	}
	function onLeave() {
		const el = ref.current;
		if (!el) return;
		el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		onMouseMove: onMove,
		onMouseLeave: onLeave,
		className: cn("relative overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgb(238_234_227_/_10%)] will-change-transform transition-transform duration-150 ease-out", className),
		style: { transformStyle: "preserve-3d" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spotlight-glow pointer-events-none absolute inset-0 z-10 mix-blend-screen" }), children]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		id: "main",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VelocityMarquee, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.22em] text-iron",
						children: "Galle Road"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-5xl font-semibold uppercase leading-[0.92] tracking-tight md:text-6xl",
						children: "A friendly gym in Wadduwa."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-6 md:col-start-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg text-muted",
							children: "SMV is a local gym for strength, fitness and bodybuilding. Our coach and members are here to help you train safely and keep going."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted",
							children: "Visit us for a first session and see if SMV is right for you."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							className: "mt-8 pr-3.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/about",
								children: ["The story ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-5 pb-8 md:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-10 flex items-end justify-between gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-4xl font-semibold uppercase tracking-tight md:text-5xl",
							children: "How we train"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/training",
							className: "hidden text-sm text-muted no-underline hover:text-fg sm:inline",
							children: "All training"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: programs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightCard, {
							className: "min-h-[22rem]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/training",
								hash: p.slug,
								className: "relative block h-full no-underline",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.image,
										alt: "",
										className: "absolute inset-0 h-full w-full object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex h-full min-h-[22rem] flex-col justify-end p-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs uppercase tracking-[0.2em] text-iron",
												children: p.kicker
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mt-2 font-display text-3xl font-semibold uppercase tracking-tight",
												children: p.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 max-w-sm text-sm text-fg/80",
												children: p.copy
											})
										]
									})
								]
							})
						}, p.slug))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-5 py-24 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.22em] text-muted",
					children: "South coast"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrubHeading, { text: "Train on the sand. Lift on Galle Road." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/sri-lanka.jpg",
						alt: "South coast of Sri Lanka",
						className: "absolute inset-0 h-full w-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg/70" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto grid max-w-6xl gap-8 px-5 py-24 md:grid-cols-2 md:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.22em] text-iron",
							children: "Beach program"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight",
							children: "Physical fitness, Wadduwa beach."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-fg/85",
								children: "SMV runs outdoor conditioning on the coast — the session the Facebook page still shares the beach training program. Same coach, a different place to train."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-col gap-3 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: waJoin("Hi SMV — I want the next beach training session."),
										children: "Join a beach session"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "ghost",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/events",
										children: "See events"
									})
								})]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-line bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line md:grid-cols-4",
					children: [
						{
							n: site.community.likes,
							l: "Community on Facebook"
						},
						{
							n: site.community.checkins,
							l: "Have trained here"
						},
						{
							n: site.community.recommend,
							l: "Would recommend"
						},
						{
							n: "2026",
							l: "Championship medal"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-surface px-6 py-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-4xl font-semibold tracking-tight text-fg md:text-5xl",
							children: s.n
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: s.l
						})]
					}, s.l))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-5 py-20 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-4xl font-semibold uppercase tracking-tight",
						children: "On the calendar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/events",
						className: "text-sm text-muted no-underline hover:text-fg",
						children: "All events"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: events.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: ev.image,
							alt: "",
							className: "h-44 w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.18em] text-iron",
									children: ev.kicker
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 font-display text-2xl font-semibold uppercase leading-tight tracking-tight",
									children: ev.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: ev.when
								})
							]
						})]
					}, ev.slug))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-5 pb-20 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-4xl font-semibold uppercase tracking-tight",
					children: "Member stories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-4 md:grid-cols-2",
					children: quotes.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
						className: "rounded-xl bg-raised p-6 shadow-[0_0_0_1px_rgb(238_234_227_/_8%)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl font-semibold uppercase leading-tight tracking-tight text-fg",
							children: q.quote
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
							className: "mt-4 text-sm text-muted",
							children: q.name
						})]
					}, q.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-5 pb-24 md:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl overflow-hidden rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 md:grid-cols-4",
						children: gallery.slice(0, 8).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: g.src,
							alt: g.alt,
							className: "aspect-[4/5] h-full w-full object-cover"
						}, g.src))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between bg-surface px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Our gym, our coast, our community."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/gallery",
							className: "text-sm text-fg no-underline hover:text-iron",
							children: "Open gallery"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-line bg-surface px-5 py-20 md:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.22em] text-iron",
							children: "Walk in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight md:text-6xl",
							children: site.addressLine
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-muted",
							children: [
								site.city,
								", ",
								site.country,
								". ",
								site.hoursNote
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row",
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
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								children: "Map and hours"
							})
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { Home as component };
