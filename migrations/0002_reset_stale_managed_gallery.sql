-- The managed site_content row was seeded before the gallery was trimmed to
-- the 13 supplied gym photos, and managed content always overrides code
-- defaults. Clearing the row falls back to the (now correct) in-code gallery.
-- Local PGLite previews reset anyway; this matters on Neon at deploy.
delete from site_content where id = true;
