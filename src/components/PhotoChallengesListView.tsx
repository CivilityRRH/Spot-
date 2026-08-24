import React, { useState } from 'react';
import {
  Camera,
  Crosshair,
  Sparkles,
  Trophy,
  CheckCircle2,
  Plus,
  Play,
  Layers,
  Search,
  Filter,
  Eye,
  Zap,
  UserCheck
} from 'lucide-react';
import { PhotoChallenge, Tournament, UserProfile } from '../types';

interface PhotoChallengesListViewProps {
  challenges: PhotoChallenge[];
  activeTournament: Tournament;
  currentUser: UserProfile;
  onPlayChallenge: (challenge: PhotoChallenge) => void;
  onOpenCreateChallenge: () => void;
}

export const PhotoChallengesListView: React.FC<PhotoChallengesListViewProps> = ({
  challenges,
  activeTournament,
  currentUser,
  onPlayChallenge,
  onOpenCreateChallenge
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter challenges for this tournament
  const tournamentChallenges = challenges.filter(
    (c) => !activeTournament?.id || c.tournamentId === activeTournament.id
  );

  const filtered = tournamentChallenges.filter((c) => {
    const matchesCat = filterCategory === 'all' || c.sceneCategory === filterCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Crosshair className="w-4 h-4" />
            </span>
            <h2 className="font-black text-base sm:text-lg text-white">
              I-Spy Photo Challenges & Object Tagging
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Spot tagged objects in high-resolution tournament photos to score points and karma boosts.
          </p>
        </div>

        <button
          onClick={onOpenCreateChallenge}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition transform hover:scale-[1.02] flex items-center gap-2 shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>Tag & Create Photo Challenge</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
          {['all', 'Vintage Desk', 'Market & Cafe', 'Nature Park', 'Urban Street', 'Cozy Room'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                filterCategory === cat
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Scenes' : cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scenes & clues..."
            className="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Grid of Challenges */}
      {filtered.length === 0 ? (
        <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <Camera className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="font-extrabold text-sm text-slate-300">No Photo Challenges in this Tournament Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Be the first creator to upload a scene photo and tag hidden objects for players to spy!
          </p>
          <button
            onClick={onOpenCreateChallenge}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
          >
            Create First Challenge
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((challenge) => {
            const foundIds = challenge.foundObjectsByUser[currentUser.id] || [];
            const isCompleted =
              challenge.taggedObjects.length > 0 &&
              challenge.taggedObjects.every((o) => foundIds.includes(o.id));
            const totalPoints = challenge.taggedObjects.reduce((acc, curr) => acc + curr.points, 0);

            return (
              <div
                key={challenge.id}
                className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner with Badges */}
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img
                      src={challenge.imageUrl}
                      alt={challenge.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>{challenge.sceneCategory}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-amber-500/90 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>+{totalPoints} PTS</span>
                    </div>

                    {isCompleted && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-xl flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>100% Spied</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={challenge.creatorAvatar}
                          alt={challenge.creatorName}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <span className="text-[11px] text-slate-400">By {challenge.creatorName}</span>
                      </div>
                      {currentUser.followingUserIds?.includes(challenge.creatorId) && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-black flex items-center gap-1">
                          <Zap className="w-3 h-3 text-rose-400 animate-pulse" />
                          <span>+15% PERK</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-100 line-clamp-1">{challenge.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {challenge.description}
                    </p>

                    {/* Progress indicator */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span className="text-slate-400">Objects Discovered:</span>
                        <span className={isCompleted ? 'text-emerald-400' : 'text-amber-400'}>
                          {foundIds.length} / {challenge.taggedObjects.length}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isCompleted
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-amber-500 to-rose-500'
                          }`}
                          style={{
                            width: `${(foundIds.length / (challenge.taggedObjects.length || 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => onPlayChallenge(challenge)}
                    className={`w-full py-2.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition ${
                      isCompleted
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? 'Revisit & Inspect' : 'Play I-Spy Scene'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
