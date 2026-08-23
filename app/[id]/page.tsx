import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { players } from '@/lib/players';
import { getSummonerIcons } from '@/lib/riot';
import { PlayerAvatar } from '../PlayerAvatar';
import { AccountRow } from '../AccountRow';
import { CopyLinkButton } from '../CopyLinkButton';
import { MatchHistory } from './MatchHistory';
import styles from '../page.module.css';

function findPlayer(id: string) {
  return players.find((player) => player.id.toLowerCase() === id.toLowerCase());
}

export function generateStaticParams() {
  return players.map((player) => ({ id: player.id.toLowerCase() }));
}

export async function generateMetadata(props: PageProps<'/[id]'>) {
  const { id } = await props.params;
  const player = findPlayer(id);
  return { title: player ? `${player.displayName} · chogwarts accounts` : 'Not found' };
}

export default async function PlayerPage(props: PageProps<'/[id]'>) {
  const { id } = await props.params;
  const player = findPlayer(id);

  if (!player) notFound();

  const icons = await getSummonerIcons(player.accounts);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          &larr; All accounts
        </Link>

        <div className={styles.profileHeader}>
          <PlayerAvatar id={player.id} displayName={player.displayName} size={64} />
          <div>
            <h1 className={styles.profileName}>{player.displayName}</h1>
            <p className={styles.subtitle}>
              {player.accounts.length} account
              {player.accounts.length === 1 ? '' : 's'}
            </p>
          </div>
          <CopyLinkButton />
        </div>

        <ul className={styles.accounts}>
          {player.accounts.map((account) => {
            const iconEntry = icons.find((i) => i.userName === account.gameName);
            return (
              <AccountRow
                key={`${account.gameName}-${account.tagLine}`}
                account={account}
                iconUrl={iconEntry?.iconUrl}
              />
            );
          })}
          {player.accounts.length === 0 && (
            <li className={styles.empty}>no accounts yet</li>
          )}
        </ul>

        <h2 className={styles.sectionHeading}>Recent Matches</h2>
        <Suspense fallback={<p className={styles.empty}>Loading matches...</p>}>
          <MatchHistory accounts={player.accounts} icons={icons} />
        </Suspense>
      </main>
    </div>
  );
}
