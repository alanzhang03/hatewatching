import { Suspense } from 'react';
import { players } from '@/lib/players';
import { getRanksForAccounts, getSummonerIcons } from '@/lib/riot';
import { SOLOQ_BET } from '@/lib/soloq-bet';
import { SiteNav } from '../SiteNav';
import { ContestantCard, soloRankScore } from './ContestantCard';
import { BetMatchFeed } from './BetMatchFeed';
import styles from '../page.module.css';

export const metadata = {
  title: 'Soloq Bet · chogwarts accounts',
  description: 'S16 Split 3 ranked bet standings and rules',
};

function formatStartDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function SoloqBetPage() {
  const contestants = SOLOQ_BET.contestants
    .map((entry) => {
      const player = players.find((p) => p.id === entry.playerId);
      if (!player) return null;
      const mainAccount = player.accounts.find(
        (account) => account.gameName === entry.mainGameName,
      );
      if (!mainAccount) return null;
      return {
        ...entry,
        player: {
          ...player,
          accounts: [mainAccount],
        },
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const accounts = contestants.flatMap((c) => c.player.accounts);
  const [ranks, icons] = await Promise.all([
    getRanksForAccounts(accounts),
    getSummonerIcons(accounts),
  ]);

  const standings = [...contestants].sort(
    (a, b) => soloRankScore(b.player, ranks) - soloRankScore(a.player, ranks),
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SiteNav />

        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{SOLOQ_BET.title}</h1>
            <p className={styles.subtitle}>
              Started {formatStartDate(SOLOQ_BET.startedOn)} · commissioner{' '}
              {SOLOQ_BET.commissioner} · peak Solo rank wins
            </p>
          </div>
        </header>

        <section className={styles.betSection}>
          <h2 className={styles.sectionHeading}>Live standings</h2>
          <p className={styles.betSectionNote}>
            Sorted by current Solo rank (Riot doesn’t expose split peak — peak
            is still the official win condition). Win rate is the tiebreaker.
          </p>
          <div className={styles.betGrid}>
            {standings.map((entry, index) => (
              <ContestantCard
                key={entry.playerId}
                player={entry.player}
                aka={entry.aka}
                startGames={entry.startGames}
                extraGamesAllowed={SOLOQ_BET.extraGamesAllowed}
                place={index + 1}
                ranks={ranks}
                icons={icons}
              />
            ))}
          </div>
        </section>

        <section className={styles.betSection}>
          <h2 className={styles.sectionHeading}>Ranked solo · last 7 days</h2>
          <p className={styles.betSectionNote}>
            Tap a match for full scoreboard, plus your CS,
            gold, damage, and vision.
          </p>
          <Suspense
            fallback={<p className={styles.empty}>Loading matches...</p>}
          >
            <BetMatchFeed
              contestants={contestants.map((c) => c.player)}
              icons={icons}
            />
          </Suspense>
        </section>

        <section className={styles.betSection}>
          <h2 className={styles.sectionHeading}>Rules</h2>
          <ol className={styles.betRules}>
            {SOLOQ_BET.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
          <p className={styles.betSectionNote}>
            Game caps:{' '}
            {SOLOQ_BET.contestants
              .map(
                (c) => `${c.aka} ${c.startGames + SOLOQ_BET.extraGamesAllowed}`,
              )
              .join(' · ')}{' '}
            (start + {SOLOQ_BET.extraGamesAllowed}).
          </p>
        </section>
      </main>
    </div>
  );
}
