import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Crown,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Star,
  Play,
  Crosshair,
  UserCheck,
  Search,
  Filter,
  DollarSign
} from 'lucide-react';
import { UserProfile, Tournament, PhotoChallenge } from '../types';
import { sounds } from '../utils/audio';

interface MonthlyContendersViewProps {
  user: UserProfile;
  accounts: { profile: UserProfile }[];
  tournaments: Tournament[];
  photoChallenges: PhotoChallenge[];
  onSelectTournament: (tournamentId: string) => void;
  onInspectScout: (scoutId: string) => void;
  onPlayChallenge: (challenge: PhotoChallenge) => void;
  onUpdateUserKarma: (addedKarma: number, addedWins?: number) => void;
}

export const MonthlyContendersView: React.FC<MonthlyContendersViewProps> = ({
  user,
  accounts,
  tournaments,
  photoChallenges,
  onSelectTournament,
  onInspectScout,
  onPlayChallenge,
  onUpdateUserKarma
}) => {
  const [rosterFilter, setRosterFilter] = useState<'all' | 'champions' | 'karma_leaders'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Find the monthly contenders tournament
  const monthlyTournament =
    tournaments.find((t) => t.id === 'tourn_monthly_contenders_sep_2026') ||
    tournaments.find((t) => t.title.toLowerCase().includes('monthly')) ||
    tournaments[0];

  // User Qualification Check
  const hasTournamentWin = user.tournamentsWon > 0;
  const isKarmaLeader = user.karmaPoints >= 1000;
  const isSpottedMaster = user.itemsFound >= 15;
  const isQualified = hasTournamentWin || isKarmaLeader || isSpottedMaster;

  const karmaProgress = Math.min(100, Math.round((user.karmaPoints / 1000) * 100));

  // Extract all profiles from accounts + user
  const allProfiles: UserProfile[] = accounts.map((a) => a.profile);

  // Filter contenders based on search & tab
  const filteredContenders = allProfiles.filter((scout) => {
    const matchesSearch =
      scout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scout.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scout.squadName && scout.squadName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (rosterFilter === 'champions') {
      return scout.tournamentsWon > 0;
    }
    if (rosterFilter === 'karma_leaders') {
      return scout.karmaPoints >= 1000;
    }
    return true;
  });

  const handleTestBoost = () => {
    onUpdateUserKarma(250, 1);
    if (user.preferences?.soundEffects !== false) {
      sounds.playPurseJackpot();
    }
  };

  const isJoinedInMonthly = monthlyTournament?.joinedPlayerIds.includes(user.id);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>SpotQuest Monthly Contenders Invitational</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
              September 2026 Championship Season
            </span>
          </div>

          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Top Contenders League for <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-200 bg-clip-text text-transparent">Tournament Winners & Karma Leaders</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every month, SpotQuest gathers the top tournament champions, high-karma deed heroes, and master scouts into a single high-stakes championship cup with double karma multipliers and a $10,000 purse jackpot.
            </p>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Grand Prize Purse</span>
              <span className="text-lg font-black text-amber-400">$10,000 USD</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Qualified Contenders</span>
              <span className="text-lg font-black text-indigo-300">28 Elite Scouts</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Contenders Karma Boost</span>
              <span className="text-lg font-black text-emerald-400">2.0x Double XP</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Qualification Entry</span>
              <span className="text-lg font-black text-rose-400">1 Win or 1,000 Karma</span>
            </div>
          </div>
        </div>
      </div>

      {/* USER QUALIFICATION STATUS CARD */}
      <div className={`p-6 rounded-3xl border shadow-xl transition ${
        isQualified
          ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/50'
          : 'bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950/40 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              {isQualified ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Qualified Invitational Contender</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Contender Qualification In Progress</span>
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">
                {user.name}'s Contender Status
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {isQualified ? (
                  <>
                    Congratulations! You have met the entry requirements via{' '}
                    <strong className="text-emerald-300">
                      {hasTournamentWin ? `${user.tournamentsWon} Tournament Wins` : `${user.karmaPoints} Karma Points`}
                    </strong>
                    . You are invited to compete in the September Monthly Contenders Derby.
                  </>
                ) : (
                  <>
                    To unlock the Monthly Contenders Invitational, you need at least <strong>1 Tournament Win</strong> or <strong>1,000 Karma Points</strong>.
                  </>
                )}
              </p>
            </div>

            {/* Criteria Breakdown Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold ${
                hasTournamentWin
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <Trophy className="w-3.5 h-3.5" />
                <span>Tournament Winner: {user.tournamentsWon} Wins</span>
                {hasTournamentWin && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
              </div>

              <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold ${
                isKarmaLeader
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Karma Leader: {user.karmaPoints} / 1000 Pts</span>
                {isKarmaLeader && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>

              <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold ${
                isSpottedMaster
                  ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <Crosshair className="w-3.5 h-3.5" />
                <span>Spotted Elite: {user.itemsFound} / 15 Items</span>
                {isSpottedMaster && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
            </div>

            {/* Progress Bar if not qualified */}
            {!isQualified && (
              <div className="space-y-1.5 max-w-md pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Qualification Progress</span>
                  <span className="text-amber-400">{karmaProgress}% Complete</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${karmaProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Action Callout */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
            {monthlyTournament && (
              <button
                onClick={() => onSelectTournament(monthlyTournament.id)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition"
              >
                <Trophy className="w-4 h-4" />
                <span>{isJoinedInMonthly ? 'View Monthly Derby Hub' : 'Enter Contenders Invitational'}</span>
              </button>
            )}

            <button
              onClick={handleTestBoost}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs border border-amber-500/30 flex items-center justify-center gap-2 transition"
              title="Add test Karma & Wins to test qualification"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Simulate Qualification (+250 Karma / +1 Win)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roster Controls & Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Qualified Monthly Contenders Roster ({filteredContenders.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Scouts who earned their spot in the September Monthly Invitational through tournament victories or high karma deeds.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search contenders or squad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
          <button
            onClick={() => setRosterFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              rosterFilter === 'all'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Top Contenders ({allProfiles.length})
          </button>
          <button
            onClick={() => setRosterFilter('champions')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              rosterFilter === 'champions'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Tournament Champions</span>
          </button>
          <button
            onClick={() => setRosterFilter('karma_leaders')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              rosterFilter === 'karma_leaders'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Karma Deed Leaders</span>
          </button>
        </div>

        {/* Contenders Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredContenders.map((scout) => {
            const scoutHasWin = scout.tournamentsWon > 0;
            const scoutIsKarmaLeader = scout.karmaPoints >= 1000;

            return (
              <div
                key={scout.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 transition shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={scout.avatar}
                        alt={scout.name}
                        onClick={() => onInspectScout(scout.id)}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800 cursor-pointer hover:ring-rose-500 transition"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4
                            onClick={() => onInspectScout(scout.id)}
                            className="font-extrabold text-sm text-white cursor-pointer hover:text-rose-400 transition truncate max-w-[130px]"
                          >
                            {scout.name}
                          </h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-400">{scout.handle}</p>
                        {scout.squadName && (
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
                            {scout.squadName}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-indigo-950 border border-indigo-500/30 text-indigo-300">
                      Lvl {scout.level}
                    </span>
                  </div>

                  {/* Qualification Badges */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {scoutHasWin && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 font-extrabold flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-400" />
                        <span>{scout.tournamentsWon}x Champion</span>
                      </span>
                    )}

                    {scoutIsKarmaLeader && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{scout.karmaPoints} Karma</span>
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-extrabold flex items-center gap-1">
                      <Crosshair className="w-3 h-3 text-cyan-400" />
                      <span>{scout.itemsFound} Spotted</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Career Earnings</span>
                    <strong className="text-emerald-400 font-black">${scout.totalPurseWinnings}</strong>
                  </div>

                  <button
                    onClick={() => onInspectScout(scout.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>Inspect Profile</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MONTHLY CHAMPIONSHIP EXCLUSIVE PHOTO CHALLENGES */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-amber-400" />
              <span>Monthly Championship I-Spy Photo Challenges</span>
            </h3>
            <p className="text-xs text-slate-400">
              High-difficulty photo riddles created exclusively for top contenders. Complete these scenes to earn double karma points!
            </p>
          </div>

          <span className="text-xs font-black text-amber-400 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/40">
            2.0x Karma XP Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photoChallenges.slice(0, 3).map((challenge) => (
            <div
              key={challenge.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="relative h-36">
                <img
                  src={challenge.imageUrl}
                  alt={challenge.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 p-3 flex flex-col justify-between">
                  <span className="self-end px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                    {challenge.sceneCategory}
                  </span>
                  <span className="text-xs font-extrabold text-white">{challenge.title}</span>
                </div>
              </div>

              <div className="p-3 space-y-2">
                <p className="text-[11px] text-slate-400 line-clamp-2">{challenge.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                  <span className="text-amber-400 font-extrabold text-[11px]">
                    {challenge.taggedObjects.length} Hidden Objects
                  </span>
                  <button
                    onClick={() => onPlayChallenge(challenge)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-1 shadow-md"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Play Scene</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAMPIONS HALL OF FAME */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>SpotQuest Monthly Champions Hall of Fame</span>
          </h3>
          <span className="text-xs text-slate-400">Past Invitational Legends</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-b from-amber-950/60 to-slate-950 border border-amber-500/40 rounded-2xl p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
              <Crown className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider block">August 2026 Champion</span>
            <h4 className="font-extrabold text-white text-sm">Marcus Cole</h4>
            <p className="text-xs text-slate-400">$5,000 Prize Won • 2,100 Karma</p>
          </div>

          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/40">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider block">July 2026 Champion</span>
            <h4 className="font-extrabold text-white text-sm">Maya Lin</h4>
            <p className="text-xs text-slate-400">$3,500 Prize Won • 1,720 Karma</p>
          </div>

          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-extrabold uppercase text-rose-300 tracking-wider block">June 2026 Champion</span>
            <h4 className="font-extrabold text-white text-sm">Ronnie Hills</h4>
            <p className="text-xs text-slate-400">$4,000 Prize Won • 1,850 Karma</p>
          </div>
        </div>
      </div>
    </div>
  );
};
