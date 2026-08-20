'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';
import { players } from '@/lib/players';
import { PlayerCard } from './PlayerCard';

export default function Home() {
  const [query, setQuery] = useState('');

  const filteredPlayers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter((player) => {
      if (player.displayName.toLowerCase().includes(q)) return true;
      return player.accounts.some((account) =>
        `${account.gameName}#${account.tagLine}`.toLowerCase().includes(q),
      );
    });
  }, [query]);

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

        <input
          type="text"
          className={styles.search}
          placeholder="Search by name or Riot ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {filteredPlayers.length === 0 ? (
          <p className={styles.noResults}>No matches for &ldquo;{query}&rdquo;</p>
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
