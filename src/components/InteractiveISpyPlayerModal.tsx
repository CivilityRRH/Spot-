import React, { useState, useRef } from 'react';
import {
  Crosshair,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Trophy,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
  Flame,
  Award,
  Layers,
  AlertCircle,
  Zap,
  UserCheck,
  UserPlus,
  Compass
} from 'lucide-react';
import { PhotoChallenge, TaggedObject, UserProfile } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface InteractiveISpyPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: PhotoChallenge;
  user: UserProfile;
  onObjectDiscovered: (challengeId: string, objectId: string, points: number, karmaBonus?: number) => void;
  onChallengeCompleted: (challengeId: string) => void;
  onToggleFollowCreator?: (creatorId: string) => void;
}

export const InteractiveISpyPlayerModal: React.FC<InteractiveISpyPlayerModalProps> = ({
  isOpen,
  onClose,
  challenge,
  user,
  onObjectDiscovered,
  onChallengeCompleted,
  onToggleFollowCreator
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);
  const [recentSpot, setRecentSpot] = useState<{ x: number; y: number; name: string; points: number } | null>(null);
  const [missRipple, setMissRipple] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isFollowingCreator = user.followingUserIds?.includes(challenge.creatorId) || false;
  const isMe = challenge.creatorId === user.id;

  const foundObjectIds = challenge.foundObjectsByUser[user.id] || [];
  const isAllFound = challenge.taggedObjects.length > 0 && challenge.taggedObjects.every((o) => foundObjectIds.includes(o.id));

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if click is within radius of any unfound object
    const hitObject = challenge.taggedObjects.find((obj) => {
      if (foundObjectIds.includes(obj.id)) return false;
      const dx = clickX - obj.x;
      const dy = clickY - obj.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const tolerance = obj.radius || 7;
      return dist <= tolerance;
    });

    if (hitObject) {
      sounds.playKarmaChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight
        }
      });

      // Apply +15% Follower Advantage points boost if following creator
      const basePoints = hitObject.points;
      const finalPoints = isFollowingCreator ? Math.round(basePoints * 1.15) : basePoints;
      const followerBonusKarma = isFollowingCreator ? Math.round((hitObject.karmaBonus || 10) * 1.15) : hitObject.karmaBonus;

      setRecentSpot({
        x: hitObject.x,
        y: hitObject.y,
        name: hitObject.name,
        points: finalPoints
      });

      onObjectDiscovered(challenge.id, hitObject.id, finalPoints, followerBonusKarma);

      // Check if this was the last object needed
      const willBeAllFound = challenge.taggedObjects.filter((o) => o.id !== hitObject.id).every((o) => foundObjectIds.includes(o.id));
      if (willBeAllFound) {
        sounds.playPurseJackpot();
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 }
        });
        onChallengeCompleted(challenge.id);
      }

      setTimeout(() => {
        setRecentSpot(null);
      }, 2500);
    } else {
      sounds.playCameraShutter();
      setMissRipple({ x: clickX, y: clickY });
      setTimeout(() => {
        setMissRipple(null);
      }, 600);
    }
  };

  const totalPoints = challenge.taggedObjects.reduce((a, b) => a + b.points, 0);
  const earnedPoints = challenge.taggedObjects
    .filter((o) => foundObjectIds.includes(o.id))
    .reduce((a, b) => a + b.points, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4 max-h-[96vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-white">{challenge.title}</h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  {challenge.sceneCategory}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Created by {challenge.creatorName} • Find all {challenge.taggedObjects.length} hidden objects!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isMe && onToggleFollowCreator && (
              <button
                onClick={() => onToggleFollowCreator(challenge.creatorId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                  isFollowingCreator
                    ? 'bg-emerald-950/90 border border-emerald-500/50 text-emerald-300'
                    : 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md hover:from-rose-500 hover:to-indigo-500'
                }`}
              >
                {isFollowingCreator ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Following Scout (+15% Bonus Active)</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow @{challenge.creatorName} (+Unlock +15% Karma & Hints)</span>
                  </>
                )}
              </button>
            )}

            {/* Zoom Controls */}
            <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
              <button
                onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.25))}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 py-1 text-[10px] font-bold text-slate-300">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(2.25, zoomLevel + 0.25))}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress & Score Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Objects Spied</span>
              <strong className="text-sm font-black text-emerald-400">
                {foundObjectIds.length} / {challenge.taggedObjects.length}
              </strong>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Points Accrued</span>
              <strong className="text-sm font-black text-amber-400">
                {earnedPoints} / {totalPoints} pts
              </strong>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-xs bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500"
              style={{
                width: `${(foundObjectIds.length / (challenge.taggedObjects.length || 1)) * 100}%`
              }}
            />
          </div>

          {isAllFound && (
            <div className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/40 flex items-center gap-1.5 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scene Mastered!</span>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Left: Interactive Canvas */}
          <div className="lg:col-span-8 overflow-auto rounded-2xl bg-black border border-slate-800 relative flex items-center justify-center p-2">
            <div
              ref={containerRef}
              onClick={handleImageClick}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
              className="relative aspect-video max-w-full w-full cursor-crosshair select-none transition-transform duration-150"
            >
              <img
                src={challenge.imageUrl}
                alt={challenge.title}
                className="w-full h-full object-cover rounded-xl pointer-events-none shadow-2xl"
              />

              {/* Already Discovered Object Rings */}
              {challenge.taggedObjects.map((obj) => {
                const isFound = foundObjectIds.includes(obj.id);
                if (!isFound) return null;
                return (
                  <div
                    key={obj.id}
                    style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-emerald-500/30 flex items-center justify-center shadow-lg animate-pulse">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    </div>
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 px-1.5 py-0.5 rounded bg-slate-900/90 text-emerald-300 font-bold text-[9px] whitespace-nowrap border border-emerald-500/40">
                      {obj.name}
                    </span>
                  </div>
                );
              })}

              {/* Hit Announcement Toast Marker */}
              {recentSpot && (
                <div
                  style={{ left: `${recentSpot.x}%`, top: `${recentSpot.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-in zoom-in fade-in"
                >
                  <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-black text-xs shadow-2xl ring-4 ring-white/50 flex items-center gap-1.5">
                    <span>🎯 SPOTTED!</span>
                    <span>+{recentSpot.points} pts</span>
                  </div>
                </div>
              )}

              {/* Miss Ripple */}
              {missRipple && (
                <div
                  style={{ left: `${missRipple.x}%`, top: `${missRipple.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-slate-400/60 animate-ping" />
                </div>
              )}
            </div>
          </div>

          {/* Right: Scavenger Checklist Sidebar */}
          <div className="lg:col-span-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Items to Spy</span>
                </span>
                <span className="text-[11px] text-slate-400">Click photo to claim</span>
              </div>

              <div className="space-y-2">
                {challenge.taggedObjects.map((obj, idx) => {
                  const isFound = foundObjectIds.includes(obj.id);
                  const isHintActive = activeHintId === obj.id;

                  return (
                    <div
                      key={obj.id}
                      className={`p-2.5 rounded-xl border transition ${
                        isFound
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                              isFound
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {isFound ? '✓' : idx + 1}
                          </div>
                          <div>
                            <strong
                              className={`text-xs block ${
                                isFound ? 'line-through opacity-80' : 'text-slate-100'
                              }`}
                            >
                              {obj.name}
                            </strong>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="text-amber-400 font-bold">+{obj.points} pts</span>
                              {obj.karmaBonus && (
                                <span className="text-emerald-400">+{obj.karmaBonus} karma</span>
                              )}
                              <span>• {obj.category || 'Object'}</span>
                            </div>
                          </div>
                        </div>

                        {!isFound && obj.hint && (
                          <button
                            type="button"
                            onClick={() => setActiveHintId(isHintActive ? null : obj.id)}
                            className={`p-1 rounded-lg text-[10px] font-bold border transition ${
                              isHintActive
                                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                            }`}
                            title="Toggle Hint"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Hint Reveal */}
                      {isHintActive && !isFound && (
                        <div className="mt-2 p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-[10px] text-cyan-200 flex items-start gap-1.5 animate-in fade-in">
                          <HelpCircle className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Clue:</strong> {obj.hint}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Victory Box */}
            {isAllFound && (
              <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-emerald-950 to-indigo-950 border border-emerald-500/40 text-center space-y-2 animate-in zoom-in">
                <div className="flex items-center justify-center gap-1.5 text-emerald-300 font-black text-xs">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Challenge 100% Completed!</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  You earned <strong className="text-amber-300">+{totalPoints} points</strong> towards your tournament purse standing.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition"
                >
                  Return to Tournament Hub
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
