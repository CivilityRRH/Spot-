import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Lock,
  Globe,
  DollarSign,
  Users,
  ShieldCheck,
  Sparkles,
  PlusCircle,
  Clock,
  Key,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Tournament, UserProfile } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onCreateTournament: (newTournament: Tournament) => void;
}

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  isOpen,
  onClose,
  user,
  onCreateTournament
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [inviteCode, setInviteCode] = useState(`SPY-${Math.floor(1000 + Math.random() * 9000)}`);
  const [buyInFee, setBuyInFee] = useState<number>(25);
  const [sponsorBonus, setSponsorBonus] = useState<number>(500);
  const [maxPlayers, setMaxPlayers] = useState<number>(200);

  // Dates
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const defaultEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Custom Rules
  const [rules, setRules] = useState<string[]>([
    'All discovered items require photo or video proof with timestamp.',
    'Verified Good Deeds multiply item scores by 1.25x - 2.5x.',
    'Everyone plays for themselves; winning squad earns a bonus purse split.'
  ]);
  const [newRule, setNewRule] = useState('');

  if (!isOpen) return null;

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, newRule.trim()]);
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const initialPot = buyInFee * 1 + sponsorBonus; // Host is 1st player + sponsor

    const newTourney: Tournament = {
      id: `tourn_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      buyInFee,
      totalPurse: initialPot,
      playersCount: 1, // Host joined
      squadsCount: 1,
      startTime: new Date(startDate).toISOString(),
      endsAt: new Date(endDate).toISOString(),
      status: 'active',
      isPrivate,
      inviteCode: isPrivate ? inviteCode.trim().toUpperCase() : undefined,
      maxPlayers,
      creatorId: user.id,
      creatorName: `${user.name} (Host)`,
      sponsorBonus,
      rules: rules.length > 0 ? rules : ['Standard KarmaSpy Fair Play rules apply.'],
      prizeSplit: {
        firstPlace: Math.round(initialPot * 0.5),
        secondPlace: Math.round(initialPot * 0.25),
        thirdPlace: Math.round(initialPot * 0.15),
        topKarmaDeedHero: Math.round(initialPot * 0.1),
        topSquadPurse: Math.round(initialPot * 0.08)
      },
      joinedPlayerIds: [user.id],
      challengesCount: 0
    };

    sounds.playPurseJackpot();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    onCreateTournament(newTourney);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg text-white">Create New I-Spy Tournament</h2>
              <p className="text-xs text-slate-400">
                Define tournament rules, purse buy-in jackpot, and privacy access.
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Tournament Name & Description */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">Tournament Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Downtown Metro Hidden Relics & Kindness Derby"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Tournament Description & Mission</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the themes, target items to hunt, and good deeds to prioritize..."
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* Privacy & Access Settings */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-black text-sm text-slate-100 block">Privacy & Access Setting</span>
                <span className="text-slate-400 text-[11px]">
                  Public tournaments are listed in the browser; Private tournaments require an invitation code.
                </span>
              </div>
              <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsPrivate(false)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                    !isPrivate ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrivate(true)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                    isPrivate ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private</span>
                </button>
              </div>
            </div>

            {isPrivate && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-slate-300">Invite Code:</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="px-3 py-1.5 bg-slate-900 border border-amber-500/50 rounded-xl text-amber-300 font-mono font-black text-center text-sm tracking-wider focus:outline-none focus:border-amber-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setInviteCode(`SPY-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Schedule (Start & End) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Start Date & Time</span>
                </span>
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>End Date & Time</span>
                </span>
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>

          {/* Financials / Purse Jackpot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Player Buy-In Fee ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={buyInFee}
                  onChange={(e) => setBuyInFee(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Sponsor Seed Bonus ($)</label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="number"
                  min={0}
                  max={10000}
                  value={sponsorBonus}
                  onChange={(e) => setSponsorBonus(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Max Players Cap</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min={2}
                  max={1000}
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Tournament Rules List */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">Custom Tournament Rules</label>
            <div className="space-y-1.5 mb-2">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{rule}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Add custom rule bullet point..."
                className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRule();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700"
              >
                Add Rule
              </button>
            </div>
          </div>

          {/* Host Commitment Note */}
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Host Guarantee:</strong> You will be registered automatically as the host. The initial tournament purse pot will start at{' '}
              <strong className="text-amber-300 font-bold">${buyInFee + sponsorBonus} USD</strong>.
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold shadow-lg shadow-rose-600/30 transition transform hover:scale-[1.02]"
            >
              Publish & Launch Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
