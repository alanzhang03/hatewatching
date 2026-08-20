'use client';

import { useState } from 'react';
import styles from './page.module.css';

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={styles.copyLinkButton}
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  );
}
