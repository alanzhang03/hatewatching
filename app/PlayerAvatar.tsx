'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export function PlayerAvatar({
  id,
  displayName,
}: {
  id: string;
  displayName: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span className={styles.avatar}>
        {displayName.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={`/pfp/${id.toLowerCase()}.png`}
      alt={displayName}
      width={32}
      height={32}
      className={styles.avatarImg}
      onError={() => setErrored(true)}
    />
  );
}
