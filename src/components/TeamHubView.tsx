import React from 'react';
import { Users, Flame, Trophy, ShieldCheck, Sparkles, Award, Layers } from 'lucide-react';
import { Squad, UserProfile } from '../types';

interface TeamHubViewProps {
  squads: Squad[];
  user: UserProfile;
}

export const TeamHubView: React.FC<TeamHubViewProps> = ({ squads, user }) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider border border-indigo-500/30">
                Team Synergy Engine
              </span>
              <span className="text-xs text-amber-400 font-bold">
                Your Squad: {user.squadName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Squads & Collective Multipliers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              "Scavenge as a team, win the purse for yourself!" Every good deed and item logged by your squad members unlocks collective multiplier bonuses for every teammate.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-indigo-300 block">Active Team Boost</span>
            <span className="text-2xl font-black text-emerald-400">1.45x Karma Boost</span>
          </div>
        </div>
      </div>

      {/* Squad Leaderboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {squads.map((squad) => (
          <div
            key={squad.id}
            className={`bg-slate-900/90 border rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between transition ${
              squad.id === user.squadId
                ? 'border-indigo-500/60 ring-2 ring-indigo-500/30'
                : 'border-slate-800'
            }`}
          >
            {/* Banner & Avatar */}
            <div className="relative h-28 w-full bg-slate-800">
              <img
                src={squad.banner}
                alt={squad.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute -bottom-4 left-5 flex items-center gap-3">
                <img
                  src={squad.avatar}
                  alt={squad.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-900 shadow-md"
                />
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-black border border-white/10 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Rank #{squad.rank}</span>
              </div>
            </div>

            {/* Squad Info */}
            <div className="p-5 pt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white">{squad.name}</h3>
                  <span className="text-xs font-black text-indigo-400">[{squad.tag}]</span>
                </div>
                <span className="text-xs text-slate-400">{squad.membersCount} Active Scouts</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Items Spotted</span>
                  <strong className="text-cyan-300 font-bold">{squad.totalItemsFound} items</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Karma</span>
                  <strong className="text-emerald-300 font-bold">+{squad.totalKarmaPoints} karma</strong>
                </div>
              </div>

              {/* Multiplier bar */}
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>Teammate Multiplier:</span>
                </div>
                <span className="text-sm font-black text-amber-300">{squad.teamMultiplier}x</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Combined Score:</span>
              <span className="text-sm font-black text-white">{squad.combinedScore.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
