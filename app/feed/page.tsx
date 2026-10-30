import { Suspense } from 'react';
import { players } from '@/lib/players';
import { getRecentMatches, hasDatabase } from '@/lib/db';
import { getLatestDataDragonVersion, getSummonerIcons } from '@/lib/riot';
import { SiteNav } from '../SiteNav';
import { BetMatchList } from '../soloq-bet/BetMatchList';
import { buildMatchRows } from '../soloq-bet/buildMatchRows';
import styles from '../page.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Match feed · chogwarts accounts',
  description: 'Most recent matches from everyone in the server',
};

const FEED_LIMIT = 50;

async function MatchFeed() {
  if (!hasDatabase()) {
    return <p className={styles.empty}>Match feed isn’t set up yet.</p>;
  }

  const accounts = players.flatMap((player) => player.accounts);

  let matches;
  try {
    matches = await getRecentMatches(
      accounts.map((account) => account.puuid),
      FEED_LIMIT,
    );
  } catch (err) {
    console.error('Error loading match feed:', err);
    return (
      <p className={styles.empty}>
        Couldn’t load the match feed. Refresh and try again.
      </p>
    );
  }

  if (matches.length === 0) {
    return <p className={styles.empty}>No matches tracked yet.</p>;
  }

  const [icons, version] = await Promise.all([
    getSummonerIcons(accounts),
    getLatestDataDragonVersion(),
  ]);

  const rows = buildMatchRows({
    matches,
    players,
    icons,
    version,
    showQueue: true,
  });

  return <BetMatchList matches={rows} />;
}

export default function FeedPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SiteNav />

        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Match feed</h1>
            <p className={styles.subtitle}>
              Latest games from everyone · updates every 5 minutes
            </p>
          </div>
        </header>

        <section className={styles.betSection}>
          <Suspense
            fallback={<p className={styles.empty}>Loading matches...</p>}
          >
            <MatchFeed />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
