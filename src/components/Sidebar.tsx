import React from 'react';
import {
  Rss,
  Radio,
  Sparkles,
  Trophy,
  Users,
  Layers,
  Calculator,
  Compass,
  FileQuestion,
  Flame,
  CheckCircle2,
  Gift,
  Crosshair,
  PlusCircle,
  Camera,
  UserCheck,
  Crown,
  Tv,
  MapPin,
  Video
} from 'lucide-react';
import { UserProfile, Tournament } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: UserProfile;
  activeTournament: Tournament;
  onOpenProfile: () => void;
  onOpenCreateTournament: () => void;
  onOpenCreateChallenge: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  user,
  activeTournament,
  onOpenProfile,
  onOpenCreateTournament,
  onOpenCreateChallenge
}) => {
  const navItems = [
    { id: 'live_hub', label: 'Watch Live TV Show', icon: Tv, badge: '🔴 ON AIR' },
    { id: 'workspace', label: 'Meet, Chat & Classroom', icon: Video, badge: 'Google Hub' },
    { id: 'feed', label: 'Social & Kindness Feed', icon: Rss, badge: 'Live' },
    { id: 'tournament', label: 'Town Tournaments ($)', icon: Trophy, badge: `$${activeTournament.totalPurse}` },
    { id: 'challenges', label: 'I-Spy Photo Scenes', icon: Crosshair, badge: 'Tag & Play' },
    { id: 'catalog', label: 'Everyday Town Items', icon: Compass, badge: 'Unlimited' },
    { id: 'calculator', label: 'Good Deeds Calculator', icon: Calculator, badge: 'Boost' },
    { id: 'monthly_contenders', label: 'Monthly Top Contenders', icon: Crown, badge: '$10k Cup' },
    { id: 'custom_requests', label: 'Custom Item Requests', icon: FileQuestion, badge: 'Community' },
    { id: 'squads', label: 'Squads & Team Boost', icon: Users, badge: 'Synergy' },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4">
      {/* User Mini Profile Card */}
      <div
        onClick={onOpenProfile}
        className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-sm cursor-pointer transition group"
        title="Click to view & edit your profile"
      >
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-500/50 group-hover:ring-rose-400 transition"
          />
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-slate-100 truncate">{user.name}</h3>
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-400 truncate">{user.handle}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                Lvl {user.level}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold truncate">
                {user.squadName}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
          <div className="bg-slate-800/60 rounded-xl p-2">
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-0.5">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Items Found</span>
            </div>
            <span className="text-sm font-black text-slate-100">{user.itemsFound}</span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-2">
            <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Good Deeds</span>
            </div>
            <span className="text-sm font-black text-slate-100">{user.goodDeedsLogged}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2 shadow-sm space-y-1">
        <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Tournament Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Creator Quick Actions */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
          Creator Toolkit
        </span>

        <button
          onClick={onOpenCreateTournament}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Host New Tournament</span>
        </button>

        <button
          onClick={onOpenCreateChallenge}
          className="w-full py-2 px-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-extrabold text-xs border border-indigo-500/40 flex items-center justify-center gap-2 transition"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Upload & Tag Photo</span>
        </button>
      </div>

      {/* Live Karma Multiplier Callout */}
      <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/30 rounded-2xl p-4 text-slate-200">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <Flame className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>Active Squad Synergy</span>
        </div>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          Your squad has logged 15 good deeds today! You have an active <strong className="text-emerald-300">1.45x Karma Multiplier</strong> applied to all found items.
        </p>
        <button
          onClick={() => onTabChange('calculator')}
          className="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calculate Next Good Deed</span>
        </button>
      </div>

      {/* Quick Tournament Rules Note */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Scavenger Rules</span>
        </div>
        <p>100% video/photo verified proof. Everyone plays for themselves; winning squad earns bonus purse share.</p>
      </div>
    </aside>
  );
};
