import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface KoinPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KoinPurchaseModal: React.FC<KoinPurchaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePurchase = async (amount: number) => {
    const response = await fetch('/api/karmakoins/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">Buy KarmaKoins</h2>
        <div className="space-y-3">
          {[10, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => handlePurchase(amount)}
              className="w-full py-3 bg-indigo-600 rounded-xl text-white font-bold"
            >
              Buy {amount} KarmaKoins for ${amount}
            </button>
          ))}
          <button onClick={onClose} className="w-full py-2 text-slate-400">Cancel</button>
        </div>
      </div>
    </div>
  );
};
