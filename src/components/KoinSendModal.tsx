import React, { useState } from 'react';

interface KoinSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId: string;
  onSend: (amount: number) => void;
}

export const KoinSendModal: React.FC<KoinSendModalProps> = ({ isOpen, onClose, receiverId, onSend }) => {
  const [amount, setAmount] = useState(10);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">Send KarmaKoins</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 mb-4 bg-slate-800 text-white rounded-lg"
        />
        <button
          onClick={() => onSend(amount)}
          className="w-full py-3 bg-emerald-600 rounded-xl text-white font-bold"
        >
          Send KarmaKoins
        </button>
        <button onClick={onClose} className="w-full py-2 text-slate-400">Cancel</button>
      </div>
    </div>
  );
};
