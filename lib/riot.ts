import { players } from './players';

const RIOT_API_TOKEN = process.env.RIOT_API_KEY;

const REGIONAL_BASE_URL = 'https://americas.api.riotgames.com';
const PLATFORM_BASE_URL = 'https://na1.api.riotgames.com';

async function riotFetch(url: string) {
  if (!RIOT_API_TOKEN) {
    throw new Error('RIOT_API_KEY is not set');
  }

  const res = await fetch(url, {
    headers: { 'X-Riot-Token': RIOT_API_TOKEN },
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

export async function 