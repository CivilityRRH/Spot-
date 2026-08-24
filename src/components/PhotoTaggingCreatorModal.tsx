import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Tag,
  HelpCircle,
  Trophy,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Plus,
  Eye,
  Crosshair,
  Layers,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { PhotoChallenge, TaggedObject, Tournament, UserProfile } from '../types';
import { PRESET_SCENE_TEMPLATES } from '../data/mockData';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

import { compressImageDataUrl } from '../utils/storage';

interface PhotoTaggingCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  tournaments?: Tournament[];
  activeTournamentId?: string;
  onCreateChallenge: (newChallenge: PhotoChallenge) => void;
}

export const PhotoTaggingCreatorModal: React.FC<PhotoTaggingCreatorModalProps> = ({
  isOpen,
  onClose,
  user,
  tournaments = [],
  activeTournamentId,
  onCreateChallenge
}) => {
  const [step, setStep] = useState<'select_image' | 'tag_objects' | 'review'>('select_image');
  const [imageUrl, setImageUrl] = useState(PRESET_SCENE_TEMPLATES[0]?.url || 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=1200&auto=format&fit=crop&q=80');
  const [sceneCategory, setSceneCategory] = useState<PhotoChallenge['sceneCategory']>('Vintage Desk');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tournamentId, setTournamentId] = useState(activeTournamentId || tournaments?.[0]?.id || 'tourn_grand_spring_2026');

  // Tagged objects
  const [taggedObjects, setTaggedObjects] = useState<TaggedObject[]>([]);
  const [activePin, setActivePin] = useState<{ x: number; y: number } | null>(null);

  // New object form
  const [objectName, setObjectName] = useState('');
  const [objectPoints, setObjectPoints] = useState<number>(50);
  const [objectCategory, setObjectCategory] = useState('Household');
  const [objectHint, setObjectHint] = useState('');
  const [objectRadius, setObjectRadius] = useState<number>(7); // percentage
  const [objectKarmaBonus, setObjectKarmaBonus] = useState<number>(15);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setActivePin({
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1))
    });
    sounds.playCameraShutter();
  };

  const handleAddObject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePin || !objectName.trim()) return;

    const newObj: TaggedObject = {
      id: `obj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: objectName.trim(),
      x: activePin.x,
      y: activePin.y,
      radius: objectRadius,
      points: objectPoints,
      hint: objectHint.trim() || undefined,
      category: objectCategory,
      rarity: objectPoints >= 100 ? 'legendary' : objectPoints >= 70 ? 'rare' : 'common',
      karmaBonus: objectKarmaBonus > 0 ? objectKarmaBonus : undefined
    };

    setTaggedObjects([...taggedObjects, newObj]);
    sounds.playItemFound();

    // Reset form
    setObjectName('');
    setObjectHint('');
    setActivePin(null);
  };

  const handleRemoveObject = (id: string) => {
    setTaggedObjects(taggedObjects.filter((o) => o.id !== id));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImageDataUrl(file, 1000, 1000, 0.7);
      if (compressed) {
        setImageUrl(compressed);
        setStep('tag_objects');
      }
    }
  };

  const handlePublish = () => {
    if (taggedObjects.length === 0 || !title.trim()) return;

    const newChallenge: PhotoChallenge = {
      id: `challenge_${Date.now()}`,
      tournamentId,
      title: title.trim(),
      description: description.trim() || `Can you spot the ${taggedObjects.length} hidden items in this scene?`,
      imageUrl,
      sceneCategory,
      creatorId: user.id,
      creatorName: user.name,
      creatorAvatar: user.avatar,
      createdAt: 'Just now',
      taggedObjects,
      completedByUserIds: [],
      foundObjectsByUser: {}
    };

    sounds.playKarmaChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onCreateChallenge(newChallenge);
    onClose();
  };

  const totalPoints = taggedObjects.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-7 space-y-4 max-h-[94vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg text-white">Create I-Spy Photo Challenge</h2>
              <p className="text-xs text-slate-400">
                Upload or select a photo, tag hidden objects with pins, and challenge tournament players.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Navigation Step Indicators */}
        <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setStep('select_image')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              step === 'select_image' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>1. Choose Image</span>
          </button>

          <button
            onClick={() => setStep('tag_objects')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              step === 'tag_objects' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>2. Tag Objects ({taggedObjects.length})</span>
          </button>

          <button
            onClick={() => {
              if (taggedObjects.length > 0) setStep('review');
            }}
            disabled={taggedObjects.length === 0}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              step === 'review'
                ? 'bg-indigo-600 text-white shadow'
                : taggedObjects.length === 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Review & Publish</span>
          </button>
        </div>

        {/* STEP 1: Select Image */}
        {step === 'select_image' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preset HD Scenes */}
              <div className="space-y-3">
                <span className="font-bold text-slate-200 block">Choose Curated 4K I-Spy Scene</span>
                <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {PRESET_SCENE_TEMPLATES.map((tmpl, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setImageUrl(tmpl.url);
                        setSceneCategory(tmpl.category);
                        if (!title) setTitle(tmpl.title);
                      }}
                      className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition group ${
                        imageUrl === tmpl.url
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img src={tmpl.url} alt={tmpl.title} className="w-full h-24 object-cover group-hover:scale-105 transition" />
                      <div className="p-2 bg-slate-950/90 text-[10px]">
                        <strong className="text-slate-100 block truncate">{tmpl.title}</strong>
                        <span className="text-slate-400">{tmpl.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Image Option */}
              <div className="space-y-3 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-200 block mb-2">Or Upload Custom Photo / Scene</span>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl bg-slate-950/60 cursor-pointer transition text-center group">
                    <Upload className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition mb-2" />
                    <span className="font-bold text-slate-200 text-xs">Click to browse or drop image file</span>
                    <span className="text-[11px] text-slate-500 mt-1">Supports high-res PNG, JPG, WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Or Paste Image Web URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep('tag_objects')}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition"
                  >
                    <span>Proceed to Tag Objects</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Interactive Object Tagging Canvas */}
        {step === 'tag_objects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
            {/* Left: Image Canvas with Click-to-Pin */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Click anywhere on the photo to place a target pin</span>
                </span>
                <span>{taggedObjects.length} objects tagged</span>
              </div>

              <div
                ref={imageContainerRef}
                onClick={handleImageClick}
                className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700 cursor-crosshair select-none shadow-inner"
              >
                <img
                  src={imageUrl}
                  alt="I-Spy Scene"
                  className="w-full h-full object-cover pointer-events-none"
                />

                {/* Already Tagged Objects Markers */}
                {taggedObjects.map((obj, idx) => (
                  <div
                    key={obj.id}
                    style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/90 text-white font-black text-[10px] flex items-center justify-center shadow-lg ring-2 ring-white animate-pulse">
                      {idx + 1}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block whitespace-nowrap px-2 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold shadow-xl border border-slate-700 z-10">
                      {obj.name} (+{obj.points} pts)
                    </div>
                  </div>
                ))}

                {/* Active Pending Pin Marker */}
                {activePin && (
                  <div
                    style={{ left: `${activePin.x}%`, top: `${activePin.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center ring-4 ring-rose-400/40 animate-bounce">
                      🎯
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap px-2 py-0.5 rounded bg-rose-950 text-rose-200 text-[9px] font-bold border border-rose-500">
                      New Spot ({activePin.x}%, {activePin.y}%)
                    </div>
                  </div>
                )}
              </div>

              {/* Tagged Items Horizontal Chips */}
              <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto pt-1">
                {taggedObjects.map((obj, idx) => (
                  <div
                    key={obj.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200 text-[11px]"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-[9px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{obj.name}</span>
                    <span className="text-amber-400 font-bold">+{obj.points}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveObject(obj.id);
                      }}
                      className="text-slate-400 hover:text-rose-400 ml-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Object Tag Details Form */}
            <div className="lg:col-span-5 space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-rose-400" />
                  <span>Define Object Details</span>
                </span>
                {activePin ? (
                  <span className="text-[10px] text-emerald-400 font-bold">Pin Placed!</span>
                ) : (
                  <span className="text-[10px] text-slate-400">Click photo to pin</span>
                )}
              </div>

              <form onSubmit={handleAddObject} className="space-y-2.5">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Object Name / Target</label>
                  <input
                    type="text"
                    value={objectName}
                    onChange={(e) => setObjectName(e.target.value)}
                    placeholder="E.g. Antique Brass Hourglass, Hidden Red Cat"
                    disabled={!activePin}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Points (10 - 200)</label>
                    <input
                      type="number"
                      min={10}
                      max={200}
                      step={5}
                      value={objectPoints}
                      onChange={(e) => setObjectPoints(Number(e.target.value))}
                      disabled={!activePin}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Karma Bonus</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      step={5}
                      value={objectKarmaBonus}
                      onChange={(e) => setObjectKarmaBonus(Number(e.target.value))}
                      disabled={!activePin}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 font-bold text-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={objectCategory}
                    onChange={(e) => setObjectCategory(e.target.value)}
                    disabled={!activePin}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Household">Household & Vintage</option>
                    <option value="Nature & Park">Nature & Botanical</option>
                    <option value="Urban & Street">Urban & Street Art</option>
                    <option value="Work & School">Work & Study</option>
                    <option value="Kindness & Community">Kindness & Community</option>
                    <option value="Food & Drink">Food & Cafe</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Clue / Hint (Optional)</label>
                  <input
                    type="text"
                    value={objectHint}
                    onChange={(e) => setObjectHint(e.target.value)}
                    placeholder="E.g. Look closely at the upper shelf shadow"
                    disabled={!activePin}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!activePin || !objectName.trim()}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-extrabold shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Object Tag Pin</span>
                  </button>
                </div>
              </form>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Total Points: <strong className="text-amber-400">{totalPoints} pts</strong></span>
                <button
                  type="button"
                  disabled={taggedObjects.length === 0}
                  onClick={() => setStep('review')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold transition flex items-center gap-1"
                >
                  <span>Next: Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Publish */}
        {step === 'review' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Challenge Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. Antique Library: The Hidden Loupe & Hourglass"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-bold focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Assign to Tournament</label>
                  <select
                    value={tournamentId}
                    onChange={(e) => setTournamentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-bold focus:outline-none focus:border-indigo-500"
                  >
                    {(tournaments || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.isPrivate ? 'Private' : 'Public'} • ${t.totalPurse} Purse)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Challenge Clues & Lore</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Give hunters a fun riddle or background context..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="font-extrabold text-sm text-white block">Challenge Summary</span>
                <div className="flex items-center gap-3">
                  <img src={imageUrl} alt="Preview" className="w-20 h-14 rounded-xl object-cover ring-1 ring-slate-700 shrink-0" />
                  <div>
                    <strong className="text-slate-100 block">{title || 'Untitled Challenge'}</strong>
                    <span className="text-slate-400 text-[11px]">{sceneCategory} • {taggedObjects.length} Tagged Objects</span>
                    <span className="text-amber-400 font-bold text-[11px] block">{totalPoints} Max Scavenger Points</span>
                  </div>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {taggedObjects.map((obj, i) => (
                    <div key={obj.id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                      <span className="text-slate-200">{i + 1}. {obj.name}</span>
                      <span className="text-amber-400 font-bold">+{obj.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep('tag_objects')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
              >
                Back to Tagging
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={!title.trim() || taggedObjects.length === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-rose-600 hover:from-emerald-500 hover:to-rose-500 text-white font-extrabold shadow-lg shadow-indigo-600/30 transition transform hover:scale-[1.02]"
              >
                Publish Challenge to Tournament
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
