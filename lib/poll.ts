import { getSql } from './db';
import { players } from './players';
import { riotFetch } from './riot';

const REGIONAL_BASE_URL = 'https://americas.api.riotgames.com';

const MAX_REQUESTS_PER_RUN = 60;

const INITIAL_LOOKBACK_SECONDS = 3 * 24 * 60 * 60;

const OVERLAP_SECONDS = 10 * 60;

export type PollResult = {
  accountsPolled: number;
  accountsTotal: number;
  newMatches: number;
  requests: number;
  stoppedReason: 'done' | 'rate-limited' | 'budget' | 'error';
};

export async function pollMatches(): Promise<PollResult> {
  const sql = getSql();
  const accounts = players.flatMap((player) => player.accounts);
  const groupPuuids = new Set(accounts.map((account) => account.puuid));

  const stateRows = (await sql`
    select puuid, extract(epoch from last_polled_at)::bigint as last_polled
    from poll_state
  `) as { puuid: string; last_polled: string }[];
  const lastPolled = new Map(
    stateRows.map((row) => [row.puuid, Number(row.last_polled)]),
  );

  const ordered = [...accounts].sort(
    (a, b) => (lastPolled.get(a.puuid) ?? 0) - (lastPolled.get(b.puuid) ?? 0),
  );

  const result: PollResult = {
    accountsPolled: 0,
    accountsTotal: accounts.length,
    newMatches: 0,
    requests: 0,
    stoppedReason: 'done',
  };

  for (const account of ordered) {
    if (result.requests >= MAX_REQUESTS_PER_RUN) {
      result.stoppedReason = 'budget';
      break;
    }

    const pollStartedAt = Math.floor(Date.now() / 1000);
    const startTime =
      (lastPolled.get(account.puuid) ??
        pollStartedAt - INITIAL_LOOKBACK_SECONDS) - OVERLAP_SECONDS;

    const params = new URLSearchParams({
      start: '0',
      count: '20',
      startTime: String(startTime),
    });
    const idsResult = await riotFetch(
      `${REGIONAL_BASE_URL}/lol/match/v5/matches/by-puuid/${account.puuid}/ids?${params}`,
      'no-store',
    );
    result.requests++;
    if (idsResult.rateLimited) {
      result.stoppedReason = 'rate-limited';
      break;
    }
    if (!idsResult.ok || !Array.isArray(idsResult.data)) {
      result.stoppedReason = 'error';
      continue;
    }

    const matchIds = idsResult.data as string[];
    const known = matchIds.length
      ? ((await sql`
          select match_id from matches where match_id = any(${matchIds}::text[])
        `) as { match_id: string }[])
      : [];
    const knownIds = new Set(known.map((row) => row.match_id));

    let finishedAccount = true;
    for (const matchId of matchIds) {
      if (knownIds.has(matchId)) continue;
      if (result.requests >= MAX_REQUESTS_PER_RUN) {
        result.stoppedReason = 'budget';
        finishedAccount = false;
        break;
      }

      const matchResult = await riotFetch(
        `${REGIONAL_BASE_URL}/lol/match/v5/matches/${matchId}`,
        'no-store',
      );
      result.requests++;
      if (matchResult.rateLimited) {
        result.stoppedReason = 'rate-limited';
        finishedAccount = false;
        break;
      }
      if (!matchResult.ok || !matchResult.data?.info) {
        result.stoppedReason = 'error';
        finishedAccount = false;
        continue;
      }

      await saveMatch(matchResult.data, groupPuuids);
      result.newMatches++;
    }

    if (finishedAccount) {
      await sql`
        insert into poll_state (puuid, last_polled_at)
        values (${account.puuid}, to_timestamp(${pollStartedAt}))
        on conflict (puuid) do update set last_polled_at = excluded.last_polled_at
      `;
      result.accountsPolled++;
    }

    if (result.stoppedReason === 'rate-limited') break;
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveMatch(match: any, groupPuuids: Set<string>) {
  const sql = getSql();
  const info = match.info;
  const gameEndMs =
    info.gameEndTimestamp ??
    info.gameStartTimestamp + (info.gameDuration ?? 0) * 1000;
  const participantPuuids = (info.participants as { puuid: string }[])
    .map((p) => p.puuid)
    .filter((puuid) => groupPuuids.has(puuid));

  await sql.transaction([
    sql`
      insert into matches (match_id, queue_id, game_end, data)
      values (
        ${match.metadata.matchId},
        ${info.queueId ?? 0},
        to_timestamp(${gameEndMs} / 1000.0),
        ${JSON.stringify(match)}::jsonb
      )
      on conflict (match_id) do nothing
    `,
    sql`
      insert into match_participants (match_id, puuid)
      select ${match.metadata.matchId}, unnest(${participantPuuids}::text[])
      on conflict do nothing
    `,
  ]);
}
