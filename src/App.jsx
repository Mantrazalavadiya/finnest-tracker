import React, { useState, useMemo, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from './supabaseClient';
import { 
  Target, 
  Plus, 
  Trash2, 
  Smartphone, 
  Banknote, 
  X, 
  Delete,
  Calendar,
  Layers,
  Laptop,
  Plane,
  ShieldAlert,
  GraduationCap,
  Home as HomeIcon,
  Car,
  HeartPulse,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Zap,
  ArrowLeftRight,
  LogOut,
  Loader2,
  Mail,
  Lock,
  RotateCcw,
  Bell,
  History,
  Settings,
  Landmark
} from 'lucide-react';

const CATEGORY_PRESETS = [
  { id: 'tech', label: 'Gadgets', icon: Laptop },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'vehicle', label: 'Vehicle', icon: Car },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'emergency', label: 'Emergency', icon: ShieldAlert },
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'health', label: 'Health', icon: HeartPulse },
  { id: 'custom', label: 'Personal', icon: Sparkles },
];

const ICON_MAP = {
  tech: Laptop,
  travel: Plane,
  vehicle: Car,
  education: GraduationCap,
  emergency: ShieldAlert,
  home: HomeIcon,
  health: HeartPulse,
  custom: Sparkles,
};

const playSound = (type) => {
  if (navigator.vibrate) navigator.vibrate(type === 'deposit' ? [20, 25] : [40]);
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'deposit' || type === 'transfer') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    }
  } catch {}
};

function AuthScreen({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data?.user) onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data?.user) onLogin(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200/80 shadow-lg rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md mb-1">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">FinTrack</h1>
          <p className="text-xs text-slate-500 font-medium">
            {isSignUp ? 'Create your personal savings dashboard' : 'Sign in to monitor your goals'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Bottom Navigation tab: 'home' | 'history' | 'goals' | 'settings'
  const [activeTab, setActiveTab] = useState('goals');

  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [txStore, setTxStore] = useState({});

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  // Standard Keypad Transaction states
  const [actionType, setActionType] = useState('deposit'); // strictly deposit | withdraw
  const [walletType, setWalletType] = useState('online');
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');

  // Transfer states
  const [transferDirection, setTransferDirection] = useState('cash_to_bank');
  const [transferAmountStr, setTransferAmountStr] = useState('');
  const [transferNote, setTransferNote] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('tech');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalStartDate, setNewGoalStartDate] = useState(todayStr);
  const [newGoalDate, setNewGoalDate] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    if (!user) return;

    try {
      const { data: goalsData, error: goalsErr } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (goalsErr) throw goalsErr;

      const formattedGoals = (goalsData || []).map((g) => ({
        id: g.id,
        name: g.name,
        badge: g.badge,
        category: g.category,
        targetAmount: Number(g.target_amount),
        startDate: g.start_date,
        targetDate: g.target_date
      }));

      setGoals(formattedGoals);

      const { data: txsData, error: txsErr } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (txsErr) throw txsErr;

      const grouped = {};
      (txsData || []).forEach((t) => {
        if (!grouped[t.goal_id]) grouped[t.goal_id] = [];
        grouped[t.goal_id].push({
          id: t.id,
          amount: Number(t.amount),
          action: t.action,
          type: t.type,
          note: t.note,
          date: t.date,
          created_at: t.created_at
        });
      });

      setTxStore(grouped);
    } catch (err) {
      console.error('Data sync failed:', err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setGoals([]);
      setTxStore({});
      setSelectedGoalId(null);
    }
  }, [user]);

  useEffect(() => {
    if (goals.length === 0) {
      setSelectedGoalId(null);
    } else if (!goals.some((g) => g.id === selectedGoalId)) {
      setSelectedGoalId(goals[0].id);
    }
  }, [goals, selectedGoalId]);

  const activeGoal = useMemo(() => {
    return goals.find((g) => g.id === selectedGoalId) || null;
  }, [goals, selectedGoalId]);

  const currentTxs = activeGoal ? (txStore[activeGoal.id] || []) : [];

  const allTransactions = useMemo(() => {
    const list = [];
    Object.keys(txStore).forEach((gid) => {
      const g = goals.find((item) => item.id === gid);
      (txStore[gid] || []).forEach((t) => {
        list.push({ ...t, goalName: g ? g.name : 'Vault' });
      });
    });
    return list.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
  }, [txStore, goals]);

  const { totalCash, totalOnline, totalSaved, percentage, isCompleted } = useMemo(() => {
    if (!activeGoal) return { totalCash: 0, totalOnline: 0, totalSaved: 0, percentage: 0, isCompleted: false };
    
    let cash = 0;
    let online = 0;
    currentTxs.forEach((t) => {
      const v = t.action === 'withdraw' ? -t.amount : t.amount;
      if (t.type === 'cash') cash += v;
      if (t.type === 'online') online += v;
    });
    const total = Math.max(0, cash + online);
    const target = activeGoal.targetAmount || 1;
    const pct = Math.min(100, Number(((total / target) * 100).toFixed(1)));
    return {
      totalCash: Math.max(0, cash),
      totalOnline: Math.max(0, online),
      totalSaved: total,
      percentage: pct,
      isCompleted: total >= target
    };
  }, [currentTxs, activeGoal]);

  const portfolioTotal = useMemo(() => {
    if (goals.length === 0) return 0;
    let sum = 0;
    goals.forEach((g) => {
      const list = txStore[g.id] || [];
      list.forEach((t) => {
        sum += (t.action === 'withdraw' ? -t.amount : t.amount);
      });
    });
    return Math.max(0, sum);
  }, [txStore, goals]);

  const celebratedRef = useRef({});
  useEffect(() => {
    if (activeGoal && isCompleted && !celebratedRef.current[activeGoal.id]) {
      confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
      celebratedRef.current[activeGoal.id] = true;
    } else if (!isCompleted && activeGoal) {
      celebratedRef.current[activeGoal.id] = false;
    }
  }, [isCompleted, activeGoal]);

  const today = new Date();
  const startDt = activeGoal ? new Date(activeGoal.startDate || today) : today;
  const targetDt = activeGoal ? new Date(activeGoal.targetDate) : today;

  const totalDurationDays = Math.max(1, Math.floor((targetDt - startDt) / (1000 * 60 * 60 * 24)));
  const daysElapsed = Math.max(0, Math.floor((today - startDt) / (1000 * 60 * 60 * 24)));
  const daysLeft = Math.max(1, Math.floor((targetDt - today) / (1000 * 60 * 60 * 24)));
  const timeProgressPct = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDurationDays) * 100)));

  const remainingNeeded = activeGoal ? Math.max(0, activeGoal.targetAmount - totalSaved) : 0;
  const requiredPace = isCompleted ? 0 : Math.ceil(remainingNeeded / daysLeft);
  const baselineDailyPace = activeGoal ? Math.max(1, Math.round(activeGoal.targetAmount / totalDurationDays)) : 1;

  const { trajectoryStatus, daysDifference, varianceAmount } = useMemo(() => {
    if (!activeGoal) return { trajectoryStatus: 'on-track', daysDifference: 0, varianceAmount: 0 };
    if (isCompleted) return { trajectoryStatus: 'completed', daysDifference: 0, varianceAmount: 0 };

    const timeFraction = Math.min(1, Math.max(0, daysElapsed / totalDurationDays));
    const expectedSavedByNow = Math.round(activeGoal.targetAmount * timeFraction);
    const variance = totalSaved - expectedSavedByNow;
    const diffDays = Math.round(Math.abs(variance) / baselineDailyPace);

    if (variance > 1000) {
      return { trajectoryStatus: 'advance', daysDifference: diffDays, varianceAmount: variance };
    } else if (variance < -1000) {
      return { trajectoryStatus: 'delay', daysDifference: diffDays, varianceAmount: Math.abs(variance) };
    } else {
      return { trajectoryStatus: 'on-track', daysDifference: 0, varianceAmount: 0 };
    }
  }, [activeGoal, isCompleted, daysElapsed, totalDurationDays, totalSaved, baselineDailyPace]);

  // Keypad Handlers
  const handleTxKeypad = (digit) => {
    if (amountStr.length >= 8) return;
    setAmountStr((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleTransferKeypad = (digit) => {
    if (transferAmountStr.length >= 8) return;
    setTransferAmountStr((prev) => (prev === '0' ? digit : prev + digit));
  };

  // Submit Transaction
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    const val = Number(amountStr);
    if (!val || val <= 0 || !activeGoal || !user) return;

    if (actionType === 'withdraw') {
      const available = walletType === 'cash' ? totalCash : totalOnline;
      if (val > available) {
        alert(`Insufficient funds in ${walletType === 'cash' ? 'Cash Stash' : 'Online Wallet'}! Available: ₹${available.toLocaleString()}`);
        return;
      }

      await supabase.from('transactions').insert([{
        user_id: user.id,
        goal_id: activeGoal.id,
        amount: val,
        action: 'withdraw',
        type: walletType,
        note: note.trim() || 'Withdrawal',
        date: todayStr
      }]);
      playSound('withdraw');
    } else {
      await supabase.from('transactions').insert([{
        user_id: user.id,
        goal_id: activeGoal.id,
        amount: val,
        action: 'deposit',
        type: walletType,
        note: note.trim() || 'Added savings',
        date: todayStr
      }]);
      playSound('deposit');
    }

    setAmountStr('');
    setNote('');
    setIsTxModalOpen(false);
    fetchData();
  };

  // Submit Transfer
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    const val = Number(transferAmountStr);
    if (!val || val <= 0 || !activeGoal || !user) return;

    if (transferDirection === 'cash_to_bank') {
      if (val > totalCash) {
        alert(`Cannot transfer ₹${val.toLocaleString()}. Available Cash Stash: ₹${totalCash.toLocaleString()}`);
        return;
      }

      await supabase.from('transactions').insert([
        {
          user_id: user.id,
          goal_id: activeGoal.id,
          amount: val,
          action: 'withdraw',
          type: 'cash',
          note: transferNote.trim() ? `Cash ➔ Bank (${transferNote.trim()})` : 'Transferred Cash to Bank / UPI',
          date: todayStr
        },
        {
          user_id: user.id,
          goal_id: activeGoal.id,
          amount: val,
          action: 'deposit',
          type: 'online',
          note: transferNote.trim() ? `Bank Deposit (${transferNote.trim()})` : 'Bank deposit from Cash',
          date: todayStr
        }
      ]);
    } else {
      if (val > totalOnline) {
        alert(`Cannot transfer ₹${val.toLocaleString()}. Available Bank / UPI: ₹${totalOnline.toLocaleString()}`);
        return;
      }

      await supabase.from('transactions').insert([
        {
          user_id: user.id,
          goal_id: activeGoal.id,
          amount: val,
          action: 'withdraw',
          type: 'online',
          note: transferNote.trim() ? `Bank ➔ Cash (${transferNote.trim()})` : 'Withdrew from Bank to Cash',
          date: todayStr
        },
        {
          user_id: user.id,
          goal_id: activeGoal.id,
          amount: val,
          action: 'deposit',
          type: 'cash',
          note: transferNote.trim() ? `Cash Inflow (${transferNote.trim()})` : 'Cash added from Bank / ATM',
          date: todayStr
        }
      ]);
    }

    playSound('transfer');
    setTransferAmountStr('');
    setTransferNote('');
    setIsTransferModalOpen(false);
    fetchData();
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalAmount || !newGoalDate || !newGoalStartDate || !user) return;

    if (new Date(newGoalDate) <= new Date(newGoalStartDate)) {
      alert("Target End Date must be after Start Date.");
      return;
    }

    const chosenCat = CATEGORY_PRESETS.find((c) => c.id === newGoalCategory) || CATEGORY_PRESETS[0];

    const { data, error } = await supabase.from('goals').insert([{
      user_id: user.id,
      name: newGoalName.trim(),
      category: chosenCat.id,
      badge: chosenCat.label,
      target_amount: Number(newGoalAmount),
      start_date: newGoalStartDate,
      target_date: newGoalDate
    }]).select();

    if (!error && data && data.length > 0) {
      setSelectedGoalId(data[0].id);
      setNewGoalName('');
      setNewGoalCategory('tech');
      setNewGoalAmount('');
      setNewGoalStartDate(todayStr);
      setNewGoalDate('');
      setIsAddGoalOpen(false);
      fetchData();
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (confirm('Delete this goal and its cloud records?')) {
      await supabase.from('goals').delete().eq('id', goalId);
      fetchData();
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  const ActiveIcon = activeGoal ? (ICON_MAP[activeGoal.category] || Target) : Target;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col pb-24 font-sans">
      
      {/* Top Header Bar */}
      <header className="bg-white px-5 pt-4 pb-3 border-b border-slate-100 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center text-indigo-600 font-black text-sm">
            {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
          </div>
          <span className="text-xl font-black tracking-tight text-indigo-600">FinTrack</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-indigo-600 hover:bg-slate-50 rounded-full transition">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* VIEW 1: HOME */}
      {activeTab === 'home' && (
        <main className="max-w-md mx-auto w-full px-4 pt-4 space-y-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Good morning, {user.email?.split('@')[0] || 'Member'}
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              Here's a quick look at your sanctuary today.
            </p>
          </div>

          {/* Total Vault Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Total Vault
              </span>
              <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
                ₹{portfolioTotal.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E6FBF5] text-[#00E599] flex items-center justify-center">
              <Landmark className="w-6 h-6 text-[#00C482]" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-2">
            <h2 className="text-lg font-black text-slate-900">Quick Actions</h2>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setTransferAmountStr('');
                  setTransferNote('');
                  setIsTransferModalOpen(true);
                }}
                className="w-full bg-white border border-slate-200 text-indigo-600 font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-98 shadow-xs"
              >
                <ArrowLeftRight className="w-4 h-4" /> Shift Funds
              </button>

              <button
                onClick={() => {
                  setActionType('deposit');
                  setAmountStr('');
                  setNote('');
                  setIsTxModalOpen(true);
                }}
                className="w-full bg-indigo-600 text-white font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-98 shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" /> Add / Withdraw
              </button>
            </div>
          </div>
        </main>
      )}

      {/* VIEW 2: HISTORY */}
      {activeTab === 'history' && (
        <main className="max-w-md mx-auto w-full px-4 pt-4 space-y-3">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transaction Stream</h1>
            <p className="text-xs font-semibold text-slate-400">Recent savings and deposit records.</p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block border-b border-slate-100 pb-2">
              All Activity
            </span>

            <div className="divide-y divide-slate-100">
              {allTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No transactions recorded yet.</p>
              ) : (
                allTransactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-indigo-600 flex items-center justify-center">
                        {tx.type === 'online' ? <Smartphone className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-snug">{tx.note || 'Savings Transaction'}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {tx.goalName} • {tx.type} • {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-[#E6FBF5] text-[#00C482] font-mono inline-block">
                        {tx.action === 'withdraw' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                      </span>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">Completed</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      )}

      {/* VIEW 3: GOALS (Main View from Screenshots) */}
      {activeTab === 'goals' && (
        <main className="max-w-md mx-auto w-full px-4 pt-3 space-y-3.5">
          
          {/* Active Goals Carousel Top */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Active Goals ({goals.length})
              </span>
              <button 
                onClick={() => setIsAddGoalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                + Create
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center">
                <button
                  onClick={() => setIsAddGoalOpen(true)}
                  className="w-10 h-10 rounded-full border border-slate-300 text-slate-400 mx-auto flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <p className="text-xs font-bold text-slate-500 mt-2">No goals created yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar flex gap-2.5 pb-1">
                {goals.map((g) => {
                  const isSelected = g.id === selectedGoalId;
                  const gTxs = txStore[g.id] || [];
                  let gSaved = 0;
                  gTxs.forEach((t) => {
                    gSaved += (t.action === 'withdraw' ? -t.amount : t.amount);
                  });
                  gSaved = Math.max(0, gSaved);
                  const gPct = Math.min(100, Math.round((gSaved / g.targetAmount) * 100));

                  const gStart = new Date(g.startDate || today);
                  const gTarget = new Date(g.targetDate);
                  const gTotalDays = Math.max(1, Math.floor((gTarget - gStart) / (1000 * 60 * 60 * 24)));
                  const gElapsed = Math.max(0, Math.floor((today - gStart) / (1000 * 60 * 60 * 24)));
                  const gExpected = Math.round(g.targetAmount * Math.min(1, gElapsed / gTotalDays));
                  const gDailyPace = Math.max(1, Math.round(g.targetAmount / gTotalDays));
                  const isDelayed = gSaved < gExpected - 1000 && gSaved < g.targetAmount;
                  const sidebarDaysGap = Math.round(Math.abs(gSaved - gExpected) / gDailyPace);

                  return (
                    <div
                      key={g.id}
                      onClick={() => setSelectedGoalId(g.id)}
                      className={`min-w-[270px] flex-1 bg-white p-4 rounded-3xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm' 
                          : 'border-slate-200/80 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-indigo-600 flex items-center justify-center">
                            <Laptop className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">
                            {g.badge || 'Goal'}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-black text-[#00C482]">{gPct}%</span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 mt-2">{g.name}</h3>
                      
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="font-semibold text-slate-900">
                          ₹{gSaved.toLocaleString()} <span className="text-slate-400 font-normal">/ ₹{g.targetAmount.toLocaleString()}</span>
                        </span>
                        {isDelayed && (
                          <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                            -{sidebarDaysGap}d delay
                          </span>
                        )}
                      </div>

                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                        <div className="h-full bg-[#00E599] rounded-full" style={{ width: `${gPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Goal Detailed Card */}
          {activeGoal && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-indigo-600 flex items-center justify-center">
                    <ActiveIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">{activeGoal.name}</h2>
                      <span className="text-[9px] font-mono uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">
                        {activeGoal.badge}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      Target Ceiling: ₹{activeGoal.targetAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteGoal(activeGoal.id)}
                  className="p-2 text-slate-300 hover:text-rose-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Date Box */}
              <div className="bg-[#FAFBFD] border border-slate-100 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-semibold text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeGoal.startDate}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>{activeGoal.targetDate}</span>
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-[#EEF2FF] px-2.5 py-1 rounded-xl">
                  {daysLeft}d left
                </span>
              </div>

              {/* Action Buttons (Shift Funds vs Add/Withdraw) */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setTransferAmountStr('');
                    setTransferNote('');
                    setIsTransferModalOpen(true);
                  }}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-98 shadow-xs transition"
                >
                  <ArrowLeftRight className="w-4 h-4" /> Shift Funds
                </button>
                <button
                  onClick={() => {
                    setActionType('deposit');
                    setAmountStr('');
                    setNote('');
                    setIsTxModalOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-98 shadow-md shadow-indigo-600/20 transition"
                >
                  <Plus className="w-4 h-4" /> Add / Withdraw
                </button>
              </div>
            </div>
          )}

          {/* Schedule Status Banner */}
          {activeGoal && (
            <div className={`p-4 rounded-3xl border flex flex-col gap-2 ${
              trajectoryStatus === 'delay' 
                ? 'bg-rose-50/70 border-rose-100 text-rose-950' 
                : 'bg-[#E6FBF5] border-[#B7F4E0] text-emerald-950'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 ${trajectoryStatus === 'delay' ? 'text-rose-500' : 'text-emerald-500'}`} />
                  <span className="text-[11px] font-black uppercase tracking-wider font-mono">
                    Schedule Status:
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full text-white ${
                  trajectoryStatus === 'delay' ? 'bg-rose-500' : 'bg-emerald-500'
                }`}>
                  {trajectoryStatus === 'delay' ? `-${daysDifference}d Behind (-₹${varianceAmount.toLocaleString()})` : 'On Track'}
                </span>
              </div>
              <p className="text-xs font-semibold opacity-90 leading-snug">
                Schedule gap: {daysDifference} days. Suggested rate: ₹{requiredPace}/day.
              </p>
            </div>
          )}

          {/* Timeline Horizon Card */}
          {activeGoal && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
                  <span>TIMELINE WINDOW</span>
                  <span>{daysElapsed} OF {totalDurationDays} DAYS ({timeProgressPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: `${timeProgressPct}%` }} />
                </div>
              </div>

              {/* Total Vault Saved */}
              <div className="pt-1 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    TOTAL VAULT SAVED
                  </span>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    ₹{totalSaved.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#00C482] font-mono">{percentage}%</span>
                  <span className="text-[11px] text-slate-400 block font-medium">₹{remainingNeeded.toLocaleString()} remaining</span>
                </div>
              </div>

              {/* Balance Fill Bar */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#00E599] rounded-full" style={{ width: `${percentage}%` }} />
              </div>

              {/* Cash vs Bank Chips */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                <div className="bg-[#E6FBF5] border border-[#B7F4E0] px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shrink-0">
                  <Banknote className="w-3.5 h-3.5 text-[#00C482]" />
                  <span className="text-xs font-mono font-black text-[#009360]">
                    Cash: ₹{totalCash.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#E6FBF5] border border-[#B7F4E0] px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shrink-0">
                  <Smartphone className="w-3.5 h-3.5 text-[#00C482]" />
                  <span className="text-xs font-mono font-black text-[#009360]">
                    Bank: ₹{totalOnline.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setTransferDirection('bank_to_cash');
                    setTransferAmountStr('');
                    setTransferNote('');
                    setIsTransferModalOpen(true);
                  }}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-2xl shrink-0 active:bg-slate-50"
                >
                  Withdraw to Cash ➔
                </button>
              </div>
            </div>
          )}

          {/* Metric Tiles from Screenshot */}
          {activeGoal && (
            <div className="space-y-2.5">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-slate-400" /> REQUIRED PACE
                </span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  ₹{requiredPace}<span className="text-xs text-slate-400 font-normal">/d</span>
                </p>
              </div>

              <div className="bg-white border-l-4 border-l-rose-500 border border-slate-200/80 rounded-3xl p-4 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-500 font-bold block flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> OFFSET
                </span>
                <p className="text-xl font-black text-rose-500 mt-1">
                  -{daysDifference}d
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> HORIZON
                </span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {daysLeft} days
                </p>
              </div>
            </div>
          )}

          {/* Transaction Stream Card */}
          {activeGoal && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 tracking-wide uppercase">Transaction Stream</h3>
                <span className="text-[10px] font-mono font-bold bg-[#EEF2FF] text-indigo-700 px-2.5 py-0.5 rounded-full">
                  {currentTxs.length} records
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {currentTxs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No transactions logged yet.</p>
                ) : (
                  currentTxs.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-indigo-600 flex items-center justify-center">
                          {tx.type === 'online' ? <Smartphone className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">{tx.note || 'Savings Entry'}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{tx.type} • {tx.date}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-[#E6FBF5] text-[#00C482] font-mono">
                        {tx.action === 'withdraw' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {/* VIEW 4: SETTINGS */}
      {activeTab === 'settings' && (
        <main className="max-w-md mx-auto w-full px-4 pt-4 space-y-4">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vault Settings</h1>
          
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-3 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">
              Signed in as: <span className="text-slate-900 font-bold">{user.email}</span>
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </main>
      )}

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? 'text-[#00C482]' : 'text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'home' ? 'bg-[#00E599] text-white px-4' : ''}`}>
              <HomeIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'history' ? 'text-[#00C482]' : 'text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'history' ? 'bg-[#00E599] text-white px-4' : ''}`}>
              <History className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold">History</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'goals' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'goals' ? 'bg-indigo-600 text-white px-4' : ''}`}>
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold">Goals</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'settings' ? 'bg-indigo-600 text-white px-4' : ''}`}>
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold">Profile</span>
          </button>
        </div>
      </nav>

      {/* 1. TRANSACTION KEYPAD MODAL (Exact match to 1.png) */}
      {isTxModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col animate-sheet-up max-h-[92vh] overflow-y-auto mb-2">
            
            {/* Top Toggle Switch */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 bg-[#EEF2FF] p-1 rounded-full flex">
                <button
                  type="button"
                  onClick={() => setActionType('deposit')}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-full transition ${
                    actionType === 'deposit' ? 'bg-[#00C482] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Deposit (+)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('withdraw')}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-full transition ${
                    actionType === 'withdraw' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Withdraw (-)
                </button>
              </div>

              <button 
                onClick={() => setIsTxModalOpen(false)} 
                className="w-9 h-9 rounded-full bg-[#EEF2FF] text-slate-500 flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Display Screen */}
            <div className="bg-[#EEF2FF]/60 border border-indigo-100/60 rounded-2xl p-4 text-center mt-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 block">
                {actionType === 'deposit' ? 'ADD TO GOAL' : 'WITHDRAW FROM GOAL'} ({activeGoal.name.toUpperCase()})
              </span>
              <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
                <span className="text-slate-400 mr-1 text-lg">₹</span>
                {amountStr ? Number(amountStr).toLocaleString() : '0'}
              </div>
            </div>

            {/* Online vs Cash Switch Cards */}
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <button
                type="button"
                onClick={() => setWalletType('online')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2 ${
                  walletType === 'online' 
                    ? 'bg-[#E6FBF5] border-[#00C482] text-[#009360] ring-1 ring-[#00C482]' 
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 shrink-0 text-[#00C482]" />
                <div>
                  <span className="text-xs font-bold block leading-tight">Online</span>
                  <span className="text-[11px] font-mono font-bold">(₹{totalOnline.toLocaleString()})</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setWalletType('cash')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2 ${
                  walletType === 'cash' 
                    ? 'bg-[#E6FBF5] border-[#00C482] text-[#009360] ring-1 ring-[#00C482]' 
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Banknote className="w-4 h-4 shrink-0 text-slate-500" />
                <div>
                  <span className="text-xs font-bold block leading-tight">Cash</span>
                  <span className="text-[11px] font-mono font-bold">(₹{totalCash.toLocaleString()})</span>
                </div>
              </button>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleTxKeypad(digit)}
                  className="h-12 bg-white text-slate-800 font-bold text-lg rounded-2xl border border-slate-200 active:bg-slate-100 flex items-center justify-center transition active:scale-95"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmountStr('')}
                className="h-12 bg-[#EEF2FF] text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 flex items-center justify-center active:scale-95 font-mono"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleTxKeypad('0')}
                className="h-12 bg-white text-slate-800 font-bold text-lg rounded-2xl border border-slate-200 active:bg-slate-100 flex items-center justify-center active:scale-95"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setAmountStr((prev) => prev.slice(0, -1))}
                className="h-12 bg-rose-50 text-rose-600 font-bold text-xs rounded-2xl border border-rose-100 flex items-center justify-center active:scale-95"
              >
                <Delete className="w-4 h-4 text-rose-500" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Memo / Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#EEF2FF]/60 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 mt-3 font-medium focus:outline-none focus:bg-white"
            />

            <button
              type="button"
              onClick={handleTransactionSubmit}
              disabled={!amountStr || Number(amountStr) <= 0}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-2xl mt-3 shadow-md shadow-indigo-600/20 disabled:opacity-40"
            >
              Confirm {actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </button>
          </div>
        </div>
      )}

      {/* 2. DEDICATED TRANSFER MODAL (Exact match to 9.png) */}
      {isTransferModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col animate-sheet-up max-h-[92vh] overflow-y-auto mb-2">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-indigo-600 flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Shift Vault Funds</h3>
                  <p className="text-[10px] text-slate-400">Move balance between Cash and Bank</p>
                </div>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-[#EEF2FF] text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direction Selector */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setTransferDirection('cash_to_bank');
                  setTransferAmountStr('');
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  transferDirection === 'cash_to_bank' 
                    ? 'border-[#00C482] ring-2 ring-[#00C482]/20 bg-white' 
                    : 'border-slate-200 bg-[#FAFBFD]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1 text-slate-900">
                    <Banknote className="w-3.5 h-3.5 text-[#00C482]" /> Cash ➔ Bank
                  </span>
                  {transferDirection === 'cash_to_bank' && (
                    <span className="w-2 h-2 rounded-full bg-[#00C482]" />
                  )}
                </div>
                <div className="mt-2 text-xs font-semibold">
                  <span className="text-[10px] text-slate-400 block">Available:</span>
                  <span className="font-mono font-black text-slate-900">₹{totalCash.toLocaleString()}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTransferDirection('bank_to_cash');
                  setTransferAmountStr('');
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  transferDirection === 'bank_to_cash' 
                    ? 'border-indigo-600 ring-2 ring-indigo-600/20 bg-white' 
                    : 'border-slate-200 bg-[#FAFBFD]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1 text-slate-900">
                    <Smartphone className="w-3.5 h-3.5 text-indigo-600" /> Bank ➔ Cash
                  </span>
                  {transferDirection === 'bank_to_cash' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  )}
                </div>
                <div className="mt-2 text-xs font-semibold">
                  <span className="text-[10px] text-slate-400 block">Available:</span>
                  <span className="font-mono font-black text-indigo-600">₹{totalOnline.toLocaleString()}</span>
                </div>
              </button>
            </div>

            {/* Quick Fill Max Button */}
            <div className="flex items-center justify-between px-1 text-xs mt-3">
              <span className="text-slate-500 font-medium">
                Source: {transferDirection === 'cash_to_bank' ? 'Cash Stash' : 'Bank Account'}
              </span>
              <button
                type="button"
                onClick={() => setTransferAmountStr(String(transferDirection === 'cash_to_bank' ? totalCash : totalOnline))}
                className="font-mono text-[11px] font-bold text-indigo-600 bg-[#EEF2FF] border border-indigo-200 px-2.5 py-1 rounded-xl"
              >
                Shift Max (₹{(transferDirection === 'cash_to_bank' ? totalCash : totalOnline).toLocaleString()})
              </button>
            </div>

            {/* Amount Screen */}
            <div className="bg-[#EEF2FF]/60 border border-indigo-100 rounded-2xl p-3.5 text-center mt-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                TRANSFER SUM
              </span>
              <div className="text-2xl font-mono font-bold text-slate-900 mt-0.5">
                <span className="text-indigo-600 mr-1 text-lg">₹</span>
                {transferAmountStr ? Number(transferAmountStr).toLocaleString() : '0'}
              </div>
            </div>

            {/* Transfer Pad */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleTransferKeypad(digit)}
                  className="h-11 bg-white text-slate-800 font-bold text-lg rounded-2xl border border-slate-200 active:bg-slate-100 flex items-center justify-center transition active:scale-95"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTransferAmountStr('')}
                className="h-11 bg-[#EEF2FF] text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 flex items-center justify-center font-mono"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleTransferKeypad('0')}
                className="h-11 bg-white text-slate-800 font-bold text-lg rounded-2xl border border-slate-200 active:bg-slate-100 flex items-center justify-center active:scale-95"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setTransferAmountStr((prev) => prev.slice(0, -1))}
                className="h-11 bg-rose-50 text-rose-600 font-bold text-xs rounded-2xl border border-rose-100 flex items-center justify-center"
              >
                <Delete className="w-4 h-4 text-rose-500" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Transfer note (e.g. ATM withdrawal, bank deposit)"
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              className="w-full bg-[#EEF2FF]/60 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 mt-2 font-medium focus:outline-none focus:bg-white"
            />

            <button
              type="button"
              onClick={handleTransferSubmit}
              disabled={!transferAmountStr || Number(transferAmountStr) <= 0}
              className="w-full py-3.5 bg-[#00E599] hover:bg-[#00C482] text-slate-900 font-bold text-xs rounded-2xl mt-3 shadow-md shadow-[#00E599]/20 disabled:opacity-40"
            >
              Confirm Transfer (₹{transferAmountStr ? Number(transferAmountStr).toLocaleString() : '0'})
            </button>
          </div>
        </div>
      )}

      {/* 3. NEW FINANCIAL GOAL MODAL (Exact match to 7.png) */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col animate-sheet-up max-h-[92vh] overflow-y-auto mb-2">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-indigo-600 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 text-base">New Financial Goal</h3>
              </div>
              <button 
                onClick={() => setIsAddGoalOpen(false)} 
                className="w-8 h-8 rounded-full bg-[#EEF2FF] text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3.5">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  CATEGORY
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_PRESETS.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = newGoalCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewGoalCategory(cat.id)}
                        className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                          isSelected 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <CatIcon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[#00C482]'}`} />
                        <span className="text-xs font-bold">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  GOAL TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. MacBook Pro, Bali Trip, Emergency"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  TARGET CAPITAL (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 100000"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    START DATE
                  </label>
                  <input
                    type="date"
                    value={newGoalStartDate}
                    onChange={(e) => setNewGoalStartDate(e.target.value)}
                    className="w-full mt-1 bg-white border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    TARGET DATE
                  </label>
                  <input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="w-full mt-1 bg-white border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-2xl shadow-md shadow-indigo-600/20 mt-2"
              >
                Launch Financial Target
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}