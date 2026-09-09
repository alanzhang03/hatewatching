import Link from 'next/link';
import type { Player } from '@/lib/players';
import { PlayerAvatar } from '../PlayerAvatar';
import { AccountRow } from '../AccountRow';
import styles from '../page.module.css';

const NO_DIVISION_TIERS = ['MASTER', 'GRANDMASTER', 'CHALLENGER'];

const TIER_ORDER = {
  IRON: 0,
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
  EMERALD: 5,
  DIAMOND: 6,
  MASTER: 7,
  GRANDMASTER: 8,
  CHALLENGER: 9,
};

const DIVISION_ORDER = { IV: 0, III: 1, II: 2, I: 3 };

const TIER_CLASS = {
  IRON: styles.rankIron,
  BRONZE: styles.rankBronze,
  SILVER: styles.rankSilver,
  GOLD: styles.rankGold,
  PLATINUM: styles.rankPlatinum,
  EMERALD: styles.rankEmerald,
  DIAMOND: styles.rankDiamond,
  MASTER: styles.rankMaster,
  GRANDMASTER: styles.rankGrandmaster,
  CHALLENGER: styles.rankChallenger,
};

function formatTier(tier: string) {
  return tier.charAt(0) + tier.slice(1).toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function soloEntries(player: Player, ranks: any[]) {
  return player.accounts.flatMap((account) => {
    const entry = ranks.find((r) => r.userName === account.gameName);
    const solo = entry?.rank?.find(
      (e: { queueType: string }) => e.queueType === 'RANKED_SOLO_5x5',
    );
    return solo ? [solo] : [];
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scoreSoloEntry(solo: any) {
  const tier = TIER_ORDER[solo.tier as keyof typeof TIER_ORDER] ?? 0;
  const division =
    DIVISION_ORDER[solo.rank as keyof typeof DIVISION_ORDER] ?? 0;
  return tier * 10000 + division * 1000 + solo.leaguePoints;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function primarySoloEntry(player: Player, ranks: any[]) {
  const entries = soloEntries(player, ranks);
  if (entries.length === 0) return null;

  let best = entries[0];
  let bestScore = -1;
  for (const solo of entries) {
    const score = scoreSoloEntry(solo);
    if (score > bestScore) {
      bestScore = score;
      best = solo;
    }
  }
  return best;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function soloRankScore(player: Player, ranks: any[]) {
  const solo = primarySoloEntry(player, ranks);
  return solo ? scoreSoloEntry(solo) : -1;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bestSoloLabel(player: Player, ranks: any[]) {
  const best = primarySoloEntry(player, ranks);
  if (!best)
    return { label: 'Unranked', tierClass: styles.rankBadgeUnranked };

  const tierLabel = formatTier(best.tier);
  const label = NO_DIVISION_TIERS.includes(best.tier)
    ? `${tierLabel} · ${best.leaguePoints} LP`
    : `${tierLabel} ${best.rank} · ${best.leaguePoints} LP`;

  return {
    label,
    tierClass:
      TIER_CLASS[best.tier as keyof typeof TIER_CLASS] ??
      styles.rankBadgeUnranked,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function soloRecord(player: Player, ranks: any[]) {
  const solo = primarySoloEntry(player, ranks);
  if (!solo) return { wins: 0, losses: 0, games: 0 };
  const wins = solo.wins ?? 0;
  const losses = solo.losses ?? 0;
  return { wins, losses, games: wins + losses };
}

export function ContestantCard({
  player,
  aka,
  startGames,
  extraGamesAllowed,
  place,
  ranks,
  icons,
}: {
  player: Player;
  aka: string;
  startGames: number;
  extraGamesAllowed: number;
  place: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ranks: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icons: any[];
}) {
  const { wins, losses, games } = soloRecord(player, ranks);
  const maxGames = startGames + extraGamesAllowed;
  const remaining = Math.max(0, maxGames - games);
  const usedOfAllowance = Math.min(
    extraGamesAllowed,
    Math.max(0, games - startGames),
  );
  const progress = Math.min(100, (usedOfAllowance / extraGamesAllowed) * 100);
  const wr = games > 0 ? ((wins / games) * 100).toFixed(1) : '—';
  const { label, tierClass } = bestSoloLabel(player, ranks);
  const overCap = games > maxGames;

  return (
    <section className={styles.betCard}>
      <div className={styles.betCardTop}>
        <span className={styles.betPlace}>#{place}</span>
        <Link
          href={`/${player.id.toLowerCase()}`}
          className={styles.betCardIdentity}
        >
          <PlayerAvatar
            id={player.id}
            displayName={player.displayName}
            size={44}
          />
          <div>
            <h2 className={styles.betCardName}>{player.displayName}</h2>
            <p className={styles.betCardAka}>{aka}</p>
          </div>
        </Link>
        <span className={`${styles.rankBadge} ${tierClass}`}>{label}</span>
      </div>

      <div className={styles.betGamesLeft}>
        <span className={styles.betStatLabel}>Games left</span>
        <span
          className={`${styles.betGamesLeftValue} ${
            overCap ? styles.betGamesLeftOver : ''
          }`}
        >
          {overCap ? 0 : remaining}
        </span>
        <span className={styles.betStatMeta}>
          {overCap
            ? `${games - maxGames} over cap`
            : `${games} / ${maxGames} played`}{' '}
          · started at {startGames}
        </span>
      </div>

      <div
        className={styles.betProgressTrack}
        role='progressbar'
        aria-valuenow={usedOfAllowance}
        aria-valuemin={0}
        aria-valuemax={extraGamesAllowed}
        aria-label='Games used of allowance'
      >
        <div
          className={`${styles.betProgressFill} ${
            overCap ? styles.betProgressOver : ''
          }`}
          style={{ width: `${overCap ? 100 : progress}%` }}
        />
      </div>

      <div className={styles.betStats}>
        <div>
          <span className={styles.betStatLabel}>Solo WR</span>
          <span className={styles.betStatValue}>
            {wr}
            {wr !== '—' ? '%' : ''}
          </span>
          <span className={styles.betStatMeta}>
            {wins}W · {losses}L
          </span>
        </div>
        <div>
          <span className={styles.betStatLabel}>Allowance used</span>
          <span className={styles.betStatValue}>
            {usedOfAllowance}
            <span className={styles.betStatCap}> / {extraGamesAllowed}</span>
          </span>
          <span className={styles.betStatMeta}>of +{extraGamesAllowed} games</span>
        </div>
      </div>

      <ul className={styles.accounts}>
        {player.accounts.map((account) => {
          const rankEntry = ranks.find((r) => r.userName === account.gameName);
          const iconEntry = icons.find((i) => i.userName === account.gameName);
          return (
            <AccountRow
              key={`${account.gameName}-${account.tagLine}`}
              account={account}
              rank={rankEntry?.rank}
              iconUrl={iconEntry?.iconUrl}
            />
          );
        })}
      </ul>
    </section>
  );
}
