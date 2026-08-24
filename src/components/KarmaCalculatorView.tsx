import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  Flame,
  Award,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  HeartHandshake,
  Layers,
  Zap,
  Plus
} from 'lucide-react';
import { GoodDeedAction, UserProfile, ScavengerItem } from '../types';
import { sounds } from '../utils/audio';

interface KarmaCalculatorViewProps {
  goodDeeds: GoodDeedAction[];
  user: UserProfile;
  onLogGoodDeed: (deed: GoodDeedAction, impactTier: string, witnessBonus: boolean, notes: string) => void;
  availableItems: ScavengerItem[];
}

export const KarmaCalculatorView: React.FC<KarmaCalculatorViewProps> = ({
  goodDeeds,
  user,
  onLogGoodDeed,
  availableItems
}) => {
  const [selectedDeedId, setSelectedDeedId] = useState<string>(goodDeeds?.[0]?.id || '');
  const [impactScale, setImpactScale] = useState<'individual' | 'neighborhood' | 'community_hero'>('neighborhood');
  const [hasVideoProof, setHasVideoProof] = useState<boolean>(true);
  const [hasWitnessConfirmation, setHasWitnessConfirmation] = useState<boolean>(true);
  const [bundledItemId, setBundledItemId] = useState<string>('');
  const [customDeedNotes, setCustomDeedNotes] = useState('');

  const selectedDeed = goodDeeds.find((d) => d.id === selectedDeedId) || goodDeeds?.[0];
  const bundledItem = availableItems.find((i) => i.id === bundledItemId);

  // Dynamic Calculation Engine
  const baseDeedKarma = selectedDeed ? selectedDeed.baseKarmaPoints : 100;
  let impactMultiplier = 1.0;
  if (impactScale === 'individual') impactMultiplier = 1.0;
  if (impactScale === 'neighborhood') impactMultiplier = 1.25;
  if (impactScale === 'community_hero') impactMultiplier = 1.6;

  const proofBonus = (hasVideoProof ? 1.2 : 1.0) * (hasWitnessConfirmation ? 1.15 : 1.0);
  const totalKarmaYield = Math.round(baseDeedKarma * impactMultiplier * proofBonus);

  const baseItemPoints = bundledItem ? bundledItem.basePoints : 0;
  const synergyMultiplier = selectedDeed ? selectedDeed.multiplierBoost : 1.25;
  const combinedTournamentScore = Math.round((baseItemPoints + totalKarmaYield) * synergyMultiplier);

  const handleExecuteLog = () => {
    if (!selectedDeed) return;
    sounds.playKarmaChime();
    onLogGoodDeed(selectedDeed, impactScale, hasWitnessConfirmation, customDeedNotes);
    setCustomDeedNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                Karma Scoring Engine
              </span>
              <span className="text-xs text-slate-300 font-bold">
                Your Balance: {user.karmaPoints} Karma Pts
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Good Karma & Deeds Action Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              KarmaSpy factors real kindness into your tournament purse rank. Calculate deed multiplier boosts, witness multipliers, and live I-Spy item synergies.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Deeds Logged</span>
            <span className="text-2xl font-black text-white">{user.goodDeedsLogged} Acts</span>
          </div>
        </div>
      </div>

      {/* Interactive Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Configure Good Deed Parameters</span>
            </div>
            <span className="text-xs text-slate-400">Live Formula Simulator</span>
          </div>

          {/* Select Good Deed */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Select Good Deed Action
            </label>
            <select
              value={selectedDeedId}
              onChange={(e) => setSelectedDeedId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {goodDeeds.map((deed) => (
                <option key={deed.id} value={deed.id}>
                  [{deed.tier}] {deed.title} (Base: {deed.baseKarmaPoints} karma | {deed.multiplierBoost}x multiplier)
                </option>
              ))}
            </select>
          </div>

          {/* Impact Tier Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Impact & Community Reach Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'individual', label: '1-on-1 Assist', mult: '1.0x', desc: 'Direct personal favor' },
                { id: 'neighborhood', label: 'Neighborhood', mult: '1.25x', desc: 'Local park / street cleanup' },
                { id: 'community_hero', label: 'Community Hero', mult: '1.6x', desc: 'Public food/blood drive' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setImpactScale(tier.id as any)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    impactScale === tier.id
                      ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-black">
                    <span>{tier.label}</span>
                    <span className="text-emerald-400">{tier.mult}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{tier.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Verification Multipliers */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Verification & Anti-Cheat Proofs
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer hover:border-slate-600 transition">
                <input
                  type="checkbox"
                  checked={hasVideoProof}
                  onChange={(e) => setHasVideoProof(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700"
                />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Live / Video Proof Attached</span>
                  <span className="text-[10px] text-emerald-400">+20% Multiplier Boost</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer hover:border-slate-600 transition">
                <input
                  type="checkbox"
                  checked={hasWitnessConfirmation}
                  onChange={(e) => setHasWitnessConfirmation(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700"
                />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Witness / Community Vote</span>
                  <span className="text-[10px] text-emerald-400">+15% Multiplier Boost</span>
                </div>
              </label>
            </div>
          </div>

          {/* Optional Item Pairing for Synergy */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Bundle Found Everyday Item (Synergy Bonus)</span>
              <span className="text-[10px] text-amber-400 font-semibold">Dual Hunt Combo</span>
            </label>
            <select
              value={bundledItemId}
              onChange={(e) => setBundledItemId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- No Item Bundled (Pure Good Deed) --</option>
              {availableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.rarity}] {item.name} (+{item.basePoints} pts)
                </option>
              ))}
            </select>
          </div>

          {/* Deed Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Deed Story & Log Summary
            </label>
            <input
              type="text"
              value={customDeedNotes}
              onChange={(e) => setCustomDeedNotes(e.target.value)}
              placeholder="E.g. Helped a neighbor carry groceries upstairs..."
              className="w-full px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Calculation Output & Log Action (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-400 mb-4">
              <Zap className="w-4 h-4" />
              <span>Calculated Tournament Breakdown</span>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 text-xs bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-300">
                <span>Base Karma Action:</span>
                <span className="font-bold text-white">+{baseDeedKarma} pts</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Impact Scale Multiplier:</span>
                <span className="font-bold text-emerald-400">{impactMultiplier.toFixed(2)}x</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Proof & Witness Boost:</span>
                <span className="font-bold text-emerald-400">{proofBonus.toFixed(2)}x</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-slate-200">
                <span>Total Karma Yield:</span>
                <span className="text-emerald-300 text-sm font-black">+{totalKarmaYield} Karma</span>
              </div>

              {bundledItem && (
                <>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-cyan-300">
                    <span>Bundled Item ({bundledItem.name}):</span>
                    <span className="font-bold">+{baseItemPoints} pts</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-300">
                    <span>Synergy Multiplier:</span>
                    <span className="font-bold">{synergyMultiplier}x</span>
                  </div>
                </>
              )}
            </div>

            {/* Big Total Output Card */}
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-tr from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/40 text-center">
              <span className="text-[11px] uppercase font-black tracking-wider text-amber-400">
                Projected Tournament Score Addition
              </span>
              <div className="text-3xl font-black text-amber-300 mt-1">
                +{bundledItem ? combinedTournamentScore : totalKarmaYield} Pts
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Directly boosts your individual leaderboard purse standing & team multiplier!
              </p>
            </div>
          </div>

          {/* Log Deed Button */}
          <button
            onClick={handleExecuteLog}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Log Verified Good Deed (+{totalKarmaYield} Karma)</span>
          </button>
        </div>
      </div>

      {/* Good Deeds Catalog Directory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-400" />
          <span>Official Good Deeds & Karma Multipliers Catalog</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {goodDeeds.map((deed) => (
            <div
              key={deed.id}
              onClick={() => setSelectedDeedId(deed.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedDeedId === deed.id
                  ? 'bg-emerald-950/50 border-emerald-500 shadow-md'
                  : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-emerald-500/30">
                  {deed.tier}
                </span>
                <span className="text-xs font-black text-amber-400">
                  {deed.multiplierBoost}x Boost
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-100 mb-1">{deed.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{deed.description}</p>
              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-300">
                <span>Base Karma:</span>
                <strong className="text-emerald-300">+{deed.baseKarmaPoints} pts</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
