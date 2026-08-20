import styles from './page.module.css';
import { players } from '@/lib/players';
import { opggUrl, uggUrl, porofessorUrl, deepLolUrl } from '@/lib/links';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Accounts</h1>
        <div className={styles.players}>
          {players.map((player) => (
            <section key={player.id} className={styles.player}>
              <h2>{player.displayName}</h2>
              <ul className={styles.accounts}>
                {player.accounts.map((account) => (
                  <li key={`${account.gameName}-${account.tagLine}`}>
                    <span className={styles.riotId}>
                      {account.gameName}#{account.tagLine}
                    </span>
                    <span className={styles.linkGroup}>
                      <a
                        href={opggUrl(account)}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        op.gg
                      </a>
                      <a
                        href={uggUrl(account)}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        u.gg
                      </a>
                      <a
                        href={deepLolUrl(account)}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        deeplol
                      </a>
                      <a
                        href={porofessorUrl(account)}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        porofessor
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
