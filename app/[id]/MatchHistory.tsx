import { getPlayerMatchHistory } from '@/lib/riot';
import { opggUrl } from '@/lib/links';
import styles from '../page.module.css';

const QUEUE_NAMES = {
  420: 'Ranked Solo',
  440: 'Ranked Flex',
  400: 'Normal Draft',
  430: 'Normal Blind',
  450: 'ARAM',
  490: 'Normal',
  900: 'ARURF',
  1900: 'URF',
};

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

export async function MatchHistory({
  accounts,
  icons,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  accounts: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icons: any[];
}) {
  const { matches, rateLimited, failed } = await getPlayerMatchHistory(accounts);
  const playerPuuids = accounts.map((a) => a.puuid);

  const sorted = [...matches].sort(
    (a, b) => b.info.gameEndTimestamp - a.info.gameEndTimestamp,
  );

  if (sorted.length === 0) {
    if (rateLimited) {
      return (
        <p className={styles.empty}>
          Riot API rate limit hit — try again in a minute or two.
        </p>
      );
    }
    if (failed) {
      return (
        <p className={styles.empty}>
          Couldn’t load match history from Riot. Refresh and try again.
        </p>
      );
    }
    return <p className={styles.empty}>No recent matches found.</p>;
  }

  return (
    <ul className={styles.matchList}>
      {sorted.map((match) => {
        const me = match.info.participants.find((p: { puuid: string }) =>
          playerPuuids.includes(p.puuid),
        );
        if (!me) return null;

        const account = accounts.find((a) => a.puuid === me.puuid);
        const iconEntry = icons.find((i) => i.userName === account?.gameName);

        return (
          <li
            key={match.metadata.matchId}
            className={`${styles.matchRow} ${
              me.win ? styles.matchRowWin : styles.matchRowLoss
            }`}
          >
            <a
              className={styles.matchAccountLabel}
              href={account ? opggUrl(account) : undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              {iconEntry?.iconUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconEntry.iconUrl}
                  alt=""
                  className={styles.summonerIcon}
                  width={18}
                  height={18}
                />
              )}
              {account?.gameName ?? 'Unknown'}
            </a>
            <span
              className={
                me.win ? styles.matchResultWin : styles.matchResultLoss
              }
            >
              {me.win ? 'Win' : 'Loss'}
            </span>
            <span className={styles.matchChampion}>{me.championName}</span>
            <span className={styles.matchKda}>
              {me.kills}/{me.deaths}/{me.assists}
            </span>
            <span className={styles.matchQueue}>
              {QUEUE_NAMES[match.info.queueId as keyof typeof QUEUE_NAMES] ??
                'Other'}
            </span>
            <span className={styles.matchMeta}>
              {formatDuration(match.info.gameDuration)} ·{' '}
              {timeAgo(match.info.gameEndTimestamp)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
