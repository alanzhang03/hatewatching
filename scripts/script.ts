import { fetchPlayerPuuid, getRanks } from '../lib/riot';

async function main() {
  // const puuids = await fetchPlayerPuuid();
  const ranks = await getRanks();
  console.log(ranks);
}

main();
