'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import type { Player } from '@/lib/players';
import { PlayerAvatar } from './PlayerAvatar';
import { AccountRow } from './AccountRow';

const VISIBLE_COUNT = 2;

export function PlayerCard({ player }: { player: Player }) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = player.accounts.length > VISIBLE_COUNT;
  const visibleAccounts = expanded
    ? player.accounts
    : player.accounts.slice(0, VISIBLE_COUNT);

  return (
    <section className={styles.player}>
      <Link href={`/${player.id.toLowerCase()}`} className={styles.playerHeader}>
        <PlayerAvatar id={player.id} displayName={player.displayName} />
        <h2>{player.displayName}</h2>
      </Link>
      <ul className={styles.accounts}>
        {visibleAccounts.map((account) => (
          <AccountRow key={`${account.gameName}-${account.tagLine}`} account={account} />
        ))}
        {player.accounts.length === 0 && (
          <li className={styles.empty}>no accounts yet</li>
        )}
      </ul>
      {hasMore && (
        <button
          type="button"
          className={styles.readMore}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : `Show ${player.accounts.length - VISIBLE_COUNT} more`}
        </button>
      )}
    </section>
  );
}
