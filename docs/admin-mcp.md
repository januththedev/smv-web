# Admin MCP connector guide

How to connect an AI assistant (Claude, Cursor, or any MCP client) to this
site's admin MCP endpoint so it can add, edit, and remove public text and
photos on your behalf.

## Endpoint and authentication

- **URL:** `https://<your-deployment>/api/mcp` (local dev: `http://localhost:8080/api/mcp`)
- **Transport:** MCP Streamable HTTP, stateless, JSON responses.
- **Auth:** HTTP Basic. The username is ignored; the password must equal the
  `ADMIN_PASSWORD` environment variable configured on the server.

Configure the credentials **in the connector's own settings** (header
configuration, environment, or secrets store). Do not put the password in chat
or in tool arguments. An automatic password popup is client-dependent: some
MCP clients prompt for Basic credentials on connect, others require you to
preconfigure headers or cannot send them at all. If the client cannot send
HTTP Basic, it cannot connect — there is no fallback.

The admin web UI (`/admin`) uses a separate cookie session with the same
password; MCP always uses Basic auth.

## Efficient editing workflow (token-conscious)

The toolset is deliberately compact so an agent spends tokens on the change,
not on scanning the site. Recommended sequence:

1. `discover_site` — one small response: scalar field names, all rendered
   section keys, collection counts/fields, and the current content revision.
2. Read only the target: `get_section` (one text key), `get_site_content`
   (one scalar), or `list_collection` + `get_collection_item` (one item).
3. Mutate with `expectedRevision` — `patch_section`,
   `update_site_content`, `add_collection_item`, `patch_collection_item`,
   `remove_collection_item`.
4. Optionally `create_site_version` **before** larger edits so a snapshot
   exists; only the latest five are retained.

Never dump the whole site: there is no "read everything" tool by design.

## What can be edited

- **Scalars:** `headline`, `intro`, `font` (Manrope / Arial / Georgia /
  Trebuchet MS), `accent`, `logoUrl`.
- **Sections:** all 31 catalogued text keys (hero titles, about copy, visit
  info, page heroes, etc.) — `discover_site` lists them exactly.
- **Collections:** `programs`, `events`, `quotes`, `gallery` — add, patch,
  remove. Removing an item (including the last gallery photo) removes its
  reference from the site; the underlying image file is never deleted.

Empty strings and empty arrays are **intentional removals**: clearing a
section's text or removing an item does not restore defaults. Passing a
missing/omitted field does restore the default on some reads, so to clear
something, set it empty explicitly.

## Images

- Reuse existing URLs first (`/images/...` local paths or credential-free
  HTTPS URLs) — zero upload cost.
- New files go through `upload_image`: raw base64 (no data URI), max 4 MiB
  decoded, JPEG/PNG/WebP/GIF only, no SVG. Requires `BLOB_READ_WRITE_TOKEN`
  on the server; without it uploads fail. Upload returns a URL — then add or
  patch a collection item / `logoUrl` to actually display it.

## Concurrency and conflicts

Every mutation requires the current `expectedRevision`. If another editor
(including another AI session) changed content meanwhile, the tool returns a
conflict error with the current revision — re-read the target and retry once.
Never blind-write.

## Persistence and deployment — important

- Content saves go to the configured PostgreSQL database (`DATABASE_URL`).
  **Without `DATABASE_URL` the server falls back to an in-memory database:
  edits survive until the process restarts, then vanish.** Production deploys
  must set `DATABASE_URL` (and `BLOB_READ_WRITE_TOKEN` for uploads).
- Saving content is **not** deploying code: pushing photos/text via MCP
  changes live site data immediately, but code changes still need a git
  commit/push/deploy. Removing a content reference never deletes the image
  file itself.
- Local smoke harness: `node scripts/mcp-http-smoke.mjs` verifies the full
  auth gate, edit loop, revision conflicts, and public readback; it refuses
  to run when `DATABASE_URL` is set.
