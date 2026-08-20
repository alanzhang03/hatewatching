import type { LolAccount } from '@/lib/players';
import { opggUrl, uggUrl, porofessorUrl, deepLolUrl } from '@/lib/links';
import { CopyRiotId } from './CopyRiotId';
import styles from './page.module.css';

export function AccountRow({ account }: { account: LolAccount }) {
  return (
    <li>
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
  );
}
