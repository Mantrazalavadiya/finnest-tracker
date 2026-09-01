import React, { useState } from 'react';
import { X, Target } from 'lucide-react';

export default function AddGoalModal({ isOpen, onClose, onAddGoal }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount || !targetDate) return;

    const newGoal = {
      id: `goal_${Date.now()}`,
      name: name.trim(),
      badge: name.trim().slice(0, 10),
      icon: 'Target',
      targetAmount: Number(targetAmount),
      targetDate: targetDate
    };

    onAddGoal(newGoal);
    setName('');
    setTargetAmount('');
    setTargetDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Create New Goal</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-100 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Goal Name</label>
            <input
              type="text"
              placeholder="e.g. Dream Bike, Laptop, Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Target Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Target Deadline</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-slate-900 text-white font-bold text-xs py-3 rounded-xl active:scale-95 shadow-md shadow-slate-300"
          >
            Create Goal
          </button>
        </form>
      </div>
    </div>
  );
}