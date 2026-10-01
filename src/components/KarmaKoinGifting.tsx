import React, { useState } from 'react';
import { KoinPurchaseModal } from './KoinPurchaseModal';
import { DollarSign } from 'lucide-react';
import { UserProfile } from '../types';

interface KarmaKoinGiftingProps {
  user: UserProfile;
}

export const KarmaKoinGifting: React.FC<KarmaKoinGiftingProps> = ({ user }) => {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-emerald-400">
          <DollarSign className="w-5 h-5" />
          <span className="font-bold text-sm">KarmaKoins Balance</span>
        </div>
        <span className="font-black text-white text-lg">{user.karmaKoins || 0}</span>
      </div>
      <button
        onClick={() => setIsPurchaseModalOpen(true)}
        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-bold text-sm transition"
      >
        Purchase More KarmaKoins
      </button>
      <KoinPurchaseModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} />
    </div>
  );
};
