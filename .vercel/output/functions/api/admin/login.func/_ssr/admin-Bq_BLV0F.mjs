import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Save, c as LockKeyhole, d as Eye, f as Check, i as Server, l as KeyRound, r as Sparkles, u as History } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Bq_BLV0F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var defaults = {
	headline: "Train strong. Feel good.",
	intro: "A friendly gym in Wadduwa for strength, fitness and bodybuilding.",
	font: "Manrope",
	accent: "#c45c32"
};
async function json(url, init) {
	const response = await fetch(url, {
		credentials: "same-origin",
		headers: {
			"content-type": "application/json",
			...init?.headers
		},
		...init
	});
	if (!response.ok) throw new Error(await response.text());
	return response.json();
}
function AdminPage() {
	const [password, setPassword] = (0, import_react.useState)("");
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	const [content, setContent] = (0, import_react.useState)(defaults);
	const [versions, setVersions] = (0, import_react.useState)([]);
	const [notice, setNotice] = (0, import_react.useState)("");
	async function load() {
		const session = await json("/api/admin/session");
		setUnlocked(session.authenticated);
		if (!session.authenticated) return;
		const [nextContent, nextVersions] = await Promise.all([json("/api/admin/content"), json("/api/admin/versions")]);
		setContent(nextContent);
		setVersions(nextVersions);
	}
	(0, import_react.useEffect)(() => {
		load().catch(() => setUnlocked(false));
	}, []);
	async function login(e) {
		e.preventDefault();
		try {
			await json("/api/admin/login", {
				method: "POST",
				body: JSON.stringify({ password })
			});
			await load();
		} catch {
			setNotice("Password is not correct.");
		}
	}
	async function save() {
		try {
			setContent(await json("/api/admin/content", {
				method: "POST",
				body: JSON.stringify(content)
			}));
			setNotice("Saved to Neon.");
		} catch (error) {
			setNotice(error instanceof Error ? error.message : "Could not save.");
		}
	}
	async function version() {
		try {
			const created = await json("/api/admin/versions", {
				method: "POST",
				body: JSON.stringify({ label: `Website update ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-LK")}` })
			});
			setVersions((current) => [created, ...current].slice(0, 5));
			setNotice("Version created.");
		} catch (error) {
			setNotice(error instanceof Error ? error.message : "Could not create version.");
		}
	}
	async function restore(versionToRestore) {
		try {
			setContent(await json("/api/admin/versions", {
				method: "PUT",
				body: JSON.stringify({ id: versionToRestore.id })
			}));
			setNotice(`Restored ${versionToRestore.label}.`);
		} catch (error) {
			setNotice(error instanceof Error ? error.message : "Could not restore version.");
		}
	}
	async function uploadLogo(event) {
		const file = event.target.files?.[0];
		if (!file) return;
		const form = new FormData();
		form.append("file", file);
		try {
			const response = await fetch("/api/admin/upload", {
				method: "POST",
				body: form,
				credentials: "same-origin"
			});
			if (!response.ok) throw new Error(await response.text());
			setNotice("Logo uploaded to Vercel Blob.");
		} catch (error) {
			setNotice(error instanceof Error ? error.message : "Could not upload logo.");
		}
	}
	if (!unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto flex min-h-screen max-w-md items-center px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: login,
			className: "w-full rounded-lg border border-line bg-surface p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "mb-5 size-7 text-iron" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.2em] text-muted",
					children: "SMV GYM admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl uppercase",
					children: "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted",
					children: "Use the admin password saved in Vercel."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Admin password",
					type: "password",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					className: "mt-6 w-full rounded-lg border border-line bg-bg px-4 py-3",
					placeholder: "Admin password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "mt-4 w-full rounded-lg bg-iron px-4 py-3 font-semibold text-white",
					children: "Open admin"
				}),
				notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-iron",
					children: notice
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-5 block text-center text-sm text-muted no-underline",
					children: "Back to website"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-bg px-5 pb-20 pt-28 md:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.2em] text-iron",
						children: "SMV GYM admin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-5xl uppercase",
						children: "Website control"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-muted",
						children: "Edit the website, save it to Neon and create a reviewable version."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 text-sm text-muted no-underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), "View website"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-line bg-surface p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl uppercase",
							children: "Content and style"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-6 flex cursor-pointer justify-between rounded-lg border border-dashed border-line p-4 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upload logo to Vercel Blob" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								onChange: uploadLogo,
								className: "sr-only"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-6 block text-sm text-muted",
							children: ["Main heading", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: content.headline,
								onChange: (e) => setContent({
									...content,
									headline: e.target.value
								}),
								className: "mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-5 block text-sm text-muted",
							children: ["Welcome message", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: content.intro,
								onChange: (e) => setContent({
									...content,
									intro: e.target.value
								}),
								rows: 3,
								className: "mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid gap-5 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm text-muted",
								children: ["Font", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: content.font,
									onChange: (e) => setContent({
										...content,
										font: e.target.value
									}),
									className: "mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Manrope" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Arial" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Georgia" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Trebuchet MS" })
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm text-muted",
								children: ["Accent colour", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "color",
									value: content.accent,
									onChange: (e) => setContent({
										...content,
										accent: e.target.value
									}),
									className: "mt-2 h-12 w-full rounded-lg border border-line bg-bg p-1"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-7 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: save,
								className: "flex items-center gap-2 rounded-lg bg-iron px-5 py-3 font-semibold text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), "Save to Neon"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: version,
								className: "flex items-center gap-2 rounded-lg border border-line px-5 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4" }), "Create version"]
							})]
						}),
						notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-iron",
							children: notice
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-line bg-surface p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-5 text-iron" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl uppercase",
								children: "Latest versions"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 space-y-3",
							children: versions.length ? versions.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-bg p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 text-sm font-semibold",
										children: [index === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-emerald-400" }), item.label]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted",
										children: new Date(item.createdAt).toLocaleString("en-LK")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => restore(item),
										className: "mt-2 text-xs text-iron",
										children: "Restore this version"
									})
								]
							}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "No versions yet."
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-line bg-surface p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "size-5 text-iron" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl uppercase",
									children: "MCP connection"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: "Use your domain URL with an MCP client. It will ask for the same admin password used here."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "mt-4 block overflow-x-auto rounded bg-bg p-3 text-xs text-fg",
								children: "https://your-domain.com/api/mcp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 flex gap-2 text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-3 shrink-0" }), "HTTP Basic authentication. Any username is accepted; use your admin password."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 flex gap-2 text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 shrink-0" }), "Tools: read content, edit content, create versions and list versions."]
							})
						]
					})]
				})]
			})]
		})
	});
}
//#endregion
export { AdminPage as component };
