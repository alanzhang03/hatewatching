export const SOLOQ_BET = {
  title: 'S16 Split 3 Ranked Bet',
  startedOn: '2026-07-30',
  commissioner: 'Yeungin',
  extraGamesAllowed: 175,
  contestants: [
    {
      playerId: 'Dorkynerd',
      aka: 'Elliot',
      startGames: 91,
      mainGameName: 'ILLIT Minju',
    },
    {
      playerId: 'Matt',
      aka: 'Magmacuber',
      startGames: 55,
      mainGameName: 'Magmacuber15',
    },
    {
      playerId: 'Kiwi',
      aka: 'Kiwi',
      startGames: 271,
      mainGameName: 'nasty宝宝',
    },
  ],
  rules: [
    'Highest peak Solo rank during S16 Split 3 wins.',
    'Each player is capped at 175 games past their start count.',
    'No duoing — Solo queue only.',
    'If peak ranks tie, Solo win rate is the tiebreaker.',
    'One winner. Everyone else loses.',
    'Losers let the winner pick their Riot tag.',
    'Extra punishment TBD by birthday boy Yeungin.',
    'New joiners need commissioner Yeungin’s approval.',
    'Anyone with a GM+ peak is banned from joining.',
    'Only each player’s main account counts toward the bet.',
  ],
} as const;

export type SoloqBetContestant = (typeof SOLOQ_BET.contestants)[number];
