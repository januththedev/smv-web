import assert from 'node:assert/strict';
import test from 'node:test';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

const root = fileURLToPath(new URL('../', import.meta.url)).replaceAll('\\', '/').replace(/\/$/, '');
const vite = await createServer({ configFile: false, root, resolve: { alias: { '@': `${root}/src` } }, optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const schema = await vite.ssrLoadModule('/src/lib/site-content-schema.ts');
test.after(() => vite.close());

test('legacy reads preserve intentional empty text and arrays', () => {
  const value = schema.cleanContent({ headline: '', intro: '', gallery: [] });
  assert.equal(value.headline, '');
  assert.equal(value.intro, '');
  assert.deepEqual(value.gallery, []);
});

test('strict writes reject unsafe URLs, unknown fields, bounds and fonts', () => {
  for (const logoUrl of ['javascript:alert(1)', 'data:image/png;base64,AAAA', '//evil.test/a', '/images/../secret', '/images/%2e%2e/a', 'https://u:p@example.com/a', 'https:\\evil.test/a']) {
    assert.equal(schema.contentPatchSchema.safeParse({ logoUrl }).success, false, logoUrl);
  }
  for (const logoUrl of ['/images/a.png', 'https://example.com/a.png']) {
    assert.equal(schema.contentPatchSchema.safeParse({ logoUrl }).success, true);
  }
  for (const patch of [{ font: 'bad' }, { headline: 'x'.repeat(121) }, { gallery: [{ src: '/images/a.png', alt: '', tag: '', extra: 'bad' }] }, { sections: { 'not.rendered': 'bad' } }]) {
    assert.equal(schema.contentPatchSchema.safeParse(patch).success, false);
  }
});

function memoryRepo() {
  let raw = null;
  const versions = new Map();
  return {
    async read() { return structuredClone(raw); },
    async compareAndSwap(expected, next) {
      if (JSON.stringify(raw) !== JSON.stringify(expected)) return false;
      raw = structuredClone(next);
      return true;
    },
    async saveVersion(version) { versions.set(version.id, structuredClone(version)); },
    async listVersions() { return [...versions.values()].slice(-5).reverse(); },
    async getVersion(id) { return structuredClone(versions.get(id) ?? null); },
  };
}

async function setup(t) {
  const serviceModule = await vite.ssrLoadModule('/src/lib/site-content.server.ts');
  const mcp = await vite.ssrLoadModule('/server/api/mcp.ts');
  const repo = memoryRepo();
  const service = serviceModule.createContentService(repo);
  const server = mcp.createMcpServer(service);
  const client = new Client({ name: 'content-test', version: '1' });
  const [a, b] = InMemoryTransport.createLinkedPair();
  await server.connect(b);
  await client.connect(a);
  t.after(async () => { await client.close(); await server.close(); });
  const call = async (name, args = {}) => {
    const result = await client.callTool({ name, arguments: args });
    assert.equal(result.isError, undefined, JSON.stringify(result));
    return JSON.parse(result.content[0].text);
  };
  const fails = async (name, args) => {
    const result = await client.callTool({ name, arguments: args });
    assert.equal(result.isError, true, JSON.stringify(result));
  };
  return { service, repo, client, call, fails, mcp };
}

test('actual MCP discovery, targeted copy persistence, revision conflicts and final deletion', async (t) => {
  const { call, fails, service } = await setup(t);
  let state = await call('discover_site');
  assert.ok(state.sectionKeys.length);
  assert.equal(state.content, undefined);
  const key = state.sectionKeys[0];
  await fails('patch_section', { key: 'not.rendered', text: 'bad', expectedRevision: state.revision });
  const changed = await call('patch_section', { key, text: '', expectedRevision: state.revision });
  assert.equal((await call('get_section', { key })).value, '');
  assert.equal((await service.read()).sections[key], '');
  await fails('patch_section', { key, text: 'stale', expectedRevision: state.revision });
  state = changed;
  const gallery = await call('list_collection', { collection: 'gallery' });
  assert.ok(gallery.items.every((item) => !('src' in item)));
  for (let index = gallery.total - 1; index >= 0; index--) {
    state = await call('remove_collection_item', { collection: 'gallery', index, expectedRevision: state.revision });
  }
  assert.deepEqual((await service.read()).gallery, []);
  state = await call('add_collection_item', { collection: 'gallery', index: 0, item: { src: '/images/a.png', alt: '', tag: '' }, expectedRevision: state.revision });
  await fails('patch_collection_item', { collection: 'gallery', index: 0, patch: { src: 'data:image/svg+xml,xxx' }, expectedRevision: state.revision });
  await fails('patch_collection_item', { collection: 'gallery', index: 0, patch: { unknown: 'bad' }, expectedRevision: state.revision });
  await call('patch_collection_item', { collection: 'gallery', index: 0, patch: { src: 'https://example.com/reused.jpg' }, expectedRevision: state.revision });
  const item = await call('get_collection_item', { collection: 'gallery', index: 0 });
  assert.equal(item.item.src, 'https://example.com/reused.jpg');
});

test('compact versions and confirmed revision-checked restore', async (t) => {
  const { call, fails, service } = await setup(t);
  const version = await call('create_site_version', { label: 'Before edit' });
  assert.equal(version.headline, undefined);
  assert.equal(version.content, undefined);
  const state = await call('discover_site');
  const changed = await call('update_site_content', { patch: { headline: '' }, expectedRevision: state.revision });
  await fails('restore_site_version', { id: version.id, confirm: false, expectedRevision: changed.revision });
  await fails('restore_site_version', { id: version.id, confirm: true, expectedRevision: state.revision });
  await call('restore_site_version', { id: version.id, confirm: true, expectedRevision: changed.revision });
  assert.equal((await service.read()).headline, schema.defaultSiteContent.headline);
  const versions = await call('list_site_versions');
  assert.equal(versions.versions[0].content, undefined);
});

test('CAS rejects races and fresh scalar admin saves preserve collections', async () => {
  const { createContentService, revisionOf } = await vite.ssrLoadModule('/src/lib/site-content.server.ts');
  const repo = memoryRepo();
  const service = createContentService(repo);
  const revision = revisionOf(await service.read());
  const results = await Promise.allSettled([
    service.patch({ gallery: [] }, revision),
    service.patch({ headline: 'Race' }, revision),
  ]);
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
  await service.patch({ gallery: [] }, revisionOf(await service.read()));
  await service.patch({ headline: 'Admin' });
  assert.deepEqual((await service.read()).gallery, []);
  await assert.rejects(() => service.patch({ gallery: schema.defaultSiteContent.gallery }), /revision/i);
});

test('image bytes and bounded base64 reject SVG, invalid signatures and MIME mismatches', async () => {
  const images = await vite.ssrLoadModule('/server/utils/admin-image.ts');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jK0kAAAAASUVORK5CYII=', 'base64');
  assert.equal(images.validateImage(png, 'image/png').extension, 'png');
  assert.deepEqual(images.decodeImageBase64(png.toString('base64')), png);
  assert.throws(() => images.validateImage(png, 'image/jpeg'));
  assert.throws(() => images.validateImage(Buffer.from('<svg></svg>'), 'image/svg+xml'));
  assert.throws(() => images.validateImage(Buffer.alloc(images.MAX_IMAGE_BYTES + 1), 'image/png'));
  assert.throws(() => images.decodeImageBase64('data:image/png;base64,AAAA'));
  assert.throws(() => images.decodeImageBase64('!!!!'));
  assert.throws(() => images.decodeImageBase64('A'.repeat(images.MAX_BASE64_LENGTH + 1)));
});

test('HTTP handler fails closed before server creation for every MCP action', async () => {
  const { handleMcpRequest } = await vite.ssrLoadModule('/server/api/mcp.ts');
  const previous = process.env.ADMIN_PASSWORD;
  const password = randomBytes(24).toString('hex');
  let created = 0;
  const factory = () => { created++; throw new Error('Must not be reached'); };
  try {
    for (const configured of [undefined, password]) {
      if (configured) process.env.ADMIN_PASSWORD = configured;
      else delete process.env.ADMIN_PASSWORD;
      for (const authorization of ['', 'Basic invalid', `Basic ${Buffer.from(`admin:${randomBytes(24).toString('hex')}`).toString('base64')}`]) {
        for (const method of ['tools/list', 'tools/call']) {
          const request = new Request('https://example.test/api/mcp', { method: 'POST', headers: { authorization, 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: { name: 'discover_site', arguments: {} } }) });
          assert.equal((await handleMcpRequest(request, factory)).status, 401);
        }
      }
    }
    assert.equal(created, 0);
  } finally { if (previous === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = previous; }
});
