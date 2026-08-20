export interface LolAccount {
  gameName: string;
  tagLine: string;
}

export interface Player {
  id: string;
  displayName: string;
  accounts: LolAccount[];
}

export const players: Player[] = [
  {
    id: 'Cloudee',
    displayName: 'Cloudee',
    accounts: [
      { gameName: 'Cloudee', tagLine: '1234' },
      { gameName: 'thorwinonions', tagLine: 'NA1' },
    ],
  },
  {
    id: 'Yeungin',
    displayName: 'Yeungin',
    accounts: [
      { gameName: 'Yeungin', tagLine: 'snafu' },
      { gameName: 'The Solo Leveler', tagLine: 'tower' },
    ],
  },
  {
    id: 'Chow',
    displayName: 'Chow',
    accounts: [
      { gameName: 'pieguykai', tagLine: '4217' },
      { gameName: 'ilysomatcha', tagLine: 'pizza' },
    ],
  },
  {
    id: 'Kotee',
    displayName: 'Kotee',
    accounts: [
      { gameName: 'koopy', tagLine: 'koopy' },
      { gameName: 'koTeeFT', tagLine: 'NA1' },
      { gameName: 'piss slit', tagLine: 'koopy' },
    ],
  },
  {
    id: 'Sean',
    displayName: 'Sean',
    accounts: [
      { gameName: 'TrianglePlant', tagLine: 'NA1' },
      { gameName: 'P00CHYENA', tagLine: 'NA1' },
    ],
  },
  {
    id: 'Wandrew',
    displayName: 'Wandrew',
    accounts: [{ gameName: 'tyrese maxey', tagLine: 'pizza' }],
  },
  {
    id: 'Matt',
    displayName: 'Matt',
    accounts: [{ gameName: 'Magmacuber15', tagLine: 'NA1' }],
  },
  {
    id: 'Kiwi',
    displayName: 'Kiwi',
    accounts: [{ gameName: 'nasty宝宝', tagLine: 'freak' }],
  },

  {
    id: 'Dorkynerd',
    displayName: 'Dorkynerd',
    accounts: [{ gameName: 'ILLIT Minju', tagLine: 'ILLIT' }],
  },
  {
    id: 'Jon',
    displayName: 'Jon',
    accounts: [{ gameName: 'SavagePastaMan', tagLine: 'psvm' }],
  },
  {
    id: 'Marsh',
    displayName: 'Marsh',
    accounts: [{ gameName: 'matcha', tagLine: 'keshi' }],
  },
];
