import React, { useState } from 'react';
import {
  FileQuestion,
  PlusCircle,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertTriangle,
  Send
} from 'lucide-react';
import { CustomItemRequest, ScavengerItem } from '../types';
import { sounds } from '../utils/audio';

interface CustomRequestsViewProps {
  requests: CustomItemRequest[];
  onVoteRequest: (requestId: string, vote: 'up' | 'down') => void;
  onSubmitNewRequest: (data: {
    itemName: string;
    category: ScavengerItem['category'];
    suggestedPoints: number;
    description: string;
    maxAllowedFinders: number;
    expiresInHours: number;
  }) => void;
  onAdminApprove: (requestId: string) => void;
}

export const CustomRequestsView: React.FC<CustomRequestsViewProps> = ({
  requests,
  onVoteRequest,
  onSubmitNewRequest,
  onAdminApprove
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ScavengerItem['category']>('Urban & Street');
  const [suggestedPoints, setSuggestedPoints] = useState<number>(75);
  const [description, setDescription] = useState('');
  const [maxAllowedFinders, setMaxAllowedFinders] = useState<number>(20);
  const [expiresInHours, setExpiresInHours] = useState<number>(48);

  const categories: ScavengerItem['category'][] = [
    'Household',
    'Urban & Street',
    'Nature & Park',
    'Work & School',
    'Kindness & Community',
    'Food & Drink',
    'Oddities & Fun'
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !description.trim()) return;

    sounds.playKarmaChime();
    onSubmitNewRequest({
      itemName: itemName.trim(),
      category,
      suggestedPoints: Math.min(250, Math.max(10, suggestedPoints)), // Enforce point limits
      description: description.trim(),
      maxAllowedFinders: Math.min(100, Math.max(1, maxAllowedFinders)),
      expiresInHours
    });

    setItemName('');
    setDescription('');
    setShowSubmitModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/70 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold uppercase tracking-wider border border-purple-500/30">
              Community Governance
            </span>
            <span className="text-xs text-slate-400 font-bold">Permissions & Limits Enforced</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Custom Item Requests & Voting
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Propose unique real-world I-Spy items for the tournament pool. Community votes and host permissions maintain balanced point limits and fair play.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition transform hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Propose Custom Item</span>
        </button>
      </div>

      {/* Requests Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Top info */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={req.requesterAvatar}
                    alt={req.requesterName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-200 block leading-tight">
                      {req.requesterName}
                    </span>
                    <span className="text-[10px] text-slate-400">Proposed {req.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-black">
                    +{req.suggestedPoints} pts
                  </span>
                  {req.status === 'approved' ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">
                      Pending Vote
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-extrabold text-sm text-slate-100 mt-2">{req.itemName}</h3>
              <span className="text-[11px] text-purple-400 font-bold block mb-1">{req.category}</span>
              <p className="text-xs text-slate-300 leading-relaxed">{req.description}</p>

              {/* Permissions & Limits badges */}
              <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Max Finders Limit: <strong>{req.maxAllowedFinders}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Duration: <strong>{req.expiresInHours}h</strong></span>
                </div>
              </div>

              {req.adminNotes && (
                <div className="mt-2 p-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-[11px] text-emerald-300">
                  <span className="font-bold">🛡️ Host Note:</span> {req.adminNotes}
                </div>
              )}
            </div>

            {/* Voting bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playKarmaChime();
                    onVoteRequest(req.id, 'up');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    req.userVoted === 'up'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{req.votesUp}</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playKarmaChime();
                    onVoteRequest(req.id, 'down');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    req.userVoted === 'down'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{req.votesDown}</span>
                </button>
              </div>

              {req.status === 'pending' && (
                <button
                  onClick={() => {
                    sounds.playKarmaChime();
                    onAdminApprove(req.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Approve Item</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for proposing custom item with limits */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-purple-400" />
                <h3 className="font-extrabold text-base text-white">Propose Custom Scavenger Item</h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Item Name / Challenge</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="E.g. Antique brass door knocker shaped like a lion"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Suggested Points (Max 250)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={250}
                    value={suggestedPoints}
                    onChange={(e) => setSuggestedPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description & Verification Criteria</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details on what makes it valid and where hunters might look..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Max Finder Limit</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={maxAllowedFinders}
                    onChange={(e) => setMaxAllowedFinders(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Expiration (Hours)</label>
                  <input
                    type="number"
                    min={6}
                    max={168}
                    value={expiresInHours}
                    onChange={(e) => setExpiresInHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-[11px] text-purple-200">
                <span>🛡️ <strong>Fair Play Rule:</strong> Custom items enter 'Pending Vote' status. Reaching +25 community upvotes or Host approval instantly injects it into the live tournament pool.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md"
                >
                  Submit for Community Vote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
