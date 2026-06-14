-- ============================================================
-- Resenha Aposta — Schema Supabase (PostgreSQL)
-- Modelo: cada usuario faz login (nome + senha) e registra
-- suas proprias apostas (valor + odd). Ranking agregado.
-- Execute no SQL Editor do Supabase.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Limpeza do modelo antigo (se existir).
-- ------------------------------------------------------------
drop view  if exists public.ranking          cascade;
drop table if exists public.payments         cascade;
drop table if exists public.transactions     cascade;
drop table if exists public.bet_participants cascade;
drop table if exists public.bets             cascade;
drop table if exists public.friends          cascade;

-- ------------------------------------------------------------
-- USUARIOS (app_users)
-- Login simples por nome + senha (hash SHA-256 feito no cliente).
-- ------------------------------------------------------------
create table public.app_users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- APOSTAS (bets)
-- stake = valor apostado ; odd = multiplicador (ex 2.35)
-- status: 'pendente' | 'ganhou' | 'perdeu'
-- ------------------------------------------------------------
create table public.bets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.app_users(id) on delete cascade,
  title       text,
  description text,
  bet_date    date not null default current_date,
  stake       numeric(12,2) not null default 0,
  odd         numeric(8,2)  not null default 1,
  status      text not null default 'pendente'
                check (status in ('pendente','ganhou','perdeu')),
  created_at  timestamptz not null default now()
);

create index idx_bets_user   on public.bets(user_id);
create index idx_bets_status on public.bets(status);

-- ------------------------------------------------------------
-- View de RANKING (agregado por usuario)
-- profit (lucro liquido):
--   ganhou -> stake*odd - stake   |   perdeu -> -stake   |   pendente -> 0
-- ------------------------------------------------------------
create or replace view public.ranking as
select
  u.id,
  u.name,
  coalesce(sum(b.stake), 0)                                                    as total_staked,
  coalesce(sum(case when b.status = 'perdeu' then b.stake else 0 end), 0)      as total_lost,
  coalesce(sum(case when b.status = 'ganhou' then b.stake * b.odd - b.stake else 0 end), 0) as total_won,
  coalesce(sum(
    case when b.status = 'ganhou' then b.stake * b.odd - b.stake
         when b.status = 'perdeu' then -b.stake
         else 0 end), 0)                                                       as profit,
  count(*) filter (where b.status = 'ganhou')    as bets_won,
  count(*) filter (where b.status = 'perdeu')    as bets_lost,
  count(*) filter (where b.status = 'pendente')  as bets_pending,
  count(b.id)                                    as bets_total
from public.app_users u
left join public.bets b on b.user_id = u.id
group by u.id, u.name;

-- ============================================================
-- Row Level Security
-- App interno sem Supabase Auth: liberado para a chave 'anon'.
-- AVISO: password_hash fica legivel pela chave publica. Uso
-- interno entre amigos. Para producao real, mover auth para
-- Supabase Auth ou uma Edge Function.
-- ============================================================
alter table public.app_users enable row level security;
alter table public.bets      enable row level security;

drop policy if exists "anon_all_app_users" on public.app_users;
create policy "anon_all_app_users" on public.app_users for all to anon using (true) with check (true);

drop policy if exists "anon_all_bets" on public.bets;
create policy "anon_all_bets" on public.bets for all to anon using (true) with check (true);
