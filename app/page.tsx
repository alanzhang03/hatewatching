import { players } from '@/lib/players';
import { getRanks, getSummonerIcons } from '@/lib/riot';
import { HomeClient } from './HomeClient';

export default async function Home() {
  const allAccounts = players.flatMap((player) => player.accounts);
  const [ranks, icons] = await Promise.all([
    getRanks(),
    getSummonerIcons(allAccounts),
  ]);
  return <HomeClient players={players} ranks={ranks} icons={icons} />;
}
