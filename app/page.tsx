import { players } from '@/lib/players';
import { getRanks } from '@/lib/riot';
import { HomeClient } from './HomeClient';

export default async function Home() {
  const ranks = await getRanks();
  return <HomeClient players={players} ranks={ranks} />;
}
