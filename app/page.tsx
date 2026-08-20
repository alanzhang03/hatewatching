import styles from './page.module.css';
import { players } from '@/lib/players';
import { opggUrl, uggUrl, porofessorUrl, deepLolUrl } from '@/lib/links';
import { PlayerAvatar } from './PlayerAvatar';

export default function Home() {
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
        <div className={styles.players}>
          {players.map((player) => (
            <section key={player.id} className={styles.player}>
              <div className={styles.playerHeader}>
                <PlayerAvatar id={player.id} displayName={player.displayName} />
                <h2>{player.displayName}</h2>
              </div>
              <ul className={styles.accounts}>
                {player.accounts.map((account) => (
                  <li key={`${account.gameName}-${account.tagLine}`}>
                    <span className={styles.riotId}>
                      {account.gameName}
                      <span className={styles.tagLine}>#{account.tagLine}</span>
                    </span>
                    <span className={styles.linkGroup}>
                      <a
                        className={styles.linkChip}
                        href={opggUrl(account)}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        op.gg
                      </a>
                      <a
                        className={styles.linkChip}
                        href={uggUrl(account)}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        u.gg
                      </a>
                      <a
                        className={styles.linkChip}
                        href={deepLolUrl(account)}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        deeplol
                      </a>
                      <a
                        className={styles.linkChip}
                        href={porofessorUrl(account)}
                        target='_blank'
                        rel='noopener noreferrer'
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
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
