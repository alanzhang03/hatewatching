export interface LolAccount {
  gameName: string;
  tagLine: string;
  puuid: string;
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
      {
        gameName: 'Cloudee',
        tagLine: '1234',
        puuid:
          'tAUSJmtMVWzpXz84D1Ky43SsVXspzFGGSNCpPr3UMOf9qq93PSmIxn5Ljndxl4FNj2wLRE5HowfEnA',
      },
      {
        gameName: 'thorwinonions',
        tagLine: 'NA1',
        puuid:
          '1gA8lPmebHsZ8jpSa4S3PVAbusAB_dH6tobD86xk_puvfVYgyluBE1x_MnajMO7V_LftzHyp8679TQ',
      },
    ],
  },
  {
    id: 'Yeungin',
    displayName: 'Yeungin',
    accounts: [
      {
        gameName: 'Yeungin',
        tagLine: 'snafu',
        puuid:
          'yNkHN7XxxijYAeAcCKCH_aeEj037tD3cHXB9Y72Ifr9VWdN0LReyY1iXBCfRDA_T1oqD2NK-c9rM-w',
      },
      {
        gameName: 'The Solo Leveler',
        tagLine: 'tower',
        puuid:
          'TEVA0gNnf8AvMIZRepHUSvyxja3XU1ts0x_hNoJB9TLy3aJJ4PuNeiu2-TDMuT8Fg1N33s7K1NJbuw',
      },
    ],
  },
  {
    id: 'Chow',
    displayName: 'Chow',
    accounts: [
      {
        gameName: 'pieguykai',
        tagLine: '4217',
        puuid:
          'udxNtrgLUC5RJFetGT9GAxbr5A7ZWuc3KD5Nq3egL0MEYyaTyn_-SVIFzJHAycQNCbbJIr-K1ARSgA',
      },
      {
        gameName: 'ilysomatcha',
        tagLine: 'pizza',
        puuid:
          'HXqgbKsoNe3LxfNRearlcfzOwpUBbE2v-KTCNcwMe3VT4D6calprNDl-N4WzD9ziv0vOcUZFK2IVKw',
      },
    ],
  },
  {
    id: 'Kotee',
    displayName: 'Kotee',
    accounts: [
      {
        gameName: 'koopy',
        tagLine: 'koopy',
        puuid:
          'LneieauqsaYosym4Icybd9Skn24gQup2_kY0ZKn2Oknn5tCZhQZu0xkvbMTQ90_5NQoWHlaNvPGxvg',
      },
      {
        gameName: 'koTeeFT',
        tagLine: 'NA1',
        puuid:
          'K1r9-2bleSo6onh0qLzZgmQI7c837acuGKbVaCKzpEqEj02rTMYHAQGXpRMWvgcDrBb3mIFDDDQBCg',
      },
      {
        gameName: 'piss slit',
        tagLine: 'koopy',
        puuid:
          'ko3Xj_V0evoGBQsJoJKrK3lHLSuAnweR2i8ybOD5QrOtCjseUeGN7JistIOs5qer_ugxivtlVbmCPw',
      },
    ],
  },
  {
    id: 'Sean',
    displayName: 'Sean',
    accounts: [
      {
        gameName: 'TrianglePlant',
        tagLine: 'NA1',
        puuid:
          'mk6C83RwJUfHKumcwvwmI7PLcbKUYiwxaFFlqXEb1n5k4Bcy9GRHy_Iry5hHEtepcbtu5zqKDknQLQ',
      },
      {
        gameName: 'P00CHYENA',
        tagLine: 'NA1',
        puuid:
          'bcmCnr6Zj17I6pUSOe6Gk9ch7okajzZAjJ77PC25rqrkKYY9Q4PbhRFOHARSX-dt_FOKTds5gpruKg',
      },
    ],
  },
  {
    id: 'Wandrew',
    displayName: 'Wandrew',
    accounts: [
      {
        gameName: 'tyrese maxey',
        tagLine: 'pizza',
        puuid:
          '7GD0hq8bTgdvCbCs4RWrFVbBQ6hWBbYoIji79oQ-KpVXEcoG11XX5KNPiL1T2m6qbxa4uBHIZRSrKg',
      },
    ],
  },
  {
    id: 'Matt',
    displayName: 'Matt',
    accounts: [
      {
        gameName: 'Magmacuber15',
        tagLine: 'NA1',
        puuid:
          'XlEGwI7BcobACwWziizIZKKjwalhbsltWH5biSFkUu4XbGNbmb1KD_nD7LJZJU--sFU0ZgKIBFmHHg',
      },
    ],
  },
  {
    id: 'Kiwi',
    displayName: 'Kiwi',
    accounts: [
      {
        gameName: 'nasty宝宝',
        tagLine: 'freak',
        puuid:
          'WdN0X0BeUOWZ9M-VQU1NFgqGqVThi_PZCAqqfv0z8run3IJ2IX6fzp0s0XF1QzrAqR0tgxNqnx4paQ',
      },
    ],
  },

  {
    id: 'Dorkynerd',
    displayName: 'Dorkynerd',
    accounts: [
      {
        gameName: 'ILLIT Minju',
        tagLine: 'ILLIT',
        puuid:
          'nOv5IlgFTZSwSQM87XvJmmjcydU4ghJWWM2oAbgaAYHSJx3cW4895qnVhXoY8Qouv5CLSJP8hbEQYA',
      },
    ],
  },
  {
    id: 'Jon',
    displayName: 'Jon',
    accounts: [
      {
        gameName: 'SavagePastaMan',
        tagLine: 'psvm',
        puuid:
          'vuYOU6KqplCynhyAeZ_tSmxn3K8BeCW5cDFe4eN6eRPWbSya-X77aSFAYkOVRTmAYKH-cJj_c45lXg',
      },
    ],
  },
  {
    id: 'Marsh',
    displayName: 'Marsh',
    accounts: [
      {
        gameName: 'matcha',
        tagLine: 'keshi',
        puuid:
          'mxihkpBtHIPnysHK40R09ZYrxBo7EW5HjoyN8iYT_oqaVjblKUfTX2ErBKFKN9itfe6QBZV8CpM4hQ',
      },
    ],
  },
  {
    id: 'Tean',
    displayName: 'Tean',
    accounts: [
      {
        gameName: 'CodeMint',
        tagLine: 'NA1',
        puuid:
          'NYI22wJWibkVUvGGSCQyxLKWVmwBKGEUIesMsF9emKxcqP9y9qSGjKdyJnwffXNqFIkmGVWWrLh8HA',
      },
      {
        gameName: 'Crippled Chimp',
        tagLine: 'NA1',
        puuid:
          'Ruuh0_iP6G1qa9qFlPUS7oZVavuM6OGNa5FaIkQi6u8KLEp5F9Z2kaXQDZHQNQiGxYIyMFNRWdo1kw',
      },
    ],
  },
];
