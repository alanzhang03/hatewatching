import { players } from './players';

const RIOT_API_TOKEN = process.env.RIOT_API_KEY;

const REGIONAL_BASE_URL = 'https://americas.api.riotgames.com';
const PLATFORM_BASE_URL = 'https://na1.api.riotgames.com';

async function riotFetch(url: string, revalidate = 600) {
  if (!RIOT_API_TOKEN) {
    throw new Error('RIOT_API_KEY is not set');
  }

  const res = await fetch(url, {
    headers: { 'X-Riot-Token': RIOT_API_TOKEN },
    next: { revalidate },
  });

  if (!res.ok) {
    console.error(`Riot API request failed (${res.status}): ${url}`);
    return null;
  }

  return await res.json();
}

export async function fetchPlayerPuuid() {
  const results = [];

  for (const discordUser of players) {
    for (const account of discordUser.accounts) {
      const url = `${REGIONAL_BASE_URL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(account.gameName)}/${encodeURIComponent(account.tagLine)}`;

      try {
        const data = await riotFetch(url);
        if (data) results.push(data);
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

export async function getRanks() {
  let ranks = [];
  for (const discordUser of players) {
    for (const account of discordUser.accounts) {
      const url = `${PLATFORM_BASE_URL}/lol/league/v4/entries/by-puuid/${account.puuid}`;
      const userName = account.gameName;
      try {
        const data = await riotFetch(url);
        if (data) ranks.push({ userName, rank: data });
      } catch (err) {
        console.error(
          `Error fetching puuid for ${account.gameName}#${account.tagLine}:`,
          err,
        );
      }
    }
  }
  return ranks;
}

async function getLatestDataDragonVersion() {
  const res = await fetch(
    'https://ddragon.leagueoflegends.com/api/versions.json',
    { next: { revalidate: 86400 } },
  );
  const versions = await res.json();
  return versions[0];
}

export async function getSummonerIcons() {
  const version = await getLatestDataDragonVersion();
  const icons = [];

  for (const discordUser of players) {
    for (const account of discordUser.accounts) {
      const url = `${PLATFORM_BASE_URL}/lol/summoner/v4/summoners/by-puuid/${account.puuid}`;
      const userName = account.gameName;
      try {
        const data = await riotFetch(url, 86400);
        if (data) {
          const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${data.profileIconId}.png`;
          icons.push({ userName, iconUrl });
        }
      } catch (err) {
        console.error(
          `Error fetching summoner icon for ${account.gameName}#${account.tagLine}:`,
          err,
        );
      }
    }
  }

  return icons;
}

export async function getMatchHistoryIDs(puuid: string) {
  let matchHistory;
  try {
    const response = await riotFetch(
      `${REGIONAL_BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5`,
    );
    matchHistory = response;
  } catch (err) {
    console.error(`Error fetching matches for ${puuid}`, err);
  }

  return matchHistory;
}

export async function getMatchHistoryInfo(matchId: string) {
  let matchHistoryInfo;
  try {
    const response = await riotFetch(
      `${REGIONAL_BASE_URL}/lol/match/v5/matches/${matchId}`,
      604800,
    );
    matchHistoryInfo = response;
  } catch (err) {
    console.error(`Error fetching match information for ${matchId}`, err);
  }

  return matchHistoryInfo;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPlayerMatchHistory(accounts: any[]) {
  const matches = [];

  for (const account of accounts) {
    try {
      const matchIds = await getMatchHistoryIDs(account.puuid);
      for (const matchId of matchIds) {
        const match = await getMatchHistoryInfo(matchId);
        if (match) matches.push(match);
      }
    } catch (err) {
      console.error(
        `Error fetching match history for ${account.gameName}#${account.tagLine}:`,
        err,
      );
    }
  }

  return matches;
}
