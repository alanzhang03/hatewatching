'use client';

import { useState } from 'react';
import styles from './page.module.css';
import type { Player } from '@/lib/players';
import { opggUrl, uggUrl, porofessorUrl, deepLolUrl } from '@/lib/links';
import { PlayerAvatar } from './PlayerAvatar';
import { CopyRiotId } from './CopyRiotId';

const VISIBLE_COUNT = 2;

export function PlayerCard({ player }: { player: Player }) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = player.accounts.length > VISIBLE_COUNT;
  const visibleAccounts = expanded
    ? player.accounts
    : player.accounts.slice(0, VISIBLE_COUNT);

  return (
    <section className={styles.player}>
      <div className={styles.playerHeader}>
        <PlayerAvatar id={player.id} displayName={player.displayName} />
        <h2>{player.displayName}</h2>
      </div>
      <ul className={styles.accounts}>
        {visibleAccounts.map((account) => (
          <li key={`${account.gameName}-${account.tagLine}`}>
            <CopyRiotId gameName={account.gameName} tagLine={account.tagLine} />
            <span className={styles.linkGroup}>
              <a
                className={styles.linkChip}
                href={opggUrl(account)}
                target="_blank"
                rel="noopener noreferrer"
              >
                op.gg
              </a>
              <a
                className={styles.linkChip}
                href={uggUrl(account)}
                target="_blank"
                rel="noopener noreferrer"
              >
                u.gg
              </a>
              <a
                className={styles.linkChip}
                href={deepLolUrl(account)}
                target="_blank"
                rel="noopener noreferrer"
              >
                deeplol
              </a>
              <a
                className={styles.linkChip}
                href={porofessorUrl(account)}
                target="_blank"
                rel="noopener noreferrer"
              >
                porofessor
              </a>
            </span>
          </li>
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
