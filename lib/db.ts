import { neon } from '@neondatabase/serverless';

let client: ReturnType<typeof neon> | null = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  client ??= neon(process.env.DATABASE_URL);
  return client;
}

export const SCHEMA = [
  `create table if not exists poll_state (
    puuid text primary key,
    last_polled_at timestamptz not null
  )`,
  `create table if not exists matches (
    match_id text primary key,
    queue_id integer not null,
    game_end timestamptz not null,
    data jsonb not null
  )`,
  `create index if not exists matches_game_end_idx on matches (game_end desc)`,
  `create table if not exists match_participants (
    match_id text not null references matches (match_id) on delete cascade,
    puuid text not null,
    primary key (match_id, puuid)
  )`,
  `create index if not exists match_participants_puuid_idx on match_participants (puuid)`,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getRecentMatches(puuids: string[], limit = 50): Promise<any[]> {
  const sql = getSql();
  const rows = (await sql`
    select m.data
    from matches m
    where exists (
      select 1 from match_participants mp
      where mp.match_id = m.match_id and mp.puuid = any(${puuids}::text[])
    )
    order by m.game_end desc
    limit ${limit}
  `) as { data: unknown }[];
  return rows.map((row) => row.data);
}
