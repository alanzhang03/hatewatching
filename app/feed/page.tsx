import { Suspense } from 'react';
import Link from 'next/link';
import { players } from '@/lib/players';
import { getQueueCounts, getRecentMatches, hasDatabase } from '@/lib/db';
import { FEED_MODES, findFeedMode, type FeedMode } from '@/lib/queues';
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

async function MatchFeed({ mode }: { mode?: FeedMode }) {
  if (!hasDatabase()) {
    return <p className={styles.empty}>Match feed isn’t set up yet.</p>;
  }

  const accounts = players.flatMap((player) => player.accounts);
  const puuids = accounts.map((account) => account.puuid);

  let matches;
  let queueCounts;
  try {
    [matches, queueCounts] = await Promise.all([
      getRecentMatches(puuids, FEED_LIMIT, mode?.queueIds),
      getQueueCounts(puuids),
    ]);
  } catch (err) {
    console.error('Error loading match feed:', err);
    return (
      <p className={styles.empty}>
        Couldn’t load the match feed. Refresh and try again.
      </p>
    );
  }

  const modeFilters = <ModeFilters active={mode} queueCounts={queueCounts} />;

  if (matches.length === 0) {
    return (
      <>
        {modeFilters}
        <p className={styles.empty}>
          {mode ? `No ${mode.label} matches tracked yet.` : 'No matches tracked yet.'}
        </p>
      </>
    );
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

  return (
    <>
      {modeFilters}
      <BetMatchList matches={rows} />
    </>
  );
}

function ModeFilters({
  active,
  queueCounts,
}: {
  active?: FeedMode;
  queueCounts: Map<number, number>;
}) {
  const total = [...queueCounts.values()].reduce((sum, n) => sum + n, 0);
  const modes = FEED_MODES.map((mode) => ({
    ...mode,
    count: mode.queueIds.reduce((sum, id) => sum + (queueCounts.get(id) ?? 0), 0),
  })).filter((mode) => mode.count > 0 || mode.id === active?.id);

  const options = [
    { id: undefined, label: 'All modes', count: total },
    ...modes,
  ];

  return (
    <nav className={styles.betMatchFilters} aria-label='Game mode'>
      {options.map((option) => {
        const isActive = option.id === active?.id;
        return (
          <Link
            key={option.id ?? 'all'}
            href={option.id ? `/feed?mode=${option.id}` : '/feed'}
            className={`${styles.nameBubble} ${styles.nameBubbleAll} ${
              styles.modeBubble
            } ${isActive ? styles.nameBubbleActive : ''}`}
            aria-current={isActive ? 'page' : undefined}
            scroll={false}
          >
            {option.label}
            <span className={styles.betMatchFilterCount}>{option.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { mode: modeParam } = await searchParams;
  const mode = findFeedMode(typeof modeParam === 'string' ? modeParam : undefined);

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
            key={mode?.id ?? 'all'}
            fallback={<p className={styles.empty}>Loading matches...</p>}
          >
            <MatchFeed mode={mode} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
