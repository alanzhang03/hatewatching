'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlayerAvatar } from '../PlayerAvatar';
import type {
  BetMatchParticipant,
  BetMatchRowData,
  BetMatchTeam,
} from './matchUtils';
import styles from '../page.module.css';

function formatNumber(n: number) {
  return n.toLocaleString('en-US');
}

function ItemStrip({
  urls,
  matchId,
  puuid,
}: {
  urls: string[];
  matchId: string;
  puuid: string;
}) {
  return (
    <div className={styles.scoreboardItems}>
      {urls.map((url, index) =>
        url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${matchId}-${puuid}-item-${index}`}
            src={url}
            alt=''
            width={22}
            height={22}
            className={styles.betMatchItemIcon}
          />
        ) : (
          <span
            key={`${matchId}-${puuid}-item-${index}`}
            className={styles.scoreboardItemEmpty}
          />
        ),
      )}
    </div>
  );
}

function ParticipantRow({
  participant,
  maxDamage,
  matchId,
}: {
  participant: BetMatchParticipant;
  maxDamage: number;
  matchId: string;
}) {
  const damagePct = Math.max(
    4,
    Math.round((participant.damageDealt / maxDamage) * 100),
  );

  return (
    <div
      className={`${styles.scoreboardPlayer} ${
        participant.isFocus ? styles.scoreboardPlayerFocus : ''
      }`}
    >
      <div className={styles.scoreboardChampBlock}>
        <div className={styles.scoreboardChampWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={participant.championIconUrl}
            alt={participant.championName}
            width={28}
            height={28}
            className={styles.scoreboardChampIcon}
          />
          <span className={styles.scoreboardLevel}>{participant.champLevel}</span>
        </div>
        <div className={styles.betMatchSpells}>
          {participant.spell1Url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={participant.spell1Url} alt='' width={14} height={14} />
          )}
          {participant.spell2Url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={participant.spell2Url} alt='' width={14} height={14} />
          )}
        </div>
      </div>

      <div className={styles.scoreboardIdentity}>
        <a
          href={participant.opggHref}
          target='_blank'
          rel='noopener noreferrer'
          className={styles.scoreboardName}
        >
          {participant.gameName}
        </a>
        <span className={styles.scoreboardRole}>{participant.role}</span>
      </div>

      <div className={styles.scoreboardKda}>
        <span>
          {participant.kills}/{participant.deaths}/{participant.assists}
        </span>
        <span className={styles.scoreboardKdaRatio}>{participant.kda}:1</span>
      </div>

      <div className={styles.scoreboardDamage}>
        <div className={styles.scoreboardDamageTrack}>
          <div
            className={styles.scoreboardDamageFill}
            style={{ width: `${damagePct}%` }}
          />
        </div>
        <span className={styles.scoreboardDamageValue}>
          {formatNumber(participant.damageDealt)}
        </span>
      </div>

      <span className={styles.scoreboardCs}>{participant.cs} CS</span>

      <ItemStrip
        urls={participant.itemIconUrls}
        matchId={matchId}
        puuid={participant.puuid}
      />
    </div>
  );
}

function TeamBlock({
  team,
  maxDamage,
  matchId,
}: {
  team: BetMatchTeam;
  maxDamage: number;
  matchId: string;
}) {
  return (
    <div
      className={`${styles.scoreboardTeam} ${
        team.win ? styles.scoreboardTeamWin : styles.scoreboardTeamLoss
      }`}
    >
      <div className={styles.scoreboardTeamHeader}>
        <span
          className={
            team.win
              ? styles.scoreboardTeamResultWin
              : styles.scoreboardTeamResultLoss
          }
        >
          {team.win ? 'Victory' : 'Defeat'}
          {team.isAlly ? ' · Your team' : ' · Enemy'}
        </span>
        <span className={styles.scoreboardTeamMeta}>
          {team.kills} kills · {team.towers} towers · {team.dragons} dragons ·{' '}
          {team.barons} barons
        </span>
      </div>
      <div className={styles.scoreboardPlayers}>
        {team.participants.map((participant) => (
          <ParticipantRow
            key={participant.puuid}
            participant={participant}
            maxDamage={maxDamage}
            matchId={matchId}
          />
        ))}
      </div>
    </div>
  );
}

export function BetMatchList({ matches }: { matches: BetMatchRowData[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className={styles.betMatchList}>
      {matches.map((match) => {
        const open = openId === match.matchId;
        return (
          <li
            key={match.matchId}
            className={`${styles.betMatchItem} ${
              match.win ? styles.matchRowWin : styles.matchRowLoss
            }`}
          >
            <button
              type='button'
              className={styles.betMatchSummary}
              aria-expanded={open}
              onClick={() =>
                setOpenId((current) =>
                  current === match.matchId ? null : match.matchId,
                )
              }
            >
              <div className={styles.betMatchWho}>
                <div className={styles.betMatchProfileGroup}>
                  <div
                    className={`${styles.betMatchAvatarStack} ${
                      match.summaryPlayers.length > 1
                        ? styles.betMatchAvatarStackMulti
                        : ''
                    }`}
                  >
                    {match.summaryPlayers.map((summaryPlayer) => (
                      <Link
                        key={`${match.matchId}-${summaryPlayer.playerId}`}
                        href={summaryPlayer.profileHref}
                        className={styles.betMatchAvatarLink}
                        onClick={(e) => e.stopPropagation()}
                        title={summaryPlayer.playerName}
                      >
                        <PlayerAvatar
                          id={summaryPlayer.playerId}
                          displayName={summaryPlayer.playerName}
                          size={28}
                        />
                      </Link>
                    ))}
                  </div>
                  <div className={styles.betMatchNames}>
                    {match.summaryPlayers.map((summaryPlayer, index) => (
                      <span key={`${match.matchId}-name-${summaryPlayer.playerId}`}>
                        {index > 0 && (
                          <span className={styles.betMatchNameSep}> + </span>
                        )}
                        <Link
                          href={summaryPlayer.profileHref}
                          className={styles.betMatchPlayer}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {summaryPlayer.playerName}
                        </Link>
                      </span>
                    ))}
                  </div>
                </div>
                {match.summaryPlayers.length === 1 && (
                  <a
                    className={styles.betMatchAccount}
                    href={match.accountHref}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={(e) => e.stopPropagation()}
                  >
                    {match.iconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={match.iconUrl}
                        alt=''
                        className={styles.summonerIcon}
                        width={14}
                        height={14}
                      />
                    )}
                    {match.accountName}
                  </a>
                )}
              </div>

              <span
                className={
                  match.win ? styles.matchResultWin : styles.matchResultLoss
                }
              >
                {match.win ? 'W' : 'L'}
              </span>

              <span className={styles.betMatchChampCell}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={match.championIconUrl}
                  alt=''
                  width={22}
                  height={22}
                  className={styles.betMatchChampIcon}
                />
                <span className={styles.matchChampion}>{match.championName}</span>
              </span>

              <span className={styles.betMatchKda}>
                <span className={styles.matchKda}>
                  {match.kills}/{match.deaths}/{match.assists}
                </span>
                <span className={styles.betMatchKdaRatio}>{match.kda} KDA</span>
              </span>

              <span className={styles.betMatchSummaryMeta}>
                <span className={styles.matchMeta}>
                  {match.duration} · {match.timeAgo}
                </span>
                <span
                  className={`${styles.betMatchChevron} ${
                    open ? styles.betMatchChevronOpen : ''
                  }`}
                  aria-hidden
                >
                  ▾
                </span>
              </span>
            </button>

            {open && (
              <div className={styles.betMatchDetails}>
                <div className={styles.betMatchDetailGrid}>
                  <div>
                    <span className={styles.betStatLabel}>Role</span>
                    <span className={styles.betMatchDetailValue}>
                      {match.role} · Lv {match.champLevel}
                    </span>
                  </div>
                  <div>
                    <span className={styles.betStatLabel}>CS</span>
                    <span className={styles.betMatchDetailValue}>
                      {match.cs}
                      <span className={styles.betStatCap}>
                        {' '}
                        ({match.csPerMin}/m)
                      </span>
                    </span>
                  </div>
                  <div>
                    <span className={styles.betStatLabel}>Gold</span>
                    <span className={styles.betMatchDetailValue}>
                      {formatNumber(match.gold)}
                    </span>
                  </div>
                  <div>
                    <span className={styles.betStatLabel}>Damage</span>
                    <span className={styles.betMatchDetailValue}>
                      {formatNumber(match.damageDealt)}
                    </span>
                  </div>
                  <div>
                    <span className={styles.betStatLabel}>Vision</span>
                    <span className={styles.betMatchDetailValue}>
                      {match.visionScore}
                      <span className={styles.betStatCap}>
                        {' '}
                        · {match.wardsPlaced} wards
                      </span>
                    </span>
                  </div>
                  <div>
                    <span className={styles.betStatLabel}>KP</span>
                    <span className={styles.betMatchDetailValue}>
                      {match.killParticipation}
                    </span>
                  </div>
                </div>

                <div className={styles.scoreboard}>
                  {match.teams.map((team) => (
                    <TeamBlock
                      key={`${match.matchId}-${team.teamId}`}
                      team={team}
                      maxDamage={match.maxDamage}
                      matchId={match.matchId}
                    />
                  ))}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
