'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export function PlayerAvatar({
  id,
  displayName,
  size = 32,
}: {
  id: string;
  displayName: string;
  size?: number;
}) {
  const [errored, setErrored] = useState(false);
  const dimensions = { width: size, height: size, fontSize: size * 0.45 };

  if (errored) {
    return (
      <span className={styles.avatar} style={dimensions}>
        {displayName.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={`/pfp/${id.toLowerCase()}.png`}
      alt={displayName}
      width={size}
      height={size}
      className={styles.avatarImg}
      style={dimensions}
      onError={() => setErrored(true)}
    />
  );
}
