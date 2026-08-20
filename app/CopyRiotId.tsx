'use client';

import { useState } from 'react';
import styles from './page.module.css';

export function CopyRiotId({
  gameName,
  tagLine,
}: {
  gameName: string;
  tagLine: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={styles.riotId}
      title="Copy Riot ID"
      onClick={async () => {
        await navigator.clipboard.writeText(`${gameName}#${tagLine}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? (
        'copied!'
      ) : (
        <>
          {gameName}
          <span className={styles.tagLine}>#{tagLine}</span>
        </>
      )}
    </button>
  );
}
