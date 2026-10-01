import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Compass,
  CheckCircle,
  Flame,
  Award,
  Layers,
  HelpCircle,
  Bot,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { ScavengerItem, GoodDeedAction } from '../types';
import { sounds } from '../utils/audio';
import { compressImageDataUrl } from '../utils/storage';

interface ItemClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ScavengerItem[];
  goodDeeds: GoodDeedAction[];
  initialSelectedItem?: ScavengerItem | null;
  onClaimSubmitted: (claimData: {
    item: ScavengerItem;
    goodDeed?: GoodDeedAction;
    notes: string;
    proofMediaUrl: string;
    pointsEarned: number;
    karmaEarned: number;
    totalEarned: number;
  }) => void;
}

export const ItemClaimModal: React.FC<ItemClaimModalProps> = ({
  isOpen,
  onClose,
  items,
  goodDeeds,
  initialSelectedItem,
  onClaimSubmitted
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(
    initialSelectedItem?.id || items?.[0]?.id || ''
  );
  const [selectedDeedId, setSelectedDeedId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [proofMediaUrl, setProofMediaUrl] = useState<string>(
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80'
  );
  const [isVerifyingWithAI, setIsVerifyingWithAI] = useState(false);
  const [aiVerdict, setAiVerdict] = useState<{
    verified: boolean;
    confidence: number;
    feedback: string;
    detectedObjects: string[];
    suggestedBonusPoints: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialSelectedItem?.id) {
      setSelectedItemId(initialSelectedItem.id);
    } else if (items?.[0]?.id && !selectedItemId) {
      setSelectedItemId(items[0].id);
    }
  }, [initialSelectedItem, items]);

  if (!isOpen) return null;

  const selectedItem = items.find((i) => i.id === selectedItemId) || items?.[0];
  const selectedDeed = goodDeeds.find((d) => d.id === selectedDeedId);

  // Scoring calculation with optional Gemini Vision bonus
  const baseItemPoints = selectedItem ? selectedItem.basePoints : 0;
  const baseKarmaPoints = selectedDeed ? selectedDeed.baseKarmaPoints : 0;
  const karmaMultiplier = selectedDeed ? selectedDeed.multiplierBoost : 1.0;
  const aiBonus = aiVerdict ? aiVerdict.suggestedBonusPoints : 0;
  const totalEarned = Math.round((baseItemPoints + baseKarmaPoints) * karmaMultiplier) + aiBonus;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImageDataUrl(file, 800, 800, 0.7);
      if (compressed) {
        setProofMediaUrl(compressed);
        sounds.playCameraShutter();
        setAiVerdict(null); // Reset verdict for new photo
      }
    }
  };

  const handleGeminiVerify = async () => {
    if (!selectedItem || !proofMediaUrl) return;
    setIsVerifyingWithAI(true);

    try {
      const response = await fetch('/api/gemini/verify-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: proofMediaUrl,
          itemName: selectedItem.name,
          itemCategory: selectedItem.category,
          itemDescription: selectedItem.description,
          goodDeedTitle: selectedDeed?.title,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAiVerdict(result);
        if (result.verified) {
          sounds.playPurseJackpot();
        } else {
          sounds.playKarmaChime();
        }
      }
    } catch (err) {
      console.error('AI verification failed:', err);
    } finally {
      setIsVerifyingWithAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    sounds.playItemFound();
    onClaimSubmitted({
      item: selectedItem,
      goodDeed: selectedDeed,
      notes: notes || (aiVerdict ? `[Gemini Vision Verified ${aiVerdict.confidence}%] ${aiVerdict.feedback}` : `Spotted ${selectedItem.name}!`),
      proofMediaUrl,
      pointsEarned: baseItemPoints + aiBonus,
      karmaEarned: baseKarmaPoints,
      totalEarned
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Log Found Item / I-Spy Discovery</h2>
              <p className="text-xs text-slate-400">Attach photo/video proof & bundle a Good Deed for a Karma multiplier!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Select Item */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Select Scavenger Item Discovered</span>
              <span className="text-[10px] text-cyan-400 font-semibold">{items.length} items in catalog</span>
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.rarity.toUpperCase()}] {item.name} ({item.basePoints} pts) - {item.category}
                </option>
              ))}
            </select>
          </div>

          {/* Item details card */}
          {selectedItem && (
            <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{selectedItem.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold uppercase">
                    {selectedItem.rarity}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">{selectedItem.description}</p>
                {selectedItem.hint && (
                  <p className="text-amber-300/80 text-[10px] mt-1 italic">💡 Hint: {selectedItem.hint}</p>
                )}
              </div>
            </div>
          )}

          {/* Bundle Good Deed (Optional for Karma Boost) */}
          <div className="p-4 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Bundle a Good Deed for Multiplier Bonus?</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                Optional Karma Boost
              </span>
            </div>

            <select
              value={selectedDeedId}
              onChange={(e) => setSelectedDeedId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- No Good Deed (Base Points Only) --</option>
              {goodDeeds.map((deed) => (
                <option key={deed.id} value={deed.id}>
                  [{deed.tier}] {deed.title} (+{deed.baseKarmaPoints} karma | {deed.multiplierBoost}x multiplier)
                </option>
              ))}
            </select>

            {selectedDeed && (
              <div className="text-[11px] text-emerald-300/90 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/20">
                <div className="font-bold flex items-center justify-between">
                  <span>{selectedDeed.title}</span>
                  <span className="text-amber-300 font-black">{selectedDeed.multiplierBoost}x Boost</span>
                </div>
                <p className="text-slate-300 text-[10px] mt-0.5">{selectedDeed.description}</p>
              </div>
            )}
          </div>

          {/* Proof Media Preview & Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Proof Photo or Video Proof
            </label>
            <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center group">
              {proofMediaUrl ? (
                <img
                  src={proofMediaUrl}
                  alt="Item proof"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-400 text-xs">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>Upload or take a photo</span>
                </div>
              )}

              {/* Upload Overlay Button */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-md flex items-center gap-2 hover:bg-slate-100"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Gemini Vision AI Referee Trigger & Results */}
            <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      Gemini Vision Referee
                      <span className="text-[9px] uppercase px-1.5 py-0.2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-extrabold rounded">AI</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block">Scan photo for instant verification & up to +50 bonus karma</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGeminiVerify}
                  disabled={isVerifyingWithAI || !proofMediaUrl}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-md disabled:opacity-50 transition cursor-pointer"
                >
                  {isVerifyingWithAI ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{aiVerdict ? 'Re-Scan Photo' : 'Scan with Gemini'}</span>
                    </>
                  )}
                </button>
              </div>

              {aiVerdict && (
                <div className="mt-3 pt-3 border-t border-indigo-500/20 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold">
                      {aiVerdict.verified ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Verified ({aiVerdict.confidence}% Confidence)</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-400">Uncertain Match ({aiVerdict.confidence}%)</span>
                        </>
                      )}
                    </div>
                    {aiVerdict.suggestedBonusPoints > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] border border-amber-500/30">
                        +{aiVerdict.suggestedBonusPoints} AI Quality Bonus
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    "{aiVerdict.feedback}"
                  </p>
                  {aiVerdict.detectedObjects && aiVerdict.detectedObjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {aiVerdict.detectedObjects.map((obj, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[9px] font-medium rounded-md border border-slate-700">
                          🎯 {obj}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes / Context */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Location Notes & Hunter Story
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. Found on 4th & Pine street outside the flower boutique..."
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Live Score Summary Preview */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Tournament Points Yield</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-amber-400">+{totalEarned} pts</span>
                {karmaMultiplier > 1 && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    {karmaMultiplier}x Karma Boost
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-rose-600 hover:from-cyan-500 hover:to-rose-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition transform hover:scale-[1.02]"
            >
              Submit Item Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
