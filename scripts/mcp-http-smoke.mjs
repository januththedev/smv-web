/**
 * End-to-end MCP HTTP smoke test against the real dev-server middleware
 * bridge (vite.config.ts serverApiBridgePlugin + smvDevApiPlugin).
 *
 * Boots Vite in middlewareMode with the project's own config, wraps it in an
 * ephemeral http.Server, and drives the mounted /api/mcp endpoint over real
 * HTTP with a generated in-memory ADMIN_PASSWORD:
 *   1. unauthenticated request -> 401
 *   2. authenticated initialize -> tools/list -> discover_site
 *   3. patch_section with revision -> conflict on stale revision
 *   4. readback through /api/content (public API)
 *
 * Run: node scripts/mcp-http-smoke.mjs
 */
import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { createServer } from 'vite';

if (process.env.DATABASE_URL) {
  console.error('REFUSING TO RUN: DATABASE_URL is set — this smoke test writes content and must not touch an external database. Unset it first.');
  process.exit(1);
}
process.env.ADMIN_PASSWORD = randomBytes(24).toString('hex');

const vite = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
});
const httpServer = createHttpServer((req, res) => vite.middlewares(req, res));
await new Promise((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${httpServer.address().port}`;
const auth = `Basic ${Buffer.from(`admin:${process.env.ADMIN_PASSWORD}`).toString('base64')}`;

try {
  // 1. Auth gate: no credentials -> 401 with WWW-Authenticate, before anything else.
  const denied = await fetch(`${base}/api/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }),
  });
  await denied.text();
  assert.equal(denied.status, 401);
  assert.match(denied.headers.get('www-authenticate') ?? '', /Basic/);

  const post = async (body) => {
    const response = await fetch(`${base}/api/mcp`, {
      method: 'POST',
      headers: {
        authorization: auth,
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    // Notifications (no id) get 202 with an empty body per the MCP HTTP spec.
    if (response.status === 202 && !text) return null;
    if (!response.ok || !text) {
      throw new Error(`HTTP ${response.status}: ${text.slice(0, 400) || '(empty body)'}`);
    }
    return JSON.parse(text);
  };

  // 2. Handshake + discovery.
  const init = await post({
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'smoke', version: '1' } },
  });
  assert.ok(init.result, JSON.stringify(init));
  await post({ jsonrpc: '2.0', method: 'notifications/initialized' });
  const tools = await post({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  const names = tools.result.tools.map((t) => t.name);
  assert.ok(names.includes('discover_site') && names.includes('patch_section'), names.join(','));

  const call = async (name, args) => {
    const result = await post({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name, arguments: args } });
    assert.equal(result.result.isError, undefined, JSON.stringify(result));
    return JSON.parse(result.result.content[0].text);
  };
  const discovery = await call('discover_site', {});
  assert.ok(discovery.revision && discovery.sectionKeys.length > 0, JSON.stringify(discovery).slice(0, 200));

  // 3. Targeted edit with revision, then stale-revision conflict.
  const key = discovery.sectionKeys[0];
  const changed = await call('patch_section', { key, text: 'Smoke test section', expectedRevision: discovery.revision });
  assert.notEqual(changed.revision, discovery.revision);
  const stale = await post({
    jsonrpc: '2.0', id: 4, method: 'tools/call',
    params: { name: 'patch_section', arguments: { key, text: 'stale', expectedRevision: discovery.revision } },
  });
  assert.equal(stale.result.isError, true, JSON.stringify(stale));

  // 4. Public API readback through the same in-process service.
  const publicContent = await (await fetch(`${base}/api/content`)).json();
  assert.equal(publicContent.sections[key], 'Smoke test section');

  // 4b. Collection edits over mounted HTTP: add -> patch -> intentional empty -> remove.
  const beforeAdd = await call('list_collection', { collection: 'gallery' });
  const index = beforeAdd.total;
  const added = await call('add_collection_item', { collection: 'gallery', index, expectedRevision: beforeAdd.revision, item: { src: '/images/gym-2026-09-01.jpg', alt: 'Smoke photo', tag: 'Floor' } });
  assert.equal(added.itemCounts.gallery, index + 1);
  const addedItem = await call('get_collection_item', { collection: 'gallery', index });
  assert.equal(addedItem.item.alt, 'Smoke photo');

  const patched = await call('patch_collection_item', { collection: 'gallery', index, patch: { alt: '' }, expectedRevision: added.revision });
  const afterPatch = await call('get_collection_item', { collection: 'gallery', index });
  assert.equal(afterPatch.item.alt, '', 'intentional empty alt was not preserved');
  const publicPatched = await (await fetch(`${base}/api/content`)).json();
  assert.equal(publicPatched.gallery[index].alt, '');

  const removed = await call('remove_collection_item', { collection: 'gallery', index, expectedRevision: patched.revision });
  assert.equal(removed.itemCounts.gallery, index);
  const publicRemoved = await (await fetch(`${base}/api/content`)).json();
  assert.deepEqual(publicRemoved.gallery, publicContent.gallery);
  const emptied = await call('patch_section', { key, text: '', expectedRevision: removed.revision });
  assert.ok(emptied.revision);
  assert.equal((await (await fetch(`${base}/api/content`)).json()).sections[key], '');

  // 5. Admin UI routes: wrong password 401, right password sets cookie, then
  //    session/content/versions work and GET on a POST-only route is rejected.
  const loginWrong = await fetch(`${base}/api/admin/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: randomBytes(24).toString('hex') }),
  });
  assert.equal(loginWrong.status, 401);

  const login = await fetch(`${base}/api/admin/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
  });
  assert.equal(login.status, 200);
  const cookie = (login.headers.getSetCookie?.() ?? []).find((c) => c.startsWith('smv_admin_session='));
  assert.ok(cookie, 'no session cookie');
  const cookieValue = cookie.split(';')[0];

  const session = await (await fetch(`${base}/api/admin/session`, { headers: { cookie: cookieValue } })).json();
  assert.equal(session.authenticated, true);

  const contentRes = await fetch(`${base}/api/admin/content`, { headers: { cookie: cookieValue } });
  assert.equal(contentRes.status, 200);
  assert.ok(contentRes.headers.get('etag'), 'no ETag on admin content');

  const versionsRes = await fetch(`${base}/api/admin/versions`, { headers: { cookie: cookieValue } });
  assert.equal(versionsRes.status, 200);
  assert.ok(Array.isArray(await versionsRes.json()));

  const getOnPost = await fetch(`${base}/api/admin/login`, { headers: { cookie: cookieValue } });
  assert.equal(getOnPost.status, 405);

  const unauthContent = await fetch(`${base}/api/admin/content`);
  assert.equal(unauthContent.status, 401);

  console.log(`MCP HTTP SMOKE PASS  port=${httpServer.address().port} tools=${names.length} sections=${discovery.sectionKeys.length}`);
} finally {
  await vite.close();
  await new Promise((resolve) => httpServer.close(resolve));
}
