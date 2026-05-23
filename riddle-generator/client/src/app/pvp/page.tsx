"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords, Users, Trophy, Clock, CheckCircle2, XCircle,
  Loader2, Target, Plus, LogIn, Zap, Calendar,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePvpLobby } from '@/hooks/pvp/usePvpLobby';
import { usePvpHistory } from '@/hooks/pvp/usePvpHistory';
import { useCommunityChallenge, useSubmitChallenge, useChallengeHistory } from '@/hooks/challenges/useCommunityChallenge';
import { useAppSelector } from '@/store/hooks';
import { useGlobalToast } from '@/providers/ToastProvider';
import { Button } from '@/components/atoms/Button/Button';
import { Badge, BadgeVariant } from '@/components/atoms/Badge/Badge';
import { PvpMatch, PendingRoom, ChallengeTopSolver, SolvedChallengeRecord } from '@/types/pvp';
import styles from './Pvp.module.scss';
import { cn } from '@/lib/utils';

type Tab = 'lobby' | 'challenge' | 'logs';
type LogTab = 'duels' | 'puzzles';

function riddleTypeToVariant(type?: string): BadgeVariant {
  switch (type?.toUpperCase()) {
    case 'MATH': return 'warning';
    case 'LOGIC': return 'info';
    case 'DANETKI': return 'success';
    default: return 'default';
  }
}

// ─── Countdown Timer ──────────────────────────────────────────

function computeCountdown(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function LiveCountdown({ endsAt }: { endsAt: string }) {
  const [label, setLabel] = useState(() => computeCountdown(endsAt));
  const [urgent, setUrgent] = useState(() => new Date(endsAt).getTime() - Date.now() < 3_600_000);

  useEffect(() => {
    const id = setInterval(() => {
      const diff = new Date(endsAt).getTime() - Date.now();
      setLabel(computeCountdown(endsAt));
      setUrgent(diff < 3_600_000);
    }, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return (
    <span className={cn(styles.metaItem, styles.countdown, urgent && styles.countdownUrgent)}>
      <Clock size={13} />
      {label}
    </span>
  );
}

// ─── Speedrunner Stack ────────────────────────────────────────

function SpeedrunnerAvatar({ solver, index }: { solver: ChallengeTopSolver; index: number }) {
  const label = `#${index + 1} ${solver.user.name ?? 'Anonymous'}`;
  return (
    <Link href={`/profile/${solver.user.id}`} className={styles.speedrunnerItem} title={label}>
      {solver.user.avatar_url ? (
        <Image
          src={solver.user.avatar_url}
          alt={solver.user.name ?? 'Solver'}
          width={28}
          height={28}
          className={styles.speedrunnerImg}
          unoptimized
        />
      ) : (
        <div className={styles.speedrunnerFallback}>
          {(solver.user.name || '?').charAt(0).toUpperCase()}
        </div>
      )}
    </Link>
  );
}

function SpeedrunnerStack({ solvers, total }: { solvers: ChallengeTopSolver[]; total: number }) {
  if (solvers.length === 0) {
    return <span className={styles.noSolversYet}>Be the first to crack it!</span>;
  }
  return (
    <div className={styles.speedrunnerStack}>
      {solvers.map((s, i) => (
        <SpeedrunnerAvatar key={s.id} solver={s} index={i} />
      ))}
      {total > solvers.length && (
        <span className={styles.speedrunnerMore}>+{total - solvers.length}</span>
      )}
    </div>
  );
}

// ─── Player Avatar ────────────────────────────────────────────

function PlayerAvatar({
  name,
  avatarUrl,
  size = 32,
}: {
  name: string | null;
  avatarUrl: string | null;
  size?: number;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name ?? 'Player'}
        width={size}
        height={size}
        className={styles.playerAvatar}
        unoptimized
      />
    );
  }
  return (
    <div className={styles.playerAvatarFallback} style={{ width: size, height: size }}>
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );
}

// ─── Pending Room Card ─────────────────────────────────────────

function PendingRoomCard({
  room,
  onJoin,
  disabled,
}: {
  room: PendingRoom;
  onJoin: () => void;
  disabled: boolean;
}) {
  return (
    <motion.div
      className={styles.roomCard}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.roomCardLeft}>
        <Link href={`/profile/${room.creator.id}`} className={styles.creatorLink}>
          <PlayerAvatar name={room.creator.name} avatarUrl={room.creator.avatar_url} />
          <div>
            <p className={styles.roomCreatorName}>{room.creator.name ?? 'Anonymous'}</p>
            <p className={styles.roomCreatorLevel}>Level {room.creator.level}</p>
          </div>
        </Link>
      </div>
      <Button variant="colored-glass" size="auto" onClick={onJoin} disabled={disabled}>
        <LogIn size={14} />
        Join
      </Button>
    </motion.div>
  );
}

// ─── Active Match Panel ────────────────────────────────────────

function ActiveMatchPanel({
  match,
  currentUserId,
  onSubmit,
  guessResult,
  onReset,
}: {
  match: PvpMatch;
  currentUserId: string;
  onSubmit: (guess: string) => Promise<void>;
  guessResult: { correct: boolean; winnerId?: string; xpEarned?: number } | null;
  onReset: () => void;
}) {
  const [guess, setGuess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isFinished = match.status === 'FINISHED' || match.status === 'CANCELLED';
  const iWon = match.winner?.id === currentUserId;
  const opponent = match.creator.id === currentUserId ? match.opponent : match.creator;

  const handleSubmit = async () => {
    if (!guess.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit(guess);
    setSubmitting(false);
    setGuess('');
  };

  return (
    <div className={styles.matchPanel}>
      <div className={styles.matchPlayers}>
        <div className={styles.matchPlayer}>
          <Link href={`/profile/${match.creator.id}`} className={styles.matchPlayerLink}>
            <PlayerAvatar name={match.creator.name} avatarUrl={match.creator.avatar_url} />
            <span className={styles.matchPlayerName}>{match.creator.name ?? 'You'}</span>
          </Link>
        </div>
        <span className={styles.vsLabel}>VS</span>
        <div className={styles.matchPlayer}>
          {match.opponent ? (
            <Link href={`/profile/${match.opponent.id}`} className={styles.matchPlayerLink}>
              <PlayerAvatar name={match.opponent.name} avatarUrl={match.opponent.avatar_url} />
              <span className={styles.matchPlayerName}>{match.opponent.name ?? 'Opponent'}</span>
            </Link>
          ) : (
            <span className={styles.waitingLabel}>
              <Loader2 size={16} className={styles.spin} />
              Waiting for opponent…
            </span>
          )}
        </div>
      </div>

      {match.riddle && !isFinished && (
        <div className={styles.riddleBox}>
          {match.riddle.image_url && (
            <Image
              src={match.riddle.image_url}
              alt="Riddle"
              width={320}
              height={200}
              className={styles.riddleImage}
              unoptimized
            />
          )}
          <p className={styles.riddleContent}>{match.riddle.content}</p>
          <div className={styles.guessRow}>
            <input
              className={styles.guessInput}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleSubmit()}
              placeholder="Your answer…"
              disabled={submitting}
            />
            <Button
              variant="colored-glass"
              size="auto"
              onClick={() => void handleSubmit()}
              disabled={submitting || !guess.trim()}
            >
              {submitting ? <Loader2 size={14} className={styles.spin} /> : <Target size={14} />}
              Submit
            </Button>
          </div>
        </div>
      )}

      {isFinished && (
        <motion.div
          className={cn(styles.resultBanner, iWon ? styles.resultWin : styles.resultLoss)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {iWon ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
          <div>
            <p className={styles.resultTitle}>{iWon ? 'Victory!' : 'Defeated'}</p>
            {iWon && guessResult?.xpEarned ? (
              <p className={styles.resultXp}>+{guessResult.xpEarned} XP</p>
            ) : null}
            {!iWon && opponent?.name && (
              <p className={styles.resultSub}>{opponent.name} answered first</p>
            )}
          </div>
          <Button variant="grey-glass-link" size="auto" onClick={onReset}>
            Back to Lobby
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Challenge Panel ──────────────────────────────────────────

function ChallengePanel() {
  const { data: challenge, isLoading } = useCommunityChallenge();
  const submitMutation = useSubmitChallenge();
  const { showGlobalToast } = useGlobalToast();
  const [guess, setGuess] = useState('');

  const handleSubmit = async () => {
    if (!challenge || !guess.trim()) return;
    const result = await submitMutation
      .mutateAsync({ challengeId: challenge.id, guess })
      .catch(() => null);
    if (!result) return;
    if (result.correct) {
      showGlobalToast(`Correct! +${result.xpEarned} XP`, 'success');
      setGuess('');
    } else {
      showGlobalToast('Incorrect answer. Try again!', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.challengeSkeleton}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={styles.skeletonLine} />
        ))}
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className={styles.emptyState}>
        <Trophy size={32} className={styles.emptyIcon} />
        <p>No active challenge this week. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className={styles.challengeCard}>
      <div className={styles.challengeHeader}>
        <div>
          <div className={styles.challengeTitleRow}>
            <h3 className={styles.challengeTitle}>{challenge.title}</h3>
            {challenge.riddle_type && (
              <Badge variant="pink" glow className={styles.riddleTypeBadge}>
                {challenge.riddle_type}
              </Badge>
            )}
          </div>
          <p className={styles.challengeDesc}>{challenge.description}</p>
        </div>
        <span className={styles.xpBadge}>+{challenge.xp_reward} XP</span>
      </div>

      <div className={styles.challengeMeta}>
        <span className={styles.metaItem}>
          <Users size={13} />
          {challenge.solver_count} solvers
        </span>
        <LiveCountdown endsAt={challenge.ends_at} />
      </div>

      {challenge.top_solvers !== undefined && (
        <div className={styles.speedrunnerSection}>
          <p className={styles.speedrunnerLabel}>
            <Zap size={12} />
            Top speedrunners
          </p>
          <SpeedrunnerStack solvers={challenge.top_solvers} total={challenge.solver_count} />
        </div>
      )}

      <div className={styles.riddleBox}>
        <p className={styles.riddleContent}>{challenge.riddle_content}</p>
      </div>

      {challenge.already_solved ? (
        <div className={styles.solvedBanner}>
          <CheckCircle2 size={18} />
          You have solved this challenge!
        </div>
      ) : (
        <div className={styles.guessRow}>
          <input
            className={styles.guessInput}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleSubmit()}
            placeholder="Your answer…"
            disabled={submitMutation.isPending}
          />
          <Button
            variant="colored-glass"
            size="auto"
            onClick={() => void handleSubmit()}
            disabled={submitMutation.isPending || !guess.trim()}
          >
            {submitMutation.isPending ? (
              <Loader2 size={14} className={styles.spin} />
            ) : (
              <Target size={14} />
            )}
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Duels Log ────────────────────────────────────────────────

function DuelsLog({ matches, userId }: { matches: PvpMatch[]; userId: string }) {
  if (matches.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Swords size={32} className={styles.emptyIcon} />
        <p className={styles.emptyMsg}>No duels yet. Step into the arena!</p>
      </div>
    );
  }

  return (
    <div className={styles.historyList}>
      {matches.map((m) => {
        const iWon = m.winner?.id === userId;
        const isFinished = m.status === 'FINISHED';
        const opponent = m.creator.id === userId ? m.opponent : m.creator;
        const timestamp = m.finished_at ?? m.created_at;

        return (
          <div
            key={m.id}
            className={cn(
              styles.historyRow,
              isFinished && (iWon ? styles.historyWin : styles.historyLoss),
            )}
          >
            <span
              className={cn(
                styles.historyBadge,
                isFinished
                  ? iWon
                    ? styles.badgeWin
                    : styles.badgeLoss
                  : styles.badgeCancelled,
              )}
            >
              {!isFinished ? 'Cancelled' : iWon ? 'Victory' : 'Defeat'}
            </span>

            {m.riddle?.type && (
              <Badge variant={riddleTypeToVariant(m.riddle.type)} className={styles.riddleTypeBadge}>
                {m.riddle.type}
              </Badge>
            )}

            <div className={styles.historyOpponent}>
              {opponent ? (
                <Link href={`/profile/${opponent.id}`} className={styles.opponentLink}>
                  <PlayerAvatar name={opponent.name} avatarUrl={opponent.avatar_url} size={24} />
                  <span>{opponent.name ?? 'Anonymous'}</span>
                </Link>
              ) : (
                <span className={styles.opponentUnknown}>No opponent</span>
              )}
            </div>

            <div className={styles.historyMeta}>
              {isFinished && iWon && <span className={styles.historyXp}>+100 XP</span>}
              {m.riddle && (
                <Link href={`/riddle/${m.riddle.id}`} className={styles.peekRiddle}>
                  Peek Riddle
                </Link>
              )}
              <span className={styles.historyDate}>
                {new Date(timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Puzzles Log ──────────────────────────────────────────────

function PuzzlesLog({ records }: { records: SolvedChallengeRecord[] }) {
  if (records.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Trophy size={32} className={styles.emptyIcon} />
        <p className={styles.emptyMsg}>No weekly challenges solved yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.historyList}>
      {records.map((r) => (
        <div key={r.id} className={styles.puzzleRow}>
          <span className={styles.puzzleRank}>#{r.rank}</span>
          <div className={styles.puzzleInfo}>
            <span className={styles.puzzleTitle}>{r.challenge.title}</span>
            <span className={styles.puzzleDate}>
              <Calendar size={11} />
              {new Date(r.solved_at).toLocaleDateString()}
            </span>
          </div>
          {r.challenge.riddle_type && (
            <Badge variant={riddleTypeToVariant(r.challenge.riddle_type)} className={styles.riddleTypeBadge}>
              {r.challenge.riddle_type}
            </Badge>
          )}
          <span className={styles.puzzleXp}>+{r.challenge.xp_reward} XP</span>
        </div>
      ))}
    </div>
  );
}

// ─── Battle Logs Tab ──────────────────────────────────────────

function LogsTab({ userId }: { userId: string }) {
  const [logTab, setLogTab] = useState<LogTab>('duels');
  const { data: pvpHistory = [] } = usePvpHistory();
  const { data: challengeHistory = [] } = useChallengeHistory();

  return (
    <div>
      <div className={styles.subTabs}>
        <button
          className={cn(styles.subTab, { [styles.subTabActive]: logTab === 'duels' })}
          onClick={() => setLogTab('duels')}
        >
          <Swords size={12} />
          My Duels
        </button>
        <button
          className={cn(styles.subTab, { [styles.subTabActive]: logTab === 'puzzles' })}
          onClick={() => setLogTab('puzzles')}
        >
          <Trophy size={12} />
          Cracked Puzzles
        </button>
      </div>

      <AnimatePresence mode="wait">
        {logTab === 'duels' ? (
          <motion.div
            key="duels"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DuelsLog matches={pvpHistory} userId={userId} />
          </motion.div>
        ) : (
          <motion.div
            key="puzzles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PuzzlesLog records={challengeHistory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function PvpPage() {
  const [tab, setTab] = useState<Tab>('lobby');
  const { user: authUser } = useAppSelector((s) => s.auth);
  const { showGlobalToast } = useGlobalToast();

  const lobby = usePvpLobby();

  const handleCreate = async () => {
    await lobby.createRoom();
  };

  const handleJoin = async (matchId: string) => {
    await lobby.joinRoom(matchId);
  };

  const handleGuess = async (guess: string) => {
    const result = await lobby.submitGuess(guess);
    if (result && !result.correct) {
      showGlobalToast('Wrong answer — try again!', 'warning');
    }
  };

  const inMatch =
    lobby.phase === 'waiting' || lobby.phase === 'active' || lobby.phase === 'finished';

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>
        <Swords size={22} className={styles.titleIcon} />
        Competitive Arena
      </h1>

      <div className={styles.contentGrid}>
        <div className={styles.main}>
          {/* Tab bar — hidden during an active match */}
          {!inMatch && (
            <div className={styles.tabs}>
              {(['lobby', 'challenge', 'logs'] as Tab[]).map((t) => (
                <button
                  key={t}
                  className={cn(styles.tab, { [styles.tabActive]: tab === t })}
                  onClick={() => setTab(t)}
                >
                  {t === 'lobby' ? 'PvP Lobby' : t === 'challenge' ? 'Weekly Challenge' : 'Battle Logs'}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── LOBBY TAB ── */}
            {tab === 'lobby' && (
              <motion.div
                key="lobby"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {inMatch && lobby.match ? (
                  <ActiveMatchPanel
                    match={lobby.match}
                    currentUserId={authUser?.id ?? ''}
                    onSubmit={handleGuess}
                    guessResult={lobby.guessResult}
                    onReset={lobby.reset}
                  />
                ) : lobby.phase === 'waiting' && !lobby.match ? (
                  <div className={styles.waitingPanel}>
                    <Loader2 size={32} className={styles.spin} />
                    <p>Waiting for an opponent to join your room…</p>
                    <Button
                      variant="grey-glass-link"
                      size="auto"
                      onClick={() => void lobby.cancelRoom()}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    {lobby.error && <p className={styles.errorMsg}>{lobby.error}</p>}
                    <Button
                      variant="colored-glass"
                      onClick={() => void handleCreate()}
                      disabled={lobby.isLoading}
                      leftIcon={<Plus size={16} />}
                    >
                      {lobby.isLoading ? 'Creating…' : 'Create New Room'}
                    </Button>

                    <div className={styles.pendingList}>
                      <h3 className={styles.sectionTitle}>
                        <Users size={15} />
                        Open Rooms ({lobby.pendingRooms.length})
                      </h3>
                      {lobby.pendingRooms.length === 0 ? (
                        <p className={styles.emptyMsg}>
                          No open rooms. Be the first to create one!
                        </p>
                      ) : (
                        lobby.pendingRooms.map((room) => (
                          <PendingRoomCard
                            key={room.id}
                            room={room}
                            onJoin={() => void handleJoin(room.id)}
                            disabled={
                              lobby.isLoading || room.creator.id === authUser?.id
                            }
                          />
                        ))
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ── CHALLENGE TAB ── */}
            {tab === 'challenge' && (
              <motion.div
                key="challenge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChallengePanel />
              </motion.div>
            )}

            {/* ── BATTLE LOGS TAB ── */}
            {tab === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LogsTab userId={authUser?.id ?? ''} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
