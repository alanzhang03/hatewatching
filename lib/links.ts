import type { LolAccount } from './players';

function riotId(account: LolAccount) {
  return `${account.gameName}-${account.tagLine}`;
}

export function opggUrl(account: LolAccount) {
  return `https://op.gg/lol/summoners/na/${encodeURIComponent(riotId(account))}`;
}

export function uggUrl(account: LolAccount) {
  return `https://u.gg/lol/profile/na1/${encodeURIComponent(riotId(account))}/overview`;
}

export function porofessorUrl(account: LolAccount) {
  return `https://porofessor.gg/live/na/${encodeURIComponent(riotId(account))}#championsData-all-queues`;
}

export function deepLolUrl(account: LolAccount) {
  return `https://www.deeplol.gg/summoner/na/${encodeURIComponent(riotId(account))}`;
}
