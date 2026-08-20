'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import type { Player } from '@/lib/players';
import { PlayerAvatar } from './PlayerAvatar';
import { AccountRow } from './AccountRow';

const VISIBLE_COUNT = 2;

export function PlayerCard({
  player,
  ranks,
}: {
  player: Player;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ranks: any[];
}) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const hasMore = player.accounts.length > VISIBLE_COUNT;
  const visibleAccounts = expanded
    ? player.accounts
    : player.accounts.slice(0, VISIBLE_COUNT);

  return (
    <section
      className={styles.player}
      onClick={() => router.push(`/${player.id.toLowerCase()}`)}
    >
      <div className={styles.playerHeader}>
        <PlayerAvatar id={player.id} displayName={player.displayName} />
        <h2>{player.displayName}</h2>
      </div>
      <ul className={styles.accounts} onClick={(e) => e.stopPropagation()}>
        {visibleAccounts.map((account) => {
          const rankEntry = ranks.find((r) => r.userName === account.gameName);
          return (
            <AccountRow
              key={`${account.gameName}-${account.tagLine}`}
              account={account}
              rank={rankEntry?.rank}
            />
          );
        })}
        {player.accounts.length === 0 && (
          <li className={styles.empty}>no accounts yet</li>
        )}
      </ul>
      {hasMore && (
        <button
          type="button"
          className={styles.readMore}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
        >
          {expanded ? 'Show less' : `Show ${player.accounts.length - VISIBLE_COUNT} more`}
        </button>
      )}
    </section>
  );
}
