import React from 'react';
import {
  X,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Trophy,
  Sparkles,
  Compass,
  Zap,
  Award,
  Eye,
  CheckCircle2,
  Lock,
  Star
} from 'lucide-react';
import { UserProfile, SocialPost, PhotoChallenge } from '../types';
import { sounds } from '../utils/audio';

interface ScoutProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  scout: UserProfile | null;
  currentUser: UserProfile;
  onToggleFollow: (scoutId: string) => void;
  userPosts?: SocialPost[];
  userChallenges?: PhotoChallenge[];
  onPlayChallenge?: (challenge: PhotoChallenge) => void;
}

export const ScoutProfileModal: React.FC<ScoutProfileModalProps> = ({
  isOpen,
  onClose,
  scout,
  currentUser,
  onToggleFollow,
  userPosts = [],
  userChallenges = [],
  onPlayChallenge
}) => {
  if (!isOpen || !scout) return null;

  const isMe = scout.id === currentUser.id;
  const isFollowing = currentUser.followingUserIds?.includes(scout.id) || false;

  const handleFollowClick = () => {
    if (isMe) return;
    onToggleFollow(scout.id);
    if (!isFollowing && currentUser.preferences?.soundEffects !== false) {
      sounds.playPurseJackpot();
    } else {
      sounds.playKarmaChime();
    }
  };

  const scoutPosts = userPosts.filter((p) => p.userId === scout.id || p.userName === scout.name);
  const scoutChallenges = userChallenges.filter((c) => c.creatorId === scout.id || c.creatorName === scout.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Cover Banner */}
        <div className="relative h-28 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-rose-500/40 text-rose-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-rose-400" />
              <span>Scout Inspection</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Info */}
        <div className="px-6 pb-4 -mt-10 relative space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="relative">
              <img
                src={scout.avatar}
                alt={scout.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl bg-slate-800"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                Lvl {scout.level}
              </span>
            </div>

            {!isMe && (
              <button
                onClick={handleFollowClick}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg transition transform hover:scale-105 ${
                  isFollowing
                    ? 'bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 hover:bg-rose-950/80 hover:border-rose-500/60 hover:text-rose-200'
                    : 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Following Scout (Perks Active)</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow Scout (+Unlock Follower Perks)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* User Details */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white">{scout.name}</h3>
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              {scout.squadName && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300">
                  {scout.squadName}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {scout.handle} • <span className="text-amber-400">{scout.badge}</span>
            </div>
            {scout.bio && (
              <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                "{scout.bio}"
              </p>
            )}
          </div>

          {/* FOLLOWER ADVANTAGE HIGHLIGHT BANNER */}
          <div className="bg-gradient-to-r from-rose-950/80 via-slate-950 to-indigo-950/80 border border-rose-500/40 rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>Follower Advantage Guarantee</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-200 border border-rose-500/30">
                Anti-Popularity System
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              {isFollowing ? (
                <strong className="text-emerald-300">
                  ✓ Active Perks Unlocked: You get +15% Follower Karma Bonus & Radar Intel hints on all I-Spy challenges posted by {scout.name}!
                </strong>
              ) : (
                <>
                  Following <strong>{scout.name}</strong> grants <em>YOU</em> the advantage — unlock radar location hints and earn +15% extra Karma XP whenever you complete their challenges or verify their deeds!
                </>
              )}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Karma</span>
              <span className="font-black text-amber-400 text-sm">{scout.karmaPoints}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Spotted</span>
              <span className="font-black text-cyan-400 text-sm">{scout.itemsFound}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Good Deeds</span>
              <span className="font-black text-emerald-400 text-sm">{scout.goodDeedsLogged}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Winnings</span>
              <span className="font-black text-rose-400 text-sm">${scout.totalPurseWinnings}</span>
            </div>
          </div>
        </div>

        {/* Scout Activity Tabs & Feed */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 border-t border-slate-800/80 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Published I-Spy Challenges ({scoutChallenges.length})</span>
            </h4>
          </div>

          {scoutChallenges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scoutChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex gap-3 items-center hover:border-slate-700 transition"
                >
                  <img
                    src={challenge.imageUrl}
                    alt={challenge.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-white truncate">{challenge.title}</h5>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{challenge.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-amber-400 font-bold">
                        {challenge.taggedObjects.length} Objects
                      </span>
                      {onPlayChallenge && (
                        <button
                          onClick={() => {
                            onClose();
                            onPlayChallenge(challenge);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-extrabold"
                        >
                          Play Challenge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
              No photo challenges created yet by this scout.
            </div>
          )}

          {/* Recent Scout Feed Posts */}
          <div className="pt-2">
            <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Recent Activity Posts ({scoutPosts.length})</span>
            </h4>
            {scoutPosts.length > 0 ? (
              <div className="space-y-2">
                {scoutPosts.map((post) => (
                  <div key={post.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                    <p className="text-slate-200">{post.content}</p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span>{post.createdAt}</span>
                      <span className="text-rose-400 font-bold">+{post.totalEarnedScore} Score</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                No recent feed activity recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
