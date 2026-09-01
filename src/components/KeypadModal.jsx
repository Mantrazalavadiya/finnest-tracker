import React, { useState } from 'react';
import { Smartphone, Banknote, X, Delete } from 'lucide-react';

export default function KeypadModal({
  isOpen,
  onClose,
  activeBadge,
  totalOnline,
  totalCash,
  onSubmit
}) {
  const [actionType, setActionType] = useState('deposit');
  const [walletType, setWalletType] = useState('online');
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleKeypadPress = (digit) => {
    if (amountStr.length >= 7) return;
    setAmountStr((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = Number(amountStr);
    if (!val || val <= 0) return;

    if (actionType === 'withdraw') {
      const available = walletType === 'cash' ? totalCash : totalOnline;
      if (val > available) {
        alert(`Insufficient balance in ${walletType === 'cash' ? 'Cash' : 'Online'}! Available: ₹${available.toLocaleString()}`);
        return;
      }
    }

    onSubmit({
      amount: val,
      action: actionType,
      type: walletType,
      note: note.trim() || (actionType === 'deposit' ? 'Added savings' : 'Withdrawal')
    });

    setAmountStr('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="w-full max-w-md bg-white border-t border-slate-200 rounded-t-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActionType('deposit')}
              className={`px-3 py-1 text-xs font-bold rounded-lg ${actionType === 'deposit' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
            >
              Deposit (+)
            </button>
            <button
              type="button"
              onClick={() => setActionType('withdraw')}
              className={`px-3 py-1 text-xs font-bold rounded-lg ${actionType === 'withdraw' ? 'bg-rose-600 text-white' : 'text-slate-500'}`}
            >
              Withdraw (−)
            </button>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-100 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Amount Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Amount ({activeBadge})</span>
          <div className="text-3xl font-black text-slate-900 mt-0.5">
            <span className="text-indigo-600 mr-1 text-2xl">₹</span>
            {amountStr ? Number(amountStr).toLocaleString() : '0'}
          </div>
        </div>

        {/* Wallet Selection */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setWalletType('online')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
              walletType === 'online' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Online (₹{totalOnline.toLocaleString()})
          </button>
          <button
            type="button"
            onClick={() => setWalletType('cash')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
              walletType === 'cash' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" /> Cash (₹{totalCash.toLocaleString()})
          </button>
        </div>

        {/* 3x4 Number Keypad */}
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeypadPress(digit)}
              className="bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-lg py-2.5 rounded-xl"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmountStr('')}
            className="bg-amber-50 active:bg-amber-100 text-amber-700 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center"
          >
            CLR
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            className="bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-lg py-2.5 rounded-xl"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => setAmountStr((prev) => prev.slice(0, -1))}
            className="bg-rose-50 active:bg-rose-100 text-rose-600 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Note (e.g. UPI transfer, market cash)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!amountStr || Number(amountStr) <= 0}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white transition active:scale-95 disabled:opacity-40 ${
            actionType === 'deposit' ? 'bg-slate-900' : 'bg-rose-600'
          }`}
        >
          Confirm {actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
        </button>
      </div>
    </div>
  );
}