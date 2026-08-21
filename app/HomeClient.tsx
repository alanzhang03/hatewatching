'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';
import type { Player } from '@/lib/players';
import { PlayerCard } from './PlayerCard';

type SortMode = 'default' | 'az' | 'accounts' | 'soloRank' | 'flexRank';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bestRankScore(player: Player, ranks: any[], queueType: string) {
  let best = -1;

  for (const account of player.accounts) {
    const entry = ranks.find((r) => r.userName === account.gameName);
    const queueEntry = entry?.rank.find(
      (e: { queueType: string }) => e.queueType === queueType,
    );
    if (!queueEntry) continue;

    const tier = TIER_ORDER[queueEntry.tier as keyof typeof TIER_ORDER] ?? 0;
    const division =
      DIVISION_ORDER[queueEntry.rank as keyof typeof DIVISION_ORDER] ?? 0;
    const score = tier * 10000 + division * 1000 + queueEntry.leaguePoints;

    if (score > best) best = score;
  }

  return best;
}

export function HomeClient({
  players,
  ranks,
}: {
  players: Player[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ranks: any[];
}) {
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');

  const filteredPlayers = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = players;
    if (q) {
      result = players.filter((player) => {
        if (player.displayName.toLowerCase().includes(q)) return true;
        return player.accounts.some((account) =>
          `${account.gameName}#${account.tagLine}`.toLowerCase().includes(q),
        );
      });
    }
    if (sortMode === 'az') {
      result = [...result].sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      );
    } else if (sortMode === 'accounts') {
      result = [...result].sort(
        (a, b) => b.accounts.length - a.accounts.length,
      );
    } else if (sortMode === 'soloRank') {
      result = [...result].sort(
        (a, b) =>
          bestRankScore(b, ranks, 'RANKED_SOLO_5x5') -
          bestRankScore(a, ranks, 'RANKED_SOLO_5x5'),
      );
    } else if (sortMode === 'flexRank') {
      result = [...result].sort(
        (a, b) =>
          bestRankScore(b, ranks, 'RANKED_FLEX_SR') -
          bestRankScore(a, ranks, 'RANKED_FLEX_SR'),
      );
    }
    return result;
  }, [query, sortMode, players, ranks]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>chogwarts accounts</h1>
          <p className={styles.subtitle}>
            {players.length} players &middot;{' '}
            {players.reduce((sum, p) => sum + p.accounts.length, 0)} accounts
          </p>
        </header>

        <div className={styles.controls}>
          <div className={styles.controlsLeft}>
            <input
              type='text'
              className={styles.search}
              placeholder='Search by name/account name...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className={styles.sortSelect}
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
            >
              <option value='default'>Default order</option>
              <option value='soloRank'>Soloq rank (highest first)</option>
              <option value='flexRank'>Flexq rank (highest first)</option>
              <option value='az'>Name A–Z</option>
              <option value='accounts'># of accounts</option>
            </select>
          </div>
          <span className={styles.resultCount}>
            Showing {filteredPlayers.length} of {players.length}
          </span>
        </div>

        {filteredPlayers.length === 0 ? (
          <p className={styles.noResults}>
            No matches for &ldquo;{query}&rdquo;
          </p>
        ) : (
          <div className={styles.players}>
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} ranks={ranks} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
