import type { LolAccount } from '@/lib/players';
import { opggUrl, uggUrl, leagueOfGraphsUrl, deepLolUrl } from '@/lib/links';
import { CopyRiotId } from './CopyRiotId';
import styles from './page.module.css';

const NO_DIVISION_TIERS = ['MASTER', 'GRANDMASTER', 'CHALLENGER'];

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

const QUEUES = [
  { type: 'RANKED_SOLO_5x5', label: 'Solo' },
  { type: 'RANKED_FLEX_SR', label: 'Flex' },
];

function formatTier(tier: string) {
  return tier.charAt(0) + tier.slice(1).toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findQueueRank(entries: any[], queueType: string) {
  return entries.find((e) => e.queueType === queueType) ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function queueRankLabel(entry: any, prefix: string) {
  if (!entry) return `${prefix} · Unranked`;

  const tierLabel = formatTier(entry.tier);
  if (NO_DIVISION_TIERS.includes(entry.tier)) {
    return `${prefix} · ${tierLabel} · ${entry.leaguePoints} LP`;
  }
  return `${prefix} · ${tierLabel} ${entry.rank} · ${entry.leaguePoints} LP`;
}

export function AccountRow({
  account,
  rank,
  iconUrl,
}: {
  account: LolAccount;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rank?: any[];
  iconUrl?: string;
}) {
  return (
    <li>
      <div className={styles.riotIdRow}>
        <span className={styles.riotIdWithIcon}>
          {iconUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={iconUrl}
              alt=""
              className={styles.summonerIcon}
              width={20}
              height={20}
            />
          )}
          <CopyRiotId gameName={account.gameName} tagLine={account.tagLine} />
        </span>
        {rank && (
          <span className={styles.rankBadgeGroup}>
            {QUEUES.map(({ type, label }) => {
              const entry = findQueueRank(rank, type);
              const tierClass = entry
                ? TIER_CLASS[entry.tier as keyof typeof TIER_CLASS]
                : undefined;
              return (
                <span
                  key={type}
                  className={`${styles.rankBadge} ${tierClass ?? styles.rankBadgeUnranked}`}
                >
                  {queueRankLabel(entry, label)}
                </span>
              );
            })}
          </span>
        )}
      </div>
      <span className={styles.linkGroup}>
        <a
          className={`${styles.linkChip} ${styles.linkChipOpgg}`}
          href={opggUrl(account)}
          target='_blank'
          rel='noopener noreferrer'
        >
          op.gg
        </a>
        <a
          className={`${styles.linkChip} ${styles.linkChipUgg}`}
          href={uggUrl(account)}
          target='_blank'
          rel='noopener noreferrer'
        >
          u.gg
        </a>
        <a
          className={`${styles.linkChip} ${styles.linkChipDeeplol}`}
          href={deepLolUrl(account)}
          target='_blank'
          rel='noopener noreferrer'
        >
          deeplol
        </a>
        <a
          className={`${styles.linkChip} ${styles.linkChipPorofessor}`}
          href={leagueOfGraphsUrl(account)}
          target='_blank'
          rel='noopener noreferrer'
        >
          League of graphs
        </a>
      </span>
    </li>
  );
}
