import { players } from '@/lib/players';
import { getRanks, getSummonerIcons } from '@/lib/riot';
import { HomeClient } from './HomeClient';

export default async function Home() {
  const [ranks, icons] = await Promise.all([getRanks(), getSummonerIcons()]);
  return <HomeClient players={players} ranks={ranks} icons={icons} />;
}
