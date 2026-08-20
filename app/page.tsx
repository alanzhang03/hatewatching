'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';
import { players } from '@/lib/players';
import { PlayerCard } from './PlayerCard';

type SortMode = 'default' | 'az' | 'accounts';

export default function Home() {
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
      result = [...result].sort((a, b) => a.displayName.localeCompare(b.displayName));
    } else if (sortMode === 'accounts') {
      result = [...result].sort((a, b) => b.accounts.length - a.accounts.length);
    }
    return result;
  }, [query, sortMode]);

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
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
