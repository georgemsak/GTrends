-- Soko Radar — Supabase Schema
-- Run this in Supabase SQL Editor to set up your tables

create table if not exists trends (
  id          bigserial primary key,
  keyword     text,
  commodity   text not null,
  trend_score int not null,
  prev_score  int,
  pct_change  numeric(5,2),
  date        date not null,
  created_at  timestamptz default now()
);
create index if not exists idx_trends_commodity_date on trends (commodity, date desc);

create table if not exists api_keys (
  id             bigserial primary key,
  key            text unique not null,
  email          text not null,
  plan           text not null default 'free',
  requests_used  int not null default 0,
  requests_limit int not null default 1000,
  active         boolean not null default true,
  created_at     timestamptz default now()
);
create index if not exists idx_api_keys_key on api_keys (key);
