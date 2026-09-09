export type BetMatchParticipant = {
  puuid: string;
  teamId: number;
  isFocus: boolean;
  gameName: string;
  tagLine: string;
  opggHref: string;
  championName: string;
  championIconUrl: string;
  champLevel: number;
  role: string;
  kills: number;
  deaths: number;
  assists: number;
  kda: string;
  cs: number;
  gold: number;
  damageDealt: number;
  visionScore: number;
  itemIconUrls: string[];
  spell1Url: string | null;
  spell2Url: string | null;
};

export type BetMatchTeam = {
  teamId: number;
  win: boolean;
  isAlly: boolean;
  kills: number;
  towers: number;
  dragons: number;
  barons: number;
  participants: BetMatchParticipant[];
};

export type BetMatchSummaryPlayer = {
  playerId: string;
  playerName: string;
  profileHref: string;
};

export type BetMatchRowData = {
  matchId: string;
  win: boolean;
  summaryPlayers: BetMatchSummaryPlayer[];
  accountName: string;
  accountHref: string;
  iconUrl?: string;
  championName: string;
  championIconUrl: string;
  kills: number;
  deaths: number;
  assists: number;
  kda: string;
  duration: string;
  timeAgo: string;
  role: string;
  champLevel: number;
  cs: number;
  csPerMin: string;
  gold: number;
  damageDealt: number;
  damageTaken: number;
  visionScore: number;
  wardsPlaced: number;
  controlWards: number;
  killParticipation: string;
  multiKill: string | null;
  maxDamage: number;
  teams: BetMatchTeam[];
};

const SUMMONER_SPELL_ICONS: Record<number, string> = {
  1: 'SummonerBoost',
  3: 'SummonerExhaust',
  4: 'SummonerFlash',
  6: 'SummonerHaste',
  7: 'SummonerHeal',
  11: 'SummonerSmite',
  12: 'SummonerTeleport',
  13: 'SummonerMana',
  14: 'SummonerDot',
  21: 'SummonerBarrier',
  32: 'SummonerSnowball',
};

const ROLE_LABELS: Record<string, string> = {
  TOP: 'Top',
  JUNGLE: 'Jungle',
  MIDDLE: 'Mid',
  BOTTOM: 'ADC',
  UTILITY: 'Support',
};

const ROLE_ORDER: Record<string, number> = {
  TOP: 0,
  JUNGLE: 1,
  MIDDLE: 2,
  BOTTOM: 3,
  UTILITY: 4,
};

export function formatRole(position: string | undefined) {
  if (!position) return '—';
  return ROLE_LABELS[position] ?? position;
}

export function roleSortKey(position: string | undefined) {
  if (!position) return 99;
  return ROLE_ORDER[position] ?? 50;
}

export function summonerSpellIconUrl(version: string, spellId: number) {
  const name = SUMMONER_SPELL_ICONS[spellId];
  if (!name) return null;
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${name}.png`;
}

export function itemIconUrl(version: string, itemId: number) {
  if (!itemId) return '';
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
}

export function championIconUrl(version: string, championName: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;
}

export function formatMultiKill(me: {
  pentaKills?: number;
  quadraKills?: number;
  tripleKills?: number;
  doubleKills?: number;
}) {
  if ((me.pentaKills ?? 0) > 0) return 'Penta';
  if ((me.quadraKills ?? 0) > 0) return 'Quadra';
  if ((me.tripleKills ?? 0) > 0) return 'Triple';
  if ((me.doubleKills ?? 0) > 0) return 'Double';
  return null;
}

export function formatKda(kills: number, deaths: number, assists: number) {
  if (deaths === 0) return (kills + assists).toFixed(1);
  return ((kills + assists) / deaths).toFixed(1);
}

export function opggSummonerUrl(gameName: string, tagLine: string) {
  return `https://op.gg/lol/summoners/na/${encodeURIComponent(`${gameName}-${tagLine}`)}`;
}
