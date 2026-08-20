import { fetchPlayerPuuid } from '../lib/riot';

async function main() {
  const results = await fetchPlayerPuuid();
  console.log(results);
}

main();
