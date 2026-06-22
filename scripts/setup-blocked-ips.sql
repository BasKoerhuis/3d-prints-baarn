-- Blocklist voor contactformulier-misbruik.
-- Draai dit eenmalig in de Supabase SQL-editor van dit project.
--
-- Werking: staat een bezoekers-IP in deze tabel, dan markeert de
-- contact-route het bericht (mail-onderwerp "⚠️ GEFLAGD IP") en krijgt
-- de bezoeker een waarschuwing te zien. Het bericht komt nog wél binnen.

create table if not exists public.blocked_ips (
  ip          text primary key,
  note        text,
  created_at  timestamptz not null default now()
);

-- RLS aan; alleen lezen toegestaan (de site leest met de anon-key).
-- Toevoegen/verwijderen doe je in de Supabase Table Editor.
alter table public.blocked_ips enable row level security;

drop policy if exists "blocked_ips read" on public.blocked_ips;
create policy "blocked_ips read"
  on public.blocked_ips
  for select
  using (true);

-- Een IP blokkeren doe je zo (voorbeeld):
--   insert into public.blocked_ips (ip, note)
--   values ('1.2.3.4', 'Jongen uit de klas - spam contactformulier');
