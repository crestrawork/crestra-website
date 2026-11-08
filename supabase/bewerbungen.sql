-- Bewerbungen freier Vertriebler über crestra.de/vertrieb.html
-- Einspielen: node ~/.cache/crestra-pg/q.js -f "supabase/bewerbungen.sql"
create table if not exists public.bewerbungen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 200),
  telefon text not null check (char_length(telefon) between 3 and 60),
  ort text check (char_length(ort) <= 200),
  erfahrung text check (char_length(erfahrung) <= 200),
  stunden text check (char_length(stunden) <= 200),
  nachricht text check (char_length(nachricht) <= 4000),
  quelle text check (char_length(quelle) <= 120),
  erledigt boolean not null default false
);
alter table public.bewerbungen enable row level security;
drop policy if exists bewerbungen_insert_anon on public.bewerbungen;
create policy bewerbungen_insert_anon on public.bewerbungen for insert to anon with check (erledigt = false);
grant insert on public.bewerbungen to anon;
