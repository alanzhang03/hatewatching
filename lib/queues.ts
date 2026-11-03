export const QUEUE_LABELS: Record<number, string> = {
  420: 'Ranked Solo',
  440: 'Ranked Flex',
  710: 'Ranked 5s',
  400: 'Normal Draft',
  430: 'Normal Blind',
  480: 'Swiftplay',
  490: 'Quickplay',
  450: 'ARAM',
  900: 'ARURF',
  1900: 'URF',
  1700: 'Arena',
  1710: 'Arena',
  1750: 'Arena',
  870: 'Co-op vs AI',
  880: 'Co-op vs AI',
  890: 'Co-op vs AI',
};

export const FEED_MODES = [
  { id: 'solo', label: 'Ranked Solo', queueIds: [420] },
  { id: 'flex', label: 'Ranked Flex', queueIds: [440] },
  { id: '5s', label: 'Ranked 5s', queueIds: [710] },
  { id: 'normal', label: 'Normals', queueIds: [400, 430, 480, 490] },
  { id: 'aram', label: 'ARAM', queueIds: [450] },
  { id: 'arena', label: 'Arena', queueIds: [1700, 1710, 1750] },
  { id: 'urf', label: 'URF', queueIds: [900, 1900] },
  { id: 'bots', label: 'Co-op vs AI', queueIds: [870, 880, 890] },
] as const;

export type FeedMode = (typeof FEED_MODES)[number];

export function findFeedMode(id: string | undefined): FeedMode | undefined {
  return FEED_MODES.find((mode) => mode.id === id);
}
