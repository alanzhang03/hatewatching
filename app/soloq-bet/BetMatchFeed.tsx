import {
  getLatestDataDragonVersion,
  getPlayerMatchHistory,
  weekAgoStartTimeSeconds,
} from '@/lib/riot';
import type { Player } from '@/lib/players';
import { BetMatchList } from './BetMatchList';
import { buildMatchRows } from './buildMatchRows';
import styles from '../page.module.css';

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
  const [history, version] = await Promise.all([
    getPlayerMatchHistory(accounts, {
      count: 100,
      queue: 420,
      startTime: weekAgoStartTimeSeconds(),
    }),
    getLatestDataDragonVersion(),
  ]);
  const { matches, rateLimited, failed } = history;

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
    return (
      <p className={styles.empty}>No ranked solo matches in the last 7 days.</p>
    );
  }

  const rows = buildMatchRows({
    matches: sorted,
    players: contestants,
    icons,
    version,
  });

  return <BetMatchList matches={rows} />;
}
