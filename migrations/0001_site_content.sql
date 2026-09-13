create table if not exists site_content (
  id boolean primary key default true check (id),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists site_versions (
  id text primary key,
  label text not null,
  content jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists site_versions_created_at_idx on site_versions (created_at desc);
