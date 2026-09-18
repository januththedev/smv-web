import { defineEventHandler, getQuery, readBody, sendRedirect } from "h3";
import { verifyAdminPassword } from "../../utils/admin-auth";
import { isSafeCallback, issueAuthCode, MCP_SCOPE } from "../../utils/oauth";

/** Tiny escaper for values reflected into the sign-in page. */
function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function signInPage(params: { clientId: string; redirectUri: string; state: string; codeChallenge: string; scope: string; error?: string }): string {
  const hidden = (name: string, value: string) =>
    `<input type="hidden" name="${name}" value="${esc(value)}" />`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Connect to SMV GYM</title>
<style>body{margin:0;min-height:100dvh;display:flex;align-items:center;justify-content:center;background:#09090b;color:#f4f1ec;font-family:system-ui,sans-serif;padding:20px;box-sizing:border-box}main{width:100%;max-width:380px;border:1px solid #2b2b30;border-radius:12px;padding:28px;background:#131316}h1{font-size:22px;margin:6px 0 4px}p{color:#a8a29e;font-size:14px;line-height:1.5}label{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#a8a29e;margin-top:18px}input[type=password]{width:100%;box-sizing:border-box;margin-top:8px;padding:14px;border-radius:8px;border:1px solid #2b2b30;background:#09090b;color:#f4f1ec;font-size:16px}button{width:100%;margin-top:18px;padding:14px;border:0;border-radius:8px;background:#c45c32;color:#fff;font-size:16px;font-weight:700}button:active{transform:scale(.98)}.err{color:#f87171;font-size:14px;margin-top:12px}</style>
</head><body><main>
<p style="font-size:12px;text-transform:uppercase;letter-spacing:.2em">SMV GYM admin</p>
<h1>Connect AI assistant</h1>
<p>Enter the gym admin password to let this assistant manage website content. It gets the same access as the admin page — nothing more.</p>
${params.error ? `<p class="err">${esc(params.error)}</p>` : ""}
<form method="post" action="/api/oauth/authorize">
${hidden("client_id", params.clientId)}${hidden("redirect_uri", params.redirectUri)}${hidden("state", params.state)}${hidden("code_challenge", params.codeChallenge)}${hidden("scope", params.scope)}
<label for="pw">Admin password</label>
<input id="pw" name="password" type="password" autocomplete="current-password" required />
<button type="submit">Authorize</button>
</form></main></body></html>`;
}

function html(status: number, body: string): Response {
  return new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

/**
 * OAuth authorization endpoint. GET renders a mobile-friendly password +
 * consent page; POST verifies the admin password and redirects back to the
 * client with a short-lived, PKCE-bound authorization code.
 */
export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    const query = getQuery(event);
    const clientId = typeof query.client_id === "string" ? query.client_id : "";
    const redirectUri = typeof query.redirect_uri === "string" ? query.redirect_uri : "";
    const state = typeof query.state === "string" ? query.state : "";
    const challenge = typeof query.code_challenge === "string" ? query.code_challenge : "";
    const scope = typeof query.scope === "string" && query.scope ? query.scope : MCP_SCOPE;
    const responseType = typeof query.response_type === "string" ? query.response_type : "";
    if (responseType !== "" && responseType !== "code") return html(400, "Unsupported response type.");
    if (!clientId || !isSafeCallback(redirectUri) || !challenge) {
      return html(400, "This authorization link is incomplete. Start again from your AI app.");
    }
    return html(200, signInPage({ clientId, redirectUri, state, codeChallenge: challenge, scope }));
  }

  if (event.method === "POST") {
    const body = (await readBody(event).catch(() => ({}))) as Record<string, unknown>;
    const str = (v: unknown) => (typeof v === "string" ? v : "");
    const clientId = str(body?.client_id);
    const redirectUri = str(body?.redirect_uri);
    const state = str(body?.state);
    const challenge = str(body?.code_challenge);
    const scope = str(body?.scope) || MCP_SCOPE;
    const password = str(body?.password);
    const retry = (message: string, status: number) =>
      html(status, signInPage({ clientId, redirectUri, state, codeChallenge: challenge, scope, error: message }));
    if (!clientId || !isSafeCallback(redirectUri) || !challenge) return retry("This authorization request is incomplete. Start again from your AI app.", 400);
    if (!verifyAdminPassword(password)) return retry("Password is not correct.", 401);
    let code: string;
    try {
      code = await issueAuthCode({ clientId, redirectUri, codeChallenge: challenge, scope });
    } catch {
      return retry("Sign-in is not configured on this server.", 503);
    }
    const joiner = redirectUri.includes("?") ? "&" : "?";
    const target = `${redirectUri}${joiner}code=${encodeURIComponent(code)}${state ? `&state=${encodeURIComponent(state)}` : ""}`;
    return sendRedirect(event, target, 302);
  }

  return new Response("Method not allowed", { status: 405, headers: { allow: "GET, POST" } });
});
