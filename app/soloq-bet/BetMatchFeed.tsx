import { getLatestDataDragonVersion, getPlayerMatchHistory } from '@/lib/riot';
import type { LolAccount, Player } from '@/lib/players';
import { opggUrl } from '@/lib/links';
import { BetMatchList } from './BetMatchList';
import {
  championIconUrl,
  formatKda,
  formatMultiKill,
  formatRole,
  itemIconUrl,
  opggSummonerUrl,
  roleSortKey,
  summonerSpellIconUrl,
  type BetMatchParticipant,
  type BetMatchRowData,
  type BetMatchTeam,
} from './matchUtils';
import styles from '../page.module.css';

function timeAgo(timestamp: number) {
  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapParticipant(
  p: any,
  version: string,
  focusPuuids: Set<string>,
): BetMatchParticipant & { _roleKey: number } {
  const items = [
    p.item0,
    p.item1,
    p.item2,
    p.item3,
    p.item4,
    p.item5,
    p.item6,
  ] as number[];
  const gameName = p.riotIdGameName || p.summonerName || 'Unknown';
  const tagLine = p.riotIdTagline || '';
  const rawRole = p.teamPosition || p.individualPosition || '';

  return {
    puuid: p.puuid,
    teamId: p.teamId,
    isFocus: focusPuuids.has(p.puuid),
    gameName,
    tagLine,
    opggHref: opggSummonerUrl(gameName, tagLine || 'NA1'),
    championName: p.championName,
    championIconUrl: championIconUrl(version, p.championName),
    champLevel: p.champLevel ?? 0,
    role: formatRole(rawRole),
    kills: p.kills ?? 0,
    deaths: p.deaths ?? 0,
    assists: p.assists ?? 0,
    kda: formatKda(p.kills ?? 0, p.deaths ?? 0, p.assists ?? 0),
    cs: (p.totalMinionsKilled ?? 0) + (p.neutralMinionsKilled ?? 0),
    gold: p.goldEarned ?? 0,
    damageDealt: p.totalDamageDealtToChampions ?? 0,
    visionScore: p.visionScore ?? 0,
    itemIconUrls: items.map((id) => itemIconUrl(version, id)),
    spell1Url: summonerSpellIconUrl(version, p.summoner1Id),
    spell2Url: summonerSpellIconUrl(version, p.summoner2Id),
    _roleKey: roleSortKey(rawRole),
  };
}

export async function BetMatchFeed({
  contestants,
  icons,
}: {
  contestants: Player[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icons: any[];
}) {
  const weekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const accounts = contestants.flatMap((p) => p.accounts);
  const [matches, version] = await Promise.all([
    getPlayerMatchHistory(accounts, {
      count: 100,
      queue: 420,
      startTime: Math.floor(weekAgoMs / 1000),
    }),
    getLatestDataDragonVersion(),
  ]);

  const puuidToPlayer = new Map<string, Player>();
  const puuidToAccount = new Map<string, LolAccount>();
  for (const player of contestants) {
    for (const account of player.accounts) {
      puuidToPlayer.set(account.puuid, player);
      puuidToAccount.set(account.puuid, account);
    }
  }

  const playerPuuids = new Set(puuidToPlayer.keys());

  const uniqueMatches = [];
  const seenMatchIds = new Set<string>();
  for (const match of matches) {
    if (
      !match?.info ||
      match.info.queueId !== 420 ||
      match.info.gameEndTimestamp < weekAgoMs
    ) {
      continue;
    }
    const matchId = match.metadata?.matchId;
    if (!matchId || seenMatchIds.has(matchId)) continue;
    seenMatchIds.add(matchId);
    uniqueMatches.push(match);
  }

  const sorted = uniqueMatches.sort(
    (a, b) => b.info.gameEndTimestamp - a.info.gameEndTimestamp,
  );

  if (sorted.length === 0) {
    return (
      <p className={styles.empty}>No ranked solo matches in the last 7 days.</p>
    );
  }

  const rows: BetMatchRowData[] = [];

  for (const match of sorted) {
    const contestantsInMatch = match.info.participants.filter(
      (p: { puuid: string }) => playerPuuids.has(p.puuid),
    );
    if (contestantsInMatch.length === 0) continue;

    // Summary row uses the first contestant; scoreboard highlights all of them.
    const me = contestantsInMatch[0] as {
      puuid: string;
      teamId: number;
      win: boolean;
      championName: string;
      kills: number;
      deaths: number;
      assists: number;
      teamPosition?: string;
      individualPosition?: string;
      champLevel?: number;
      totalMinionsKilled?: number;
      neutralMinionsKilled?: number;
      goldEarned?: number;
      totalDamageDealtToChampions?: number;
      totalDamageTaken?: number;
      visionScore?: number;
      wardsPlaced?: number;
      detectorWardsPlaced?: number;
      challenges?: { killParticipation?: number };
      pentaKills?: number;
      quadraKills?: number;
      tripleKills?: number;
      doubleKills?: number;
    };
    const focusPuuids = new Set<string>();
    for (const participant of contestantsInMatch) {
      focusPuuids.add(String((participant as { puuid: string }).puuid));
    }

    const player = puuidToPlayer.get(me.puuid);
    const account = puuidToAccount.get(me.puuid);
    if (!player || !account) continue;

    const iconEntry = icons.find((i) => i.userName === account.gameName);
    const durationSec = match.info.gameDuration || 1;
    const cs =
      (me.totalMinionsKilled ?? 0) + (me.neutralMinionsKilled ?? 0);
    const kp = me.challenges?.killParticipation;

    const participants: BetMatchParticipant[] = (
      match.info.participants as unknown[]
    )
      .map((p) => mapParticipant(p, version, focusPuuids))
      .sort((a, b) => a._roleKey - b._roleKey)
      .map((entry) => ({
        puuid: entry.puuid,
        teamId: entry.teamId,
        isFocus: entry.isFocus,
        gameName: entry.gameName,
        tagLine: entry.tagLine,
        opggHref: entry.opggHref,
        championName: entry.championName,
        championIconUrl: entry.championIconUrl,
        champLevel: entry.champLevel,
        role: entry.role,
        kills: entry.kills,
        deaths: entry.deaths,
        assists: entry.assists,
        kda: entry.kda,
        cs: entry.cs,
        gold: entry.gold,
        damageDealt: entry.damageDealt,
        visionScore: entry.visionScore,
        itemIconUrls: entry.itemIconUrls,
        spell1Url: entry.spell1Url,
        spell2Url: entry.spell2Url,
      }));

    const maxDamage = Math.max(
      ...participants.map((p: BetMatchParticipant) => p.damageDealt),
      1,
    );

    const teams: BetMatchTeam[] = [100, 200].map((teamId) => {
      const teamMeta = match.info.teams.find(
        (t: { teamId: number }) => t.teamId === teamId,
      );
      const teamPlayers = participants.filter(
        (p: BetMatchParticipant) => p.teamId === teamId,
      );
      return {
        teamId,
        win: Boolean(teamMeta?.win),
        isAlly: teamId === me.teamId,
        kills:
          teamMeta?.objectives?.champion?.kills ??
          teamPlayers.reduce(
            (sum: number, p: BetMatchParticipant) => sum + p.kills,
            0,
          ),
        towers: teamMeta?.objectives?.tower?.kills ?? 0,
        dragons: teamMeta?.objectives?.dragon?.kills ?? 0,
        barons: teamMeta?.objectives?.baron?.kills ?? 0,
        participants: teamPlayers,
      };
    });

    teams.sort((a, b) => Number(b.isAlly) - Number(a.isAlly));

    const summaryPlayers = contestantsInMatch.flatMap(
      (participant: { puuid: string }) => {
        const contestant = puuidToPlayer.get(participant.puuid);
        if (!contestant) return [];
        return [
          {
            playerId: contestant.id,
            playerName: contestant.displayName,
            profileHref: `/${contestant.id.toLowerCase()}`,
          },
        ];
      },
    );

    rows.push({
      matchId: match.metadata.matchId,
      win: me.win,
      summaryPlayers,
      accountName: account.gameName,
      accountHref: opggUrl(account),
      iconUrl: iconEntry?.iconUrl,
      championName: me.championName,
      championIconUrl: championIconUrl(version, me.championName),
      kills: me.kills,
      deaths: me.deaths,
      assists: me.assists,
      kda: formatKda(me.kills, me.deaths, me.assists),
      duration: formatDuration(match.info.gameDuration),
      timeAgo: timeAgo(match.info.gameEndTimestamp),
      role: formatRole(me.teamPosition || me.individualPosition),
      champLevel: me.champLevel ?? 0,
      cs,
      csPerMin: (cs / (durationSec / 60)).toFixed(1),
      gold: me.goldEarned ?? 0,
      damageDealt: me.totalDamageDealtToChampions ?? 0,
      damageTaken: me.totalDamageTaken ?? 0,
      visionScore: me.visionScore ?? 0,
      wardsPlaced: me.wardsPlaced ?? 0,
      controlWards: me.detectorWardsPlaced ?? 0,
      killParticipation:
        typeof kp === 'number' ? `${Math.round(kp * 100)}%` : '—',
      multiKill: formatMultiKill(me),
      maxDamage,
      teams,
    });
  }

  return <BetMatchList matches={rows} />;
}
