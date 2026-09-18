import assert from 'node:assert/strict';
import test from 'node:test';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url)).replaceAll('\\', '/').replace(/\/$/, '');
const vite = await createServer({ configFile: false, root, resolve: { alias: { '@': `${root}/src` } }, optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const schema = await vite.ssrLoadModule('/src/lib/site-content-schema.ts');
test.after(() => vite.close());

function memoryRepo() {
  let raw = null;
  return {
    async read() { return structuredClone(raw); },
    async compareAndSwap(expected, next) {
      if (JSON.stringify(raw) !== JSON.stringify(expected)) return false;
      raw = structuredClone(next);
      return true;
    },
    async saveVersion() {}, async listVersions() { return []; }, async getVersion() { return null; },
  };
}

const ADMIN = randomBytes(24).toString('hex');
let cookie;

function adminRequest(url, body) {
  return new Request(`https://example.test${url}`, {
    method: 'POST',
    headers: { cookie: `smv_admin_session=${cookie}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('admin item endpoint: gate, add/patch/remove via service, CAS conflicts', async () => {
  const { createContentService, revisionOf } = await vite.ssrLoadModule('/src/lib/site-content.server.ts');
  const item = await vite.ssrLoadModule('/server/api/admin/item.post.ts');
  const previous = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = ADMIN;
  try {
    cookie = encodeURIComponent(await (await vite.ssrLoadModule('/server/utils/admin-auth.ts')).createAdminSession());
    const service = createContentService(memoryRepo());
    const revision = revisionOf(await service.read());

    // Fail closed without the session cookie.
    const anonymous = new Request('https://example.test/api/admin/item', { method: 'POST', body: '{}' });
    assert.equal((await item.handleAdminItem(anonymous, service)).status, 401);

    // Unknown collection and bad actions reject before the service.
    for (const body of [
      { collection: 'elsewhere', action: 'add', index: 0, item: {}, expectedRevision: revision },
      { collection: 'gallery', action: 'upsert', index: 0, item: {}, expectedRevision: revision },
      { collection: 'gallery', action: 'add', index: -1, item: {}, expectedRevision: revision },
      { collection: 'gallery', action: 'add', index: 0, item: {}, expectedRevision: undefined },
    ]) {
      const response = await item.handleAdminItem(adminRequest('/api/admin/item', body), service);
      assert.equal(response.status, 400, JSON.stringify(body));
    }

    // Add, patch and remove round-trip against the real service.
    let state = await item.handleAdminItem(adminRequest('/api/admin/item', {
      collection: 'gallery', action: 'add', index: 0,
      item: { src: 'https://example.com/video.mp4', alt: 'Team video', tag: 'Floor', type: 'video', poster: 'https://example.com/poster.jpg' },
      expectedRevision: revision,
    }), service);
    assert.equal(state.status, 200);
    let payload = await state.json();
    assert.equal(payload.content.gallery[0].type, 'video');

    const renamed = await item.handleAdminItem(adminRequest('/api/admin/item', {
      collection: 'gallery', action: 'patch', index: 0, patch: { alt: 'Renamed' }, expectedRevision: payload.revision,
    }), service);
    assert.equal(renamed.status, 200);
    payload = await renamed.json();

    const removed = await item.handleAdminItem(adminRequest('/api/admin/item', {
      collection: 'gallery', action: 'remove', index: 0, expectedRevision: payload.revision,
    }), service);
    assert.equal(removed.status, 200);

    // Stale revision is a 409 with the current revision.
    const stale = await item.handleAdminItem(adminRequest('/api/admin/item', {
      collection: 'gallery', action: 'patch', index: 0, patch: { alt: 'stale' }, expectedRevision: payload.revision,
    }), service);
    assert.equal(stale.status, 409);
    const conflictBody = await stale.json();
    assert.equal(conflictBody.revision, (await removed.json()).revision);
  } finally {
    if (previous === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = previous;
  }
});

test('admin content endpoint accepts section overrides and requires a revision for them', async () => {
  const { createContentService, revisionOf } = await vite.ssrLoadModule('/src/lib/site-content.server.ts');
  const content = await vite.ssrLoadModule('/server/api/admin/content.ts');
  const previous = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = ADMIN;
  try {
    cookie = encodeURIComponent(await (await vite.ssrLoadModule('/server/utils/admin-auth.ts')).createAdminSession());
    const service = createContentService(memoryRepo());
    const revision = revisionOf(await service.read());
    const request = (body, headers = {}) => new Request('https://example.test/api/admin/content', {
      method: 'POST', headers: { cookie: `smv_admin_session=${cookie}`, 'content-type': 'application/json', ...headers }, body: JSON.stringify(body),
    });

    // Sections without If-Match must fail closed.
    const missing = await content.handleAdminContent(request({ sections: { 'home.about.title': 'New' } }), service);
    assert.equal(missing.status, 400);

    // Scalar + section patch with the current revision succeeds and persists.
    const saved = await content.handleAdminContent(request(
      { headline: 'Hello', sections: { 'home.about.title': 'New title', 'home.about.body': '' } },
      { 'if-match': revision },
    ), service);
    assert.equal(saved.status, 200);
    const etag = saved.headers.get('etag');
    const stored = await service.read();
    assert.equal(stored.headline, 'Hello');
    assert.equal(stored.sections['home.about.title'], 'New title');
    assert.equal(stored.sections['home.about.body'], '');
    assert.equal(etag, `"${revisionOf(stored)}"`);

    // Unknown section key and unknown scalar reject against the current revision.
    const currentRevision = etag.replace(/^"|"$/g, '');
    const bad = await content.handleAdminContent(request(
      { sections: { 'not.rendered': 'x' } },
      { 'if-match': currentRevision },
    ), service);
    assert.equal(bad.status, 400);
  } finally {
    if (previous === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = previous;
  }
});

test('media token endpoint: gate, body validation and configuration fail-closed', async () => {
  const media = await vite.ssrLoadModule('/server/api/admin/media-token.post.ts');
  const previous = process.env.ADMIN_PASSWORD;
  const previousBlob = process.env.BLOB_READ_WRITE_TOKEN;
  process.env.ADMIN_PASSWORD = ADMIN;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  try {
    cookie = encodeURIComponent(await (await vite.ssrLoadModule('/server/utils/admin-auth.ts')).createAdminSession());
    const request = (body) => new Request('https://example.test/api/admin/media-token', {
      method: 'POST', headers: { cookie: `smv_admin_session=${cookie}`, 'content-type': 'application/json' }, body: JSON.stringify(body),
    });
    const anonymous = new Request('https://example.test/api/admin/media-token', { method: 'POST', body: '{}' });
    assert.equal((await media.handleAdminMediaToken(anonymous)).status, 401);

    // No storage configured: 503 before parsing deep into token generation.
    const unconfigured = await media.handleAdminMediaToken(request({ kind: 'video', contentType: 'video/mp4' }));
    assert.equal(unconfigured.status, 503);

    process.env.BLOB_READ_WRITE_TOKEN = `vercel_blob_rw_${randomBytes(16).toString('hex')}`;
    for (const body of [{ kind: 'movie', contentType: 'video/mp4' }, { kind: 'video', contentType: 'video/x-matroska' }, { kind: 'photo', contentType: 'image/svg+xml' }]) {
      assert.equal((await media.handleAdminMediaToken(request(body))).status, 400, JSON.stringify(body));
    }
    const photo = await media.handleAdminMediaToken(request({ kind: 'photo', contentType: 'image/png' }));
    assert.equal(photo.status, 200);
    const photoPayload = await photo.json();
    assert.match(photoPayload.pathname, /^smv\/media\/.+\.png$/);
    assert.ok(photoPayload.clientToken.length > 20);
    const video = await media.handleAdminMediaToken(request({ kind: 'video', contentType: 'video/mp4' }));
    assert.equal((await video.json()).maximumSizeInBytes, 128 * 1024 * 1024);
  } finally {
    if (previous === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = previous;
    if (previousBlob === undefined) delete process.env.BLOB_READ_WRITE_TOKEN; else process.env.BLOB_READ_WRITE_TOKEN = previousBlob;
  }
});

test('default gallery schema accepts video items and rejects unsafe posters', () => {
  assert.equal(schema.contentPatchSchema.safeParse({ gallery: [{ src: 'https://example.com/a.mp4', alt: '', tag: '', type: 'video', poster: 'https://example.com/p.jpg' }] }).success, true);
  assert.equal(schema.contentPatchSchema.safeParse({ gallery: [{ src: 'https://example.com/a.mp4', alt: '', tag: '', type: 'movie' }] }).success, false);
  assert.equal(schema.contentPatchSchema.safeParse({ gallery: [{ src: 'https://example.com/a.mp4', alt: '', tag: '', poster: 'javascript:x' }] }).success, false);
});
