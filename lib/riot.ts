import { players } from './players';
import type { LolAccount } from './players';

const RIOT_API_TOKEN = process.env.RIOT_API_KEY;

const REGIONAL_BASE_URL = 'https://americas.api.riotgames.com';
const PLATFORM_BASE_URL = 'https://na1.api.riotgames.com';

type RiotFetchResult = {
  ok: boolean;
  rateLimited: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

async function riotFetch(url: string, revalidate = 600): Promise<RiotFetchResult> {
  if (!RIOT_API_TOKEN) {
    throw new Error('RIOT_API_KEY is not set');
  }

  const res = await fetch(url, {
    headers: { 'X-Riot-Token': RIOT_API_TOKEN },
    next: { revalidate },
  });

  if (res.status === 429) {
    console.error(`Riot API rate limited (429): ${url}`);
    return { ok: false, rateLimited: true, data: null };
  }

  if (!res.ok) {
    console.error(`Riot API request failed (${res.status}): ${url}`);
    return { ok: false, rateLimited: false, data: null };
  }

  return { ok: true, rateLimited: false, data: await res.json() };
}

export async function fetchPlayerPuuid() {
  const results = [];

  for (const discordUser of players) {
    for (const account of discordUser.accounts) {
      const url = `${REGIONAL_BASE_URL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(account.gameName)}/${encodeURIComponent(account.tagLine)}`;

      try {
        const result = await riotFetch(url);
        if (result.data) results.push(result.data);
      } catch (err) {
        console.error(
          `Error fetching puuid for ${account.gameName}#${account.tagLine}:`,
          err,
        );
      }
    }
  }

  return results;
}

async function getRanksForAccountList(accounts: LolAccount[]) {
  const ranks = [];
  for (const account of accounts) {
    const url = `${PLATFORM_BASE_URL}/lol/league/v4/entries/by-puuid/${account.puuid}`;
    const userName = account.gameName;
    try {
      const result = await riotFetch(url);
      if (result.data) ranks.push({ userName, rank: result.data });
    } catch (err) {
      console.error(
        `Error fetching ranks for ${account.gameName}#${account.tagLine}:`,
        err,
      );
    }
  }
  return ranks;
}

export async function getRanks() {
  const accounts = players.flatMap((player) => player.accounts);
  return getRanksForAccountList(accounts);
}

export async function getRanksForAccounts(accounts: LolAccount[]) {
  return getRanksForAccountList(accounts);
}

export async function getLatestDataDragonVersion() {
  const res = await fetch(
    'https://ddragon.leagueoflegends.com/api/versions.json',
    { next: { revalidate: 86400 } },
  );
  const versions = await res.json();
  return versions[0];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSummonerIcons(accounts: any[]) {
  const version = await getLatestDataDragonVersion();
  const icons = [];

  for (const account of accounts) {
    const url = `${PLATFORM_BASE_URL}/lol/summoner/v4/summoners/by-puuid/${account.puuid}`;
    const userName = account.gameName;
    try {
      const result = await riotFetch(url, 86400);
      if (result.data) {
        const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${result.data.profileIconId}.png`;
        icons.push({ userName, iconUrl });
      }
    } catch (err) {
      console.error(
        `Error fetching summoner icon for ${account.gameName}#${account.tagLine}:`,
        err,
      );
    }
  }

  return icons;
}

export function weekAgoStartTimeSeconds(now = Date.now()) {
  const weekAgo = Math.floor((now - 7 * 24 * 60 * 60 * 1000) / 1000);
  return weekAgo - (weekAgo % 3600);
}

export async function getMatchHistoryIDs(
  puuid: string,
  options?: { count?: number; queue?: number; startTime?: number },
) {
  try {
    const params = new URLSearchParams({
      start: '0',
      count: String(options?.count ?? 5),
    });
    if (options?.queue != null) params.set('queue', String(options.queue));
    if (options?.startTime != null) {
      params.set('startTime', String(options.startTime));
    }

    const result = await riotFetch(
      `${REGIONAL_BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?${params}`,
      300,
    );
    return result;
  } catch (err) {
    console.error(`Error fetching matches for ${puuid}`, err);
    return { ok: false, rateLimited: false, data: null };
  }
}

export async function getMatchHistoryInfo(matchId: string) {
  try {
    const result = await riotFetch(
      `${REGIONAL_BASE_URL}/lol/match/v5/matches/${matchId}`,
      604800,
    );
    return result;
  } catch (err) {
    console.error(`Error fetching match information for ${matchId}`, err);
    return { ok: false, rateLimited: false, data: null };
  }
}

export type MatchHistoryResult = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches: any[];
  rateLimited: boolean;
  failed: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPlayerMatchHistory(
  accounts: any[],
  options?: { count?: number; queue?: number; startTime?: number },
): Promise<MatchHistoryResult> {
  const matches = [];
  let rateLimited = false;
  let failed = false;

  for (const account of accounts) {
    try {
      const idsResult = await getMatchHistoryIDs(account.puuid, options);
      if (idsResult.rateLimited) rateLimited = true;
      if (!idsResult.ok || !Array.isArray(idsResult.data)) {
        failed = true;
        continue;
      }

      for (const matchId of idsResult.data) {
        const matchResult = await getMatchHistoryInfo(matchId);
        if (matchResult.rateLimited) rateLimited = true;
        if (!matchResult.ok || !matchResult.data) {
          failed = true;
          continue;
        }
        matches.push(matchResult.data);
      }
    } catch (err) {
      failed = true;
      console.error(
        `Error fetching match history for ${account.gameName}#${account.tagLine}:`,
        err,
      );
    }
  }

  return { matches, rateLimited, failed };
}
