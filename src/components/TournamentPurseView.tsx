import React, { useState } from 'react';
import {
  Trophy,
  Coins,
  ShieldCheck,
  Flame,
  Users,
  Clock,
  Sparkles,
  Award,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Share2,
  Lock,
  Globe,
  PlusCircle,
  Key,
  Copy,
  Check,
  Crosshair,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tournament, UserProfile, PhotoChallenge } from '../types';
import { sounds } from '../utils/audio';

interface TournamentPurseViewProps {
  tournament: Tournament;
  tournaments: Tournament[];
  user: UserProfile;
  leaderboard: {
    rank: number;
    user: UserProfile;
    itemScore: number;
    karmaScore: number;
    teamMultiplier: number;
    totalPoints: number;
    potentialPursePayout: number;
    isMe: boolean;
  }[];
  photoChallenges: PhotoChallenge[];
  onSelectTournament: (tourney: Tournament) => void;
  onJoinTournament: (tournamentId: string, buyInFee: number) => void;
  onOpenCreateTournament: () => void;
  onPlayChallenge: (challenge: PhotoChallenge) => void;
  onOpenCreateChallenge: () => void;
  onUnlockPrivateTournament: (code: string) => boolean;
}

export const TournamentPurseView: React.FC<TournamentPurseViewProps> = ({
  tournament,
  tournaments,
  user,
  leaderboard,
  photoChallenges,
  onSelectTournament,
  onJoinTournament,
  onOpenCreateTournament,
  onPlayChallenge,
  onOpenCreateChallenge,
  onUnlockPrivateTournament
}) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'photo_challenges' | 'purse_breakdown' | 'rules'>('standings');
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!tournament) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400">
        <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="font-bold text-slate-200">No Tournament Selected</p>
        <button
          onClick={onOpenCreateTournament}
          className="mt-4 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition"
        >
          Create New Tournament
        </button>
      </div>
    );
  }

  const isJoined = tournament.joinedPlayerIds?.includes(user.id) || false;

  const handleCelebratePurse = () => {
    sounds.playPurseJackpot();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  const handleCopyInvite = () => {
    if (tournament.inviteCode) {
      navigator.clipboard?.writeText(tournament.inviteCode);
      setCopiedCode(true);
      sounds.playKarmaChime();
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleJoinClick = () => {
    sounds.playKarmaChime();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    onJoinTournament(tournament.id, tournament.buyInFee);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    const success = onUnlockPrivateTournament(inviteCodeInput.trim().toUpperCase());
    if (success) {
      sounds.playPurseJackpot();
      setShowInviteModal(false);
      setInviteCodeInput('');
    } else {
      setInviteError('Invalid invite code. Check code and try again.');
    }
  };

  const tournamentChallenges = photoChallenges.filter((c) => c.tournamentId === tournament.id);

  return (
    <div className="space-y-6">
      {/* Top Tournament Bar & Switcher */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-900 border border-slate-800 rounded-3xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0 pl-1">Tournaments:</span>
          {tournaments.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTournament(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-1.5 ${
                tournament.id === t.id
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {t.isPrivate ? <Lock className="w-3 h-3 text-amber-300" /> : <Globe className="w-3 h-3 text-cyan-300" />}
              <span>{(t?.title || 'Tournament').split(':')[0]}</span>
              <span className="text-[10px] opacity-80 font-mono">(${t.totalPurse})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Enter Invite Code</span>
          </button>

          <button
            onClick={onOpenCreateTournament}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md shadow-rose-600/30 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Tournament</span>
          </button>
        </div>
      </div>

      {/* Hero Tournament & Purse Card */}
      <div className="bg-gradient-to-br from-amber-950/80 via-slate-900 to-indigo-950/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Tournament Active</span>
              </span>

              {tournament.isPrivate ? (
                <span className="px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Private Tournament</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>Public Tournament</span>
                </span>
              )}

              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                ${tournament.buyInFee} Player Buy-In
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                {tournament.playersCount} Contenders
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {tournament.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {tournament.description}
            </p>

            {/* Creator and Invite Code details */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <span className="text-slate-400">
                Hosted by: <strong className="text-slate-200">{tournament.creatorName}</strong>
              </span>

              {tournament.isPrivate && tournament.inviteCode && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-amber-500/40">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-300 font-bold">Code:</span>
                  <code className="text-amber-300 font-mono font-black">{tournament.inviteCode}</code>
                  <button
                    onClick={handleCopyInvite}
                    className="ml-1 p-1 text-slate-400 hover:text-white"
                    title="Copy invite code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Timer & Stats */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-1.5 text-rose-400">
                <Clock className="w-4 h-4" />
                <span>Ends: Aug 26, 2026 (Live Sprint)</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Users className="w-4 h-4" />
                <span>{tournament.squadsCount} Competing Squads</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Crosshair className="w-4 h-4" />
                <span>{tournamentChallenges.length} Photo Challenges</span>
              </div>
            </div>

            {/* Join status button */}
            <div className="pt-2">
              {isJoined ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You Are Registered in this Tournament (${tournament.buyInFee} Buy-In Secured)</span>
                </div>
              ) : (
                <button
                  onClick={handleJoinClick}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition transform hover:scale-[1.02] flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Join Tournament (Pay ${tournament.buyInFee} Buy-In)</span>
                </button>
              )}
            </div>
          </div>

          {/* Grand Purse Display Box (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-amber-500/50 rounded-3xl p-6 text-center space-y-4 shadow-xl">
            <div>
              <span className="text-[11px] uppercase font-black tracking-widest text-amber-400 block mb-1">
                Live Tournament Grand Purse
              </span>
              <div
                onClick={handleCelebratePurse}
                className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition"
                title="Click to celebrate purse!"
              >
                ${tournament.totalPurse.toLocaleString()}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400">
                <span>Player Buy-ins: ${(tournament.totalPurse - tournament.sponsorBonus).toLocaleString()}</span>
                <span>+</span>
                <span className="text-amber-300 font-bold">${tournament.sponsorBonus} Sponsor Match</span>
              </div>
            </div>

            {/* Purse distribution mini pills */}
            <div className="grid grid-cols-2 gap-2 text-left text-[11px] pt-3 border-t border-slate-800">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">1st Place (50%)</span>
                <strong className="text-amber-300 font-black text-sm">
                  ${tournament.prizeSplit.firstPlace.toLocaleString()}
                </strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Top Karma Hero (10%)</span>
                <strong className="text-emerald-400 font-black text-sm">
                  ${tournament.prizeSplit.topKarmaDeedHero.toLocaleString()}
                </strong>
              </div>
            </div>

            <button
              onClick={handleCelebratePurse}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition transform hover:scale-[1.02]"
            >
              🎉 Celebrate Live Purse
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'standings'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Leaderboard & Purse Standings
        </button>

        <button
          onClick={() => setActiveTab('photo_challenges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'photo_challenges'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>I-Spy Photo Scenes ({tournamentChallenges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('purse_breakdown')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'purse_breakdown'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Purse Jackpot Allocation
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'rules'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Scavenger & Karma Rules
        </button>
      </div>

      {/* Tab: Standings */}
      {activeTab === 'standings' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-white">Live Tournament Leaderboard</h3>
              <p className="text-xs text-slate-400">
                Formula: (Items Found Pts + Good Deeds Karma) × Squad Synergy Multiplier = Total Score
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Karma deeds weighted into rank</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-extrabold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Rank</th>
                  <th className="py-3 px-4">Scout / Player</th>
                  <th className="py-3 px-4 text-center">Items Score</th>
                  <th className="py-3 px-4 text-center">Karma Deeds</th>
                  <th className="py-3 px-4 text-center">Squad Boost</th>
                  <th className="py-3 px-4 text-right">Total Score</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Projected Purse Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((row) => (
                  <tr
                    key={row.user.id}
                    className={`hover:bg-slate-800/40 transition ${
                      row.isMe ? 'bg-amber-950/20 border-l-2 border-amber-400' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 font-black">
                      <div className="flex items-center gap-2">
                        {row.rank === 1 && (
                          <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                            1
                          </div>
                        )}
                        {row.rank === 2 && (
                          <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-black text-xs">
                            2
                          </div>
                        )}
                        {row.rank === 3 && (
                          <div className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-xs">
                            3
                          </div>
                        )}
                        {row.rank > 3 && <span className="text-slate-400 font-bold ml-2">#{row.rank}</span>}
                      </div>
                    </td>

                    {/* Player Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.user.avatar}
                          alt={row.user.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-100">{row.user.name}</span>
                            {row.isMe && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{row.user.handle} • {row.user.squadName}</span>
                        </div>
                      </div>
                    </td>

                    {/* Items Score */}
                    <td className="py-3.5 px-4 text-center font-bold text-cyan-400">
                      {row.itemScore} pts
                    </td>

                    {/* Karma Deeds */}
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-400">
                      +{row.karmaScore} karma
                    </td>

                    {/* Squad Boost */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold">
                        {row.teamMultiplier}x
                      </span>
                    </td>

                    {/* Total Score */}
                    <td className="py-3.5 px-4 text-right font-black text-sm text-white">
                      {row.totalPoints.toLocaleString()}
                    </td>

                    {/* Potential Payout */}
                    <td className="py-3.5 px-4 text-right">
                      {row.potentialPursePayout > 0 ? (
                        <span className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 font-black text-xs">
                          ${row.potentialPursePayout.toLocaleString()} USD
                        </span>
                      ) : (
                        <span className="text-slate-500 font-semibold">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Photo Challenges */}
      {activeTab === 'photo_challenges' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="font-black text-base text-white">Tournament Photo Challenges</h3>
              <p className="text-xs text-slate-400">
                Click into any photo challenge to spy tagged hidden items and score tournament points.
              </p>
            </div>

            <button
              onClick={onOpenCreateChallenge}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tag New Photo Challenge</span>
            </button>
          </div>

          {tournamentChallenges.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
              <Crosshair className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">No photo challenges created yet for this tournament.</p>
              <button
                onClick={onOpenCreateChallenge}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Create First Challenge
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournamentChallenges.map((challenge) => {
                const foundIds = challenge.foundObjectsByUser[user.id] || [];
                const isAllFound = challenge.taggedObjects.length > 0 && challenge.taggedObjects.every((o) => foundIds.includes(o.id));
                const totalPoints = challenge.taggedObjects.reduce((a, b) => a + b.points, 0);

                return (
                  <div
                    key={challenge.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img
                          src={challenge.imageUrl}
                          alt={challenge.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-950/80 text-[10px] font-bold text-white">
                          {challenge.sceneCategory}
                        </div>
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black">
                          +{totalPoints} PTS
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-extrabold text-sm text-slate-100 line-clamp-1">{challenge.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{challenge.description}</p>
                        <div className="text-[11px] text-emerald-400 font-bold">
                          {foundIds.length} / {challenge.taggedObjects.length} Objects Spied
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => onPlayChallenge(challenge)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:from-cyan-500 hover:to-indigo-500 transition"
                      >
                        {isAllFound ? 'Re-inspect Scene' : 'Play I-Spy Scene'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Purse Breakdown */}
      {activeTab === 'purse_breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>Purse Jackpot Prize Structure</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <strong className="text-amber-300 text-sm block">1st Place Grand Champion (50%)</strong>
                  <span className="text-slate-400 text-[11px]">Highest combined items + karma score</span>
                </div>
                <span className="text-base font-black text-amber-200">
                  ${tournament.prizeSplit.firstPlace.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-200 text-sm block">2nd Place Runner-Up (25%)</strong>
                  <span className="text-slate-400 text-[11px]">Second overall rank</span>
                </div>
                <span className="text-base font-black text-slate-100">
                  ${tournament.prizeSplit.secondPlace.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-200 text-sm block">3rd Place Podium (15%)</strong>
                  <span className="text-slate-400 text-[11px]">Third overall rank</span>
                </div>
                <span className="text-base font-black text-slate-100">
                  ${tournament.prizeSplit.thirdPlace.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <strong className="text-emerald-300 text-sm block">Ultimate Karma Deed Hero (10%)</strong>
                  <span className="text-slate-400 text-[11px]">Player with highest verified Good Deed impact</span>
                </div>
                <span className="text-base font-black text-emerald-300">
                  ${tournament.prizeSplit.topKarmaDeedHero.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* How The Purse Grows */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>How The Purse Grows</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                • <strong>Player Buy-Ins:</strong> Every player puts in a ${tournament.buyInFee} registration buy-in into the tournament pot. 100% goes directly to the winner payout pool.
              </p>
              <p>
                • <strong>Sponsor Matching:</strong> Community partners match the purse with bonus funding for eco-cleanup and kindness milestones (${tournament.sponsorBonus} active sponsor bonus).
              </p>
              <p>
                • <strong>Live Viewer Tips:</strong> Audiences watching live streams can tip directly into the grand purse to reward epic discoveries!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Rules */}
      {activeTab === 'rules' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Official KarmaSpy Tournament Rules & Anti-Cheat</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {tournament.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Private Tournament Unlock Dialog */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">Enter Private Invite Code</h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Have an invitation code from a friend or tournament host? Enter it below to unlock access.
            </p>

            {inviteError && (
              <div className="p-2.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                {inviteError}
              </div>
            )}

            <form onSubmit={handleUnlockSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                placeholder="E.g. VAULT-779"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-amber-500/50 rounded-xl text-amber-300 font-mono font-black text-center text-sm tracking-wider focus:outline-none"
                required
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-extrabold text-xs shadow-md transition"
              >
                Unlock & Switch Tournament
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

