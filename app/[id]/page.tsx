import Link from 'next/link';
import { notFound } from 'next/navigation';
import { players } from '@/lib/players';
import { PlayerAvatar } from '../PlayerAvatar';
import { AccountRow } from '../AccountRow';
import { CopyLinkButton } from '../CopyLinkButton';
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
          {player.accounts.map((account) => (
            <AccountRow key={`${account.gameName}-${account.tagLine}`} account={account} />
          ))}
          {player.accounts.length === 0 && (
            <li className={styles.empty}>no accounts yet</li>
          )}
        </ul>
      </main>
    </div>
  );
}
