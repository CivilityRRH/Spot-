import React from 'react';
import { Radio, Sparkles, Trophy, PlusCircle, Bell, Search, ShieldCheck, User, Plus, Camera, Tv } from 'lucide-react';
import { UserProfile, Tournament } from '../types';

interface HeaderProps {
  user: UserProfile;
  activeTournament: Tournament;
  onGoLive: () => void;
  onClaimItem: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onOpenCreateTournament: () => void;
  onOpenCreateChallenge: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTournament,
  onGoLive,
  onClaimItem,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  onOpenProfile,
  onOpenAuth,
  onOpenCreateTournament,
  onOpenCreateChallenge
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('feed')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <span className="text-xl font-black tracking-tight text-white">👁️</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-200 bg-clip-text text-transparent">
                SpotQuest
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {activeTournament.isPrivate ? 'Private Cup' : 'Live Derby'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none hidden sm:block">
              I-Spy Social & Good Karma Arena
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search items, good deeds, players, or live hunts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-full focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition text-slate-100 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Live Purse & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Watch Live TV Button */}
          <button
            onClick={() => onTabChange('live_hub')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black transition ${
              activeTab === 'live_hub'
                ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                : 'bg-rose-950/50 hover:bg-rose-900/60 border-rose-500/40 text-rose-300'
            }`}
            title="Watch Live Scavenger Broadcasts like a TV game show"
          >
            <Tv className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Watch Live TV</span>
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          </button>

          {/* Tournament Purse Pill */}
          <button
            onClick={() => onTabChange('tournament')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-950/60 to-yellow-950/60 border border-amber-500/40 text-amber-300 hover:border-amber-400 transition group"
            title="Live Tournament Grand Purse Jackpot"
          >
            <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="text-left leading-tight">
              <span className="text-[10px] uppercase font-bold text-amber-400/80 block">Grand Purse</span>
              <span className="text-xs font-black text-amber-200">
                ${activeTournament.totalPurse.toLocaleString()}
              </span>
            </div>
          </button>

          {/* User Karma Balance Pill */}
          <button
            onClick={() => onTabChange('calculator')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 transition"
            title="Your Karma Points and Multipliers"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <div className="text-left leading-tight">
              <span className="text-[10px] uppercase font-bold text-emerald-400/80 block">Karma Score</span>
              <span className="text-xs font-black text-emerald-200">{user.karmaPoints} pts</span>
            </div>
          </button>

          {/* Tag Photo Challenge button */}
          <button
            onClick={onOpenCreateChallenge}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-200 text-xs font-bold border border-indigo-500/40 transition"
            title="Upload photo & tag items"
          >
            <Camera className="w-4 h-4 text-indigo-400" />
            <span>Tag Photo</span>
          </button>

          {/* Claim Item Button */}
          <button
            onClick={onClaimItem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 transition"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Found Item</span>
          </button>

          {/* Go Live Button */}
          <button
            onClick={onGoLive}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition transform hover:scale-[1.02] active:scale-95"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Go Live</span>
          </button>

          {/* User Profile Trigger Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-1 group cursor-pointer focus:outline-none"
            title="View & Edit Profile / Switch Accounts"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/60 group-hover:ring-rose-400 transition"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <ShieldCheck className="w-2 h-2 text-white" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
