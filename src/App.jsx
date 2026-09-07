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
  Zap, 
  ArrowLeftRight, 
  LogOut, 
  Loader2, 
  Mail, 
  Lock, 
  Bell, 
  History, 
  Settings, 
  Landmark, 
  TrendingUp, 
  Activity, 
  RotateCcw, 
  Share2,
  PiggyBank,
  Edit3,
  SlidersHorizontal,
  Clock,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_PRESETS = [
  { id: 'tech', label: 'Tech & Devices', icon: Laptop },
  { id: 'savings', label: 'Savings Vault', icon: PiggyBank },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'vehicle', label: 'Auto & Transport', icon: Car },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'emergency', label: 'Emergency Fund', icon: ShieldAlert },
  { id: 'home', label: 'Home Living', icon: HomeIcon },
  { id: 'health', label: 'Health & Wellness', icon: HeartPulse },
  { id: 'custom', label: 'Personal Targets', icon: Sparkles },
];

const ICON_MAP = {
  tech: Laptop,
  savings: PiggyBank,
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
    <div className="min-h-screen bg-[#F6F4EE] text-[#1A1A18] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm butter-card rounded-3xl p-7 shadow-xl">
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1A1A18] text-[#FEF6D8] flex items-center justify-center mb-1 shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">FinNest</h1>
          <p className="text-xs text-[#706B5E] font-medium">Warm Sanctuary Financial Studio</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B5E] pl-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E8E2D5] rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#1A1A18] focus:outline-none focus:bg-white focus:border-[#1A1A18] transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B5E] pl-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E8E2D5] rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#1A1A18] focus:outline-none focus:bg-white focus:border-[#1A1A18] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-[#1A1A18] hover:bg-black active:scale-95 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-black/10 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : isSignUp ? 'Create FinNest Vault' : 'Enter Vault'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-[#EAE4D6]">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-xs font-bold text-[#706B5E] hover:text-black transition"
          >
            {isSignUp ? 'Existing account? Sign In' : 'New to FinNest? Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [activeTab, setActiveTab] = useState('goals');

  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [txStore, setTxStore] = useState({});

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isGoalTransferModalOpen, setIsGoalTransferModalOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Keypad Transactions
  const [actionType, setActionType] = useState('deposit');
  const [walletType, setWalletType] = useState('online');
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');

  // Cash <-> Bank Transfer
  const [transferDirection, setTransferDirection] = useState('cash_to_bank');
  const [transferAmountStr, setTransferAmountStr] = useState('');
  const [transferNote, setTransferNote] = useState('');

  // Goal-to-Goal Transfer
  const [targetGoalId, setTargetGoalId] = useState('');
  const [goalTransferWallet, setGoalTransferWallet] = useState('online');
  const [goalTransferAmountStr, setGoalTransferAmountStr] = useState('');
  const [goalTransferNote, setGoalTransferNote] = useState('');

  // Goal Creation
  const todayStr = new Date().toISOString().split('T')[0];
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('tech');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalStartDate, setNewGoalStartDate] = useState(todayStr);
  const [newGoalDate, setNewGoalDate] = useState('');

  // Goal Editing & Timeline Extension
  const [editGoalName, setEditGoalName] = useState('');
  const [editGoalAmount, setEditGoalAmount] = useState('');
  const [editGoalDate, setEditGoalDate] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  // Strict ₹20 tolerance calculation
  const { trajectoryStatus, daysDifference, varianceAmount } = useMemo(() => {
    if (!activeGoal) return { trajectoryStatus: 'on-track', daysDifference: 0, varianceAmount: 0 };
    if (isCompleted) return { trajectoryStatus: 'completed', daysDifference: 0, varianceAmount: 0 };

    const timeFraction = Math.min(1, Math.max(0, daysElapsed / totalDurationDays));
    const expectedSavedByNow = Math.round(activeGoal.targetAmount * timeFraction);
    const variance = totalSaved - expectedSavedByNow;
    const diffDays = Math.max(1, Math.round(Math.abs(variance) / baselineDailyPace));

    const TOLERANCE = 20;

    if (variance < -TOLERANCE) {
      return { trajectoryStatus: 'delay', daysDifference: diffDays, varianceAmount: Math.abs(variance) };
    } else if (variance > TOLERANCE) {
      return { trajectoryStatus: 'advance', daysDifference: diffDays, varianceAmount: variance };
    } else {
      return { trajectoryStatus: 'on-track', daysDifference: 0, varianceAmount: 0 };
    }
  }, [activeGoal, isCompleted, daysElapsed, totalDurationDays, totalSaved, baselineDailyPace]);

  const handleTxKeypad = (digit) => {
    if (amountStr.length >= 8) return;
    setAmountStr((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleTransferKeypad = (digit) => {
    if (transferAmountStr.length >= 8) return;
    setTransferAmountStr((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleGoalTransferKeypad = (digit) => {
    if (goalTransferAmountStr.length >= 8) return;
    setGoalTransferAmountStr((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    const val = Number(amountStr);
    if (!val || val <= 0 || !activeGoal || !user) return;

    if (actionType === 'withdraw') {
      const available = walletType === 'cash' ? totalCash : totalOnline;
      if (val > available) {
        alert(`Insufficient funds in ${walletType === 'cash' ? 'Cash Wallet' : 'Online Wallet'}! Available: ₹${available.toLocaleString()}`);
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
        note: note.trim() || 'Savings Inflow',
        date: todayStr
      }]);
      playSound('deposit');
    }

    setAmountStr('');
    setNote('');
    setIsTxModalOpen(false);
    fetchData();
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    const val = Number(transferAmountStr);
    if (!val || val <= 0 || !activeGoal || !user) return;

    if (transferDirection === 'cash_to_bank') {
      if (val > totalCash) {
        alert(`Cannot transfer ₹${val.toLocaleString()}. Available in Cash: ₹${totalCash.toLocaleString()}`);
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
          note: transferNote.trim() ? `Bank Deposit (${transferNote.trim()})` : 'Bank deposit from Cash Stash',
          date: todayStr
        }
      ]);
    } else {
      if (val > totalOnline) {
        alert(`Cannot transfer ₹${val.toLocaleString()}. Available in Bank: ₹${totalOnline.toLocaleString()}`);
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
          note: transferNote.trim() ? `Cash Inflow (${transferNote.trim()})` : 'Cash added from Bank',
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

  const handleCrossGoalTransferSubmit = async (e) => {
    e.preventDefault();
    const val = Number(goalTransferAmountStr);
    if (!val || val <= 0 || !activeGoal || !targetGoalId || !user) return;

    const available = goalTransferWallet === 'cash' ? totalCash : totalOnline;
    if (val > available) {
      alert(`Cannot transfer ₹${val.toLocaleString()}. Available in ${goalTransferWallet === 'cash' ? 'Cash' : 'Online'} is ₹${available.toLocaleString()}`);
      return;
    }

    const destinationGoal = goals.find((g) => g.id === targetGoalId);
    const destName = destinationGoal ? destinationGoal.name : 'Target Goal';

    try {
      await supabase.from('transactions').insert([
        {
          user_id: user.id,
          goal_id: activeGoal.id,
          amount: val,
          action: 'withdraw',
          type: goalTransferWallet,
          note: goalTransferNote.trim() ? `Transferred to ${destName} (${goalTransferNote.trim()})` : `Transferred to ${destName}`,
          date: todayStr
        },
        {
          user_id: user.id,
          goal_id: targetGoalId,
          amount: val,
          action: 'deposit',
          type: goalTransferWallet,
          note: goalTransferNote.trim() ? `Received from ${activeGoal.name} (${goalTransferNote.trim()})` : `Received from ${activeGoal.name}`,
          date: todayStr
        }
      ]);

      playSound('transfer');
      setGoalTransferAmountStr('');
      setGoalTransferNote('');
      setIsGoalTransferModalOpen(false);
      fetchData();
      alert(`Shifted ₹${val.toLocaleString()} from ${activeGoal.name} to ${destName}!`);
    } catch (err) {
      alert('Goal transfer error: ' + err.message);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalAmount || !newGoalDate || !newGoalStartDate || !user) return;

    if (new Date(newGoalDate) <= new Date(newGoalStartDate)) {
      alert("Ending target date must be after start date.");
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

  const handleOpenEditGoal = () => {
    if (!activeGoal) return;
    setEditGoalName(activeGoal.name);
    setEditGoalAmount(String(activeGoal.targetAmount));
    setEditGoalDate(activeGoal.targetDate);
    setIsEditGoalOpen(true);
  };

  const handleQuickExtendDays = (days) => {
    const base = editGoalDate ? new Date(editGoalDate) : new Date();
    base.setDate(base.getDate() + days);
    setEditGoalDate(base.toISOString().split('T')[0]);
  };

  const handleSaveGoalChanges = async (e) => {
    e.preventDefault();
    if (!activeGoal || !editGoalName.trim() || !editGoalAmount || !editGoalDate) return;

    if (new Date(editGoalDate) <= new Date(activeGoal.startDate)) {
      alert("Extended end date must be after the starting date.");
      return;
    }

    setIsSavingEdit(true);
    try {
      const { error } = await supabase
        .from('goals')
        .update({
          name: editGoalName.trim(),
          target_amount: Number(editGoalAmount),
          target_date: editGoalDate
        })
        .eq('id', activeGoal.id);

      if (error) throw error;

      setIsEditGoalOpen(false);
      fetchData();
      alert('Goal details and extended timeline updated successfully!');
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (confirm('Delete this goal and its historical records?')) {
      await supabase.from('goals').delete().eq('id', goalId);
      fetchData();
    }
  };

  const handleResetAllData = async (e) => {
    e.preventDefault();
    if (resetInput.trim().toUpperCase() !== 'RESET') {
      alert('Please type "RESET" exactly to confirm.');
      return;
    }

    setIsResetting(true);
    try {
      await supabase.from('transactions').delete().eq('user_id', user.id);
      await supabase.from('goals').delete().eq('user_id', user.id);
      localStorage.removeItem('fintrack_cache');
      localStorage.removeItem('finnest_goals');
      localStorage.removeItem('finnest_txs');

      setGoals([]);
      setTxStore({});
      setSelectedGoalId(null);
      playSound('withdraw');

      setIsResetModalOpen(false);
      setResetInput('');
      setActiveTab('goals');
      alert('All FinNest records have been completely reset.');
    } catch (err) {
      alert('Reset failed: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#F6F4EE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1A1A18] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  const ActiveIcon = activeGoal ? (ICON_MAP[activeGoal.category] || Target) : Target;
  const eligibleTargetGoals = goals.filter((g) => g.id !== selectedGoalId);

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#1A1A18] flex flex-col md:flex-row pb-24 md:pb-0 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 butter-card border-r border-[#E6DEC8] p-5 shrink-0 justify-between sticky top-0 h-screen z-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A1A18] text-[#FEF6D8] flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-[#1A1A18] block leading-tight">FinNest</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#706B5E]">Vault Studio</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition ${
                activeTab === 'home' ? 'bg-[#FEF6D8] text-[#1A1A18] border border-[#F6E6AA]' : 'text-[#706B5E] hover:bg-[#FAF9F5]'
              }`}
            >
              <HomeIcon className="w-4 h-4" /> Overview
            </button>

            <button
              onClick={() => setActiveTab('goals')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition ${
                activeTab === 'goals' ? 'bg-[#FEF6D8] text-[#1A1A18] border border-[#F6E6AA]' : 'text-[#706B5E] hover:bg-[#FAF9F5]'
              }`}
            >
              <Target className="w-4 h-4" /> Goals & Devices
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition ${
                activeTab === 'history' ? 'bg-[#FEF6D8] text-[#1A1A18] border border-[#F6E6AA]' : 'text-[#706B5E] hover:bg-[#FAF9F5]'
              }`}
            >
              <History className="w-4 h-4" /> Session History
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition ${
                activeTab === 'settings' ? 'bg-[#FEF6D8] text-[#1A1A18] border border-[#F6E6AA]' : 'text-[#706B5E] hover:bg-[#FAF9F5]'
              }`}
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#EAE4D6]">
          <div className="bg-[#FEF6D8] p-3.5 rounded-2xl border border-[#F6E6AA]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#706B5E] block">TOTAL VAULT BALANCE</span>
            <p className="text-xl font-black text-[#1A1A18] mt-0.5">₹{portfolioTotal.toLocaleString()}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#706B5E] hover:text-rose-600 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="md:hidden butter-card px-5 pt-4 pb-3 border-b border-[#E6DEC8] sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1A1A18] text-[#FEF6D8] flex items-center justify-center font-black text-xs">
              FN
            </div>
            <span className="text-xl font-black tracking-tight text-[#1A1A18]">FinNest</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 text-[#706B5E] hover:text-black rounded-full transition">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#706B5E] hover:text-black rounded-full transition">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Laptop Subheader */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 butter-card border-b border-[#E6DEC8]">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-[#1A1A18] capitalize">{activeTab}</h1>
            <span className="text-xs font-semibold text-[#706B5E]">Vault: {user.email}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {goals.length > 1 && (
              <button
                onClick={() => {
                  setTargetGoalId(eligibleTargetGoals[0]?.id || '');
                  setGoalTransferAmountStr('');
                  setGoalTransferNote('');
                  setIsGoalTransferModalOpen(true);
                }}
                className="bg-[#FAF9F5] border border-[#E0D8C3] hover:bg-white text-[#1A1A18] font-bold text-xs px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" /> Shift to Goal
              </button>
            )}
            <button
              onClick={() => {
                setTransferAmountStr('');
                setTransferNote('');
                setIsTransferModalOpen(true);
              }}
              className="bg-[#FAF9F5] border border-[#E0D8C3] hover:bg-white text-[#1A1A18] font-bold text-xs px-4 py-2 rounded-2xl flex items-center gap-1.5 transition active:scale-95"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Shift Funds
            </button>
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="bg-[#1A1A18] hover:bg-black text-[#FEF6D8] font-bold text-xs px-4 py-2 rounded-2xl flex items-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> New Goal
            </button>
          </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-1">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'home' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A18] tracking-tight">
                  Good morning, {user.email?.split('@')[0] || 'Member'}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-[#706B5E] mt-0.5">
                  FinNest Sanctuary overview of your capital and devices.
                </p>
              </div>

              {/* Total Vault Butter Card */}
              <div className="butter-highlight-card rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#706B5E] font-bold block">
                    TOTAL VAULT CAPITAL
                  </span>
                  <p className="text-3xl sm:text-4xl font-black text-[#1A1A18] mt-1 tracking-tight">
                    ₹{portfolioTotal.toLocaleString()}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#1A1A18] text-[#FEF6D8] flex items-center justify-center shadow-md">
                  <Landmark className="w-7 h-7" />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 pt-1">
                <h2 className="text-base font-black text-[#1A1A18]">Quick Operations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setTransferAmountStr('');
                      setTransferNote('');
                      setIsTransferModalOpen(true);
                    }}
                    className="butter-card hover:bg-white text-[#1A1A18] font-bold text-xs py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition"
                  >
                    <ArrowLeftRight className="w-4 h-4" /> Shift (Cash ➔ Bank)
                  </button>

                  <button
                    onClick={() => {
                      setActionType('deposit');
                      setAmountStr('');
                      setNote('');
                      setIsTxModalOpen(true);
                    }}
                    className="bg-[#1A1A18] hover:bg-black text-[#FEF6D8] font-bold text-xs py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add / Withdraw
                  </button>
                </div>

                {goals.length > 1 && (
                  <button
                    onClick={() => {
                      setTargetGoalId(eligibleTargetGoals[0]?.id || '');
                      setGoalTransferAmountStr('');
                      setGoalTransferNote('');
                      setIsGoalTransferModalOpen(true);
                    }}
                    className="w-full bg-[#FEF6D8] hover:bg-[#FDF0C2] border border-[#F6E6AA] text-[#1A1A18] font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition shadow-xs"
                  >
                    <Share2 className="w-4 h-4" /> Inter-Goal Surplus Transfer
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SESSION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">Session History</h1>
                <p className="text-xs font-semibold text-[#706B5E] mt-0.5">Audit trail of transactions across all goals.</p>
              </div>

              {/* High-Contrast Warm Session Panel */}
              <div className="session-history-panel rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#EAE4D6] pb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#706B5E] font-bold">
                    RECORDED SESSIONS
                  </span>
                  <span className="text-xs font-mono font-black text-[#1A1A18] bg-[#FEF6D8] border border-[#F6E6AA] px-3 py-0.5 rounded-full">
                    {allTransactions.length} Items
                  </span>
                </div>

                <div className="divide-y divide-[#EAE4D6] max-h-96 overflow-y-auto pr-1">
                  {allTransactions.length === 0 ? (
                    <p className="text-xs text-[#706B5E] font-medium py-10 text-center">No transaction sessions recorded yet.</p>
                  ) : (
                    allTransactions.map((tx) => {
                      const isWithdraw = tx.action === 'withdraw';
                      return (
                        <div 
                          key={tx.id} 
                          className="py-3.5 flex items-center justify-between text-xs hover:bg-[#FAF9F5] px-2 rounded-2xl transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                              isWithdraw 
                                ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            }`}>
                              {tx.type === 'online' ? <Smartphone className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-extrabold text-[#1A1A18] text-sm leading-tight">
                                {tx.note || 'Savings Transaction'}
                              </p>
                              <p className="text-[11px] font-semibold text-[#706B5E] mt-0.5">
                                <span className="text-[#1A1A18] font-bold">{tx.goalName}</span> • {tx.type.toUpperCase()} • {tx.date}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className={`font-mono font-black text-sm block ${
                              isWithdraw ? 'text-[#E11D48]' : 'text-[#059669]'
                            }`}>
                              {isWithdraw ? '-' : '+'}₹{tx.amount.toLocaleString()}
                            </span>
                            <span className={`text-[10px] font-bold uppercase ${
                              isWithdraw ? 'text-rose-600' : 'text-emerald-700'
                            }`}>
                              {isWithdraw ? 'Debited' : 'Added'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOALS */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              
              {/* Header section with pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">Devices & Goals</h1>
                  <p className="text-xs font-semibold text-[#706B5E]">Active FinNest targets ({goals.length})</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#1A1A18] text-[#FEF6D8]">
                    {goals.length} active
                  </span>
                  <button 
                    onClick={() => setIsAddGoalOpen(true)}
                    className="text-xs font-bold px-3.5 py-1.5 rounded-full butter-card hover:bg-white text-[#1A1A18] transition"
                  >
                    + New Target
                  </button>
                </div>
              </div>

              {/* Goals Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {goals.map((g) => {
                  const isSelected = g.id === selectedGoalId;
                  const gTxs = txStore[g.id] || [];
                  let gSaved = 0;
                  gTxs.forEach((t) => { gSaved += (t.action === 'withdraw' ? -t.amount : t.amount); });
                  gSaved = Math.max(0, gSaved);
                  const gPct = Math.min(100, Math.round((gSaved / g.targetAmount) * 100));

                  const gStart = new Date(g.startDate || today);
                  const gTarget = new Date(g.targetDate);
                  const gTotalDays = Math.max(1, Math.floor((gTarget - gStart) / (1000 * 60 * 60 * 24)));
                  const gElapsed = Math.max(0, Math.floor((today - gStart) / (1000 * 60 * 60 * 24)));
                  const gExpected = Math.round(g.targetAmount * Math.min(1, gElapsed / gTotalDays));
                  const gDailyPace = Math.max(1, Math.round(g.targetAmount / gTotalDays));
                  
                  const isDelayed = gSaved < (gExpected - 20) && gSaved < g.targetAmount;
                  const sidebarDaysGap = Math.max(1, Math.round(Math.abs(gSaved - gExpected) / gDailyPace));
                  const GoalIcon = ICON_MAP[g.category] || Target;

                  return (
                    <div
                      key={g.id}
                      onClick={() => setSelectedGoalId(g.id)}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'butter-highlight-card shadow-md ring-2 ring-[#1A1A18]' 
                          : 'butter-card hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-[#1A1A18] text-[#FEF6D8] flex items-center justify-center">
                            <GoalIcon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#706B5E]">
                            {g.badge || 'Goal'}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-black text-[#1A1A18]">{gPct}%</span>
                      </div>

                      <h3 className="text-base font-black text-[#1A1A18] mt-2">{g.name}</h3>

                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="font-semibold text-slate-700">
                          ₹{gSaved.toLocaleString()} <span className="text-[#706B5E] font-normal">/ ₹{g.targetAmount.toLocaleString()}</span>
                        </span>
                        {isDelayed && (
                          <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                            -{sidebarDaysGap}d delay
                          </span>
                        )}
                      </div>

                      <div className="w-full bg-[#EAE4D6] h-1.5 rounded-full overflow-hidden mt-3">
                        <div className="h-full bg-[#1A1A18] rounded-full" style={{ width: `${gPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Goal Command Card */}
              {activeGoal && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* Left Column */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="butter-highlight-card rounded-3xl p-5 sm:p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#1A1A18] text-[#FEF6D8] flex items-center justify-center shadow-md">
                            <ActiveIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-xl sm:text-2xl font-black text-[#1A1A18] tracking-tight">{activeGoal.name}</h2>
                              <span className="text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#1A1A18] text-[#FEF6D8]">
                                {activeGoal.badge}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#706B5E] mt-0.5">
                              Cap Target: ₹{activeGoal.targetAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button 
                            onClick={handleOpenEditGoal} 
                            className="p-2 text-[#706B5E] hover:text-black hover:bg-white/60 rounded-xl transition"
                            title="Edit Goal / Extend Timeline"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteGoal(activeGoal.id)} 
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white/60 rounded-xl transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Clean Date Box */}
                      <div className="bg-white/80 border border-[#EADBCC] rounded-2xl p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{activeGoal.startDate}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span>{activeGoal.targetDate}</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#1A1A18] bg-[#FAF9F5] border border-[#EADBCC] px-2.5 py-1 rounded-xl">
                          {daysLeft}d left
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            setTransferAmountStr('');
                            setTransferNote('');
                            setIsTransferModalOpen(true);
                          }}
                          className="bg-white border border-[#EADBCC] hover:bg-[#FAF9F5] text-[#1A1A18] font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-98"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" /> Shift Cash
                        </button>

                        {eligibleTargetGoals.length > 0 && (
                          <button
                            onClick={() => {
                              setTargetGoalId(eligibleTargetGoals[0].id);
                              setGoalTransferAmountStr('');
                              setGoalTransferNote('');
                              setIsGoalTransferModalOpen(true);
                            }}
                            className="bg-white border border-[#EADBCC] hover:bg-[#FAF9F5] text-[#1A1A18] font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-98"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Shift to Goal
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActionType('deposit');
                            setAmountStr('');
                            setNote('');
                            setIsTxModalOpen(true);
                          }}
                          className={`bg-[#1A1A18] hover:bg-black text-[#FEF6D8] font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-98 shadow-sm ${
                            eligibleTargetGoals.length === 0 ? 'sm:col-span-2' : ''
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" /> Add / Withdraw
                        </button>
                      </div>
                    </div>

                    {/* Schedule Velocity Card: Emerald Green on Track */}
                    <div className={`p-4 rounded-2xl border flex flex-col gap-1.5 ${
                      trajectoryStatus === 'delay' 
                        ? 'bg-rose-50 border-rose-200 text-rose-900' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {trajectoryStatus === 'delay' ? (
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                          <span className="font-black uppercase tracking-wider">SCHEDULE STATUS</span>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          trajectoryStatus === 'delay' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          {trajectoryStatus === 'delay' ? `-${daysDifference}d Behind (-₹${varianceAmount.toLocaleString()})` : 'On Track'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold leading-snug">
                        {trajectoryStatus === 'delay' ? (
                          <>
                            Schedule lag: {daysDifference} days. Suggested daily rate: ₹{requiredPace}/day.
                            <span onClick={handleOpenEditGoal} className="ml-1 underline font-bold cursor-pointer text-rose-700">
                              Extend target date?
                            </span>
                          </>
                        ) : (
                          <>
                            Pace is healthy. Daily target to finish on time: ₹{requiredPace}/day.
                          </>
                        )}
                      </p>
                    </div>

                    {/* Total Saved & Sub-Accounts */}
                    <div className="butter-card rounded-3xl p-5 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-[#706B5E] uppercase font-bold block">SAVED CAPITAL</span>
                          <span className="text-3xl font-black text-[#1A1A18]">₹{totalSaved.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-[#1A1A18]">{percentage}%</span>
                          <span className="text-[11px] text-[#706B5E] block font-medium">₹{remainingNeeded.toLocaleString()} remaining</span>
                        </div>
                      </div>

                      <div className="h-2 w-full bg-[#EAE4D6] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1A1A18] rounded-full" style={{ width: `${percentage}%` }} />
                      </div>

                      <div className="flex items-center gap-2 pt-2 text-xs">
                        <div className="bg-[#FAF9F5] border border-[#E6DEC8] px-3 py-1.5 rounded-xl font-bold">
                          Cash Stash: ₹{totalCash.toLocaleString()}
                        </div>
                        <div className="bg-[#FAF9F5] border border-[#E6DEC8] px-3 py-1.5 rounded-xl font-bold">
                          Bank Account: ₹{totalOnline.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    {/* Pace Box */}
                    <div className="butter-card rounded-3xl p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#EAE4D6] pb-2 text-xs">
                        <span className="font-bold text-[#1A1A18] uppercase tracking-wider">Pace & Horizon</span>
                        <span className="text-[10px] text-[#706B5E] font-bold">{daysLeft} days remaining</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#E6DEC8]">
                          <span className="text-[10px] text-[#706B5E] font-bold uppercase block">DAILY PACE</span>
                          <p className="text-lg font-black text-[#1A1A18] mt-0.5">₹{requiredPace}/d</p>
                        </div>
                        <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#E6DEC8]">
                          <span className="text-[10px] text-[#706B5E] font-bold uppercase block">TARGET REMAINING</span>
                          <p className="text-lg font-black text-[#1A1A18] mt-0.5">₹{remainingNeeded.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Stream Card */}
                    <div className="butter-card rounded-3xl p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#EAE4D6] pb-2 text-xs">
                        <span className="font-bold text-[#1A1A18] uppercase tracking-wider">Recent Activity</span>
                        <span className="text-[10px] text-[#706B5E]">{currentTxs.length} items</span>
                      </div>

                      <div className="divide-y divide-[#EAE4D6] max-h-72 overflow-y-auto">
                        {currentTxs.length === 0 ? (
                          <p className="text-xs text-[#706B5E] py-6 text-center">No transactions recorded for this goal.</p>
                        ) : (
                          currentTxs.slice(0, 7).map((tx) => {
                            const isWithdraw = tx.action === 'withdraw';
                            return (
                              <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                                <div>
                                  <p className="font-bold text-[#1A1A18]">{tx.note || 'Savings Entry'}</p>
                                  <p className="text-[10px] text-[#706B5E]">{tx.type} • {tx.date}</p>
                                </div>
                                <span className={`font-mono font-bold text-sm ${isWithdraw ? 'text-rose-600 font-black' : 'text-emerald-600 font-black'}`}>
                                  {isWithdraw ? '-' : '+'}₹{tx.amount.toLocaleString()}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-lg mx-auto">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A18] tracking-tight">Vault Settings</h1>
                <p className="text-xs text-[#706B5E]">Callsign and master reset controls.</p>
              </div>

              <div className="butter-card rounded-3xl p-5 space-y-3">
                <span className="text-xs font-bold uppercase text-[#706B5E] block">ACTIVE USER</span>
                <p className="text-base font-black text-[#1A1A18]">{user.email}</p>

                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-full mt-2 bg-[#FAF9F5] hover:bg-[#EAE4D6] text-slate-700 font-bold text-xs py-3 rounded-2xl transition border border-[#E0D8C3]"
                >
                  Sign Out of FinNest
                </button>
              </div>

              <div className="butter-card border-rose-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Danger Zone</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Resetting all data will permanently delete all goals, device savings, and transaction history.
                </p>

                <button
                  onClick={() => { setResetInput(''); setIsResetModalOpen(true); }}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset All Data
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 butter-card border-t border-[#E6DEC8] px-6 py-2 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between text-xs font-bold">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-[#1A1A18]' : 'text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'home' ? 'bg-[#FEF6D8]' : ''}`}>
              <HomeIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-[#1A1A18]' : 'text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'history' ? 'bg-[#FEF6D8]' : ''}`}>
              <History className="w-5 h-5" />
            </div>
            <span className="text-[10px]">History</span>
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'goals' ? 'text-[#1A1A18]' : 'text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'goals' ? 'bg-[#FEF6D8]' : ''}`}>
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Goals</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-[#1A1A18]' : 'text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'settings' ? 'bg-[#FEF6D8]' : ''}`}>
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Settings</span>
          </button>
        </div>
      </nav>

      {/* 1. TRANSACTION KEYPAD MODAL */}
      {isTxModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm butter-card rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-butter-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAE4D6] pb-3">
              <div className="flex-1 bg-[#FAF9F5] p-1 rounded-2xl flex border border-[#EADBCC]">
                <button
                  type="button"
                  onClick={() => setActionType('deposit')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                    actionType === 'deposit' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-600'
                  }`}
                >
                  Deposit (+)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('withdraw')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                    actionType === 'withdraw' 
                      ? 'bg-rose-600 text-white shadow-sm' 
                      : 'text-slate-600'
                  }`}
                >
                  Withdraw (−)
                </button>
              </div>
              <button onClick={() => setIsTxModalOpen(false)} className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#706B5E] flex items-center justify-center ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl p-4 text-center mt-3">
              <span className="text-[10px] text-[#706B5E] uppercase font-bold block">{activeGoal.name}</span>
              <div className="text-2xl font-black text-[#1A1A18] mt-1">
                <span className="text-slate-400 mr-1">₹</span>{amountStr ? Number(amountStr).toLocaleString() : '0'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={() => setWalletType('online')}
                className={`p-2.5 rounded-2xl border text-left text-xs ${
                  walletType === 'online' ? 'border-[#1A1A18] bg-[#FEF6D8] font-bold' : 'border-[#EADBCC] bg-white text-slate-600'
                }`}
              >
                <span className="block font-bold">Online</span>
                <span className="text-[10px] text-[#706B5E]">₹{totalOnline.toLocaleString()}</span>
              </button>
              <button
                type="button"
                onClick={() => setWalletType('cash')}
                className={`p-2.5 rounded-2xl border text-left text-xs ${
                  walletType === 'cash' ? 'border-[#1A1A18] bg-[#FEF6D8] font-bold' : 'border-[#EADBCC] bg-white text-slate-600'
                }`}
              >
                <span className="block font-bold">Cash</span>
                <span className="text-[10px] text-[#706B5E]">₹{totalCash.toLocaleString()}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-sm font-bold">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleTxKeypad(digit)}
                  className="h-11 bg-white border border-[#EADBCC] rounded-2xl hover:bg-[#FAF9F5] text-[#1A1A18] flex items-center justify-center active:scale-95"
                >
                  {digit}
                </button>
              ))}
              <button type="button" onClick={() => setAmountStr('')} className="h-11 bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl text-[#706B5E] text-xs">
                Clear
              </button>
              <button type="button" onClick={() => handleTxKeypad('0')} className="h-11 bg-white border border-[#EADBCC] rounded-2xl text-[#1A1A18]">
                0
              </button>
              <button type="button" onClick={() => setAmountStr((prev) => prev.slice(0, -1))} className="h-11 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 flex items-center justify-center">
                <Delete className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Memo note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs text-[#1A1A18] mt-3 focus:outline-none focus:bg-white"
            />

            <button
              type="button"
              onClick={handleTransactionSubmit}
              disabled={!amountStr || Number(amountStr) <= 0}
              className={`w-full py-3.5 text-white font-bold text-xs rounded-2xl mt-3 transition disabled:opacity-40 shadow-sm ${
                actionType === 'deposit' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Confirm {actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </button>
          </div>
        </div>
      )}

      {/* 2. CASH <-> BANK SHIFT MODAL */}
      {isTransferModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm butter-card rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-butter-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAE4D6] pb-3">
              <span className="font-black text-sm text-[#1A1A18]">Shift Vault Funds</span>
              <button onClick={() => setIsTransferModalOpen(false)} className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#706B5E] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={() => { setTransferDirection('cash_to_bank'); setTransferAmountStr(''); }}
                className={`p-2.5 rounded-2xl border text-left text-xs ${
                  transferDirection === 'cash_to_bank' ? 'border-[#1A1A18] bg-[#FEF6D8]' : 'border-[#EADBCC] bg-white'
                }`}
              >
                <span className="block font-bold">Cash ➔ Bank</span>
                <span className="text-[10px] text-[#706B5E]">Available: ₹{totalCash.toLocaleString()}</span>
              </button>

              <button
                type="button"
                onClick={() => { setTransferDirection('bank_to_cash'); setTransferAmountStr(''); }}
                className={`p-2.5 rounded-2xl border text-left text-xs ${
                  transferDirection === 'bank_to_cash' ? 'border-[#1A1A18] bg-[#FEF6D8]' : 'border-[#EADBCC] bg-white'
                }`}
              >
                <span className="block font-bold">Bank ➔ Cash</span>
                <span className="text-[10px] text-[#706B5E]">Available: ₹{totalOnline.toLocaleString()}</span>
              </button>
            </div>

            <div className="bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl p-3 text-center mt-3">
              <span className="text-[10px] text-[#706B5E] uppercase font-bold block">SUM TO SHIFT</span>
              <div className="text-2xl font-black text-[#1A1A18] mt-1">
                <span className="text-slate-400 mr-1">₹</span>{transferAmountStr ? Number(transferAmountStr).toLocaleString() : '0'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-sm font-bold">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleTransferKeypad(digit)}
                  className="h-11 bg-white border border-[#EADBCC] rounded-2xl text-[#1A1A18] flex items-center justify-center"
                >
                  {digit}
                </button>
              ))}
              <button type="button" onClick={() => setTransferAmountStr('')} className="h-11 bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl text-[#706B5E] text-xs">
                Clear
              </button>
              <button type="button" onClick={() => handleTransferKeypad('0')} className="h-11 bg-white border border-[#EADBCC] rounded-2xl text-[#1A1A18]">
                0
              </button>
              <button type="button" onClick={() => setTransferAmountStr((prev) => prev.slice(0, -1))} className="h-11 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 flex items-center justify-center">
                <Delete className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleTransferSubmit}
              disabled={!transferAmountStr || Number(transferAmountStr) <= 0}
              className="w-full py-3.5 bg-[#1A1A18] hover:bg-black text-[#FEF6D8] font-bold text-xs rounded-2xl mt-3 transition disabled:opacity-40"
            >
              Confirm Shift (₹{transferAmountStr ? Number(transferAmountStr).toLocaleString() : '0'})
            </button>
          </div>
        </div>
      )}

      {/* 3. CROSS-GOAL TRANSFER MODAL */}
      {isGoalTransferModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm butter-card rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-butter-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAE4D6] pb-3">
              <span className="font-black text-sm text-[#1A1A18]">Shift to Other Goal</span>
              <button onClick={() => setIsGoalTransferModalOpen(false)} className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#706B5E] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCrossGoalTransferSubmit} className="space-y-3 mt-3">
              <div>
                <label className="text-[10px] text-[#706B5E] uppercase font-bold block mb-1">DESTINATION GOAL</label>
                <select
                  value={targetGoalId}
                  onChange={(e) => setTargetGoalId(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A1A18] font-bold"
                  required
                >
                  {eligibleTargetGoals.map((g) => (
                    <option key={g.id} value={g.id}>{g.name} (Cap: ₹{g.targetAmount.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl p-3 text-center">
                <span className="text-[10px] text-[#706B5E] uppercase font-bold block">AMOUNT TO TRANSFER</span>
                <div className="text-2xl font-black text-[#1A1A18] mt-1">
                  <span className="text-slate-400 mr-1">₹</span>{goalTransferAmountStr ? Number(goalTransferAmountStr).toLocaleString() : '0'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm font-bold">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleGoalTransferKeypad(digit)}
                    className="h-11 bg-white border border-[#EADBCC] rounded-2xl text-[#1A1A18] flex items-center justify-center"
                  >
                    {digit}
                  </button>
                ))}
                <button type="button" onClick={() => setGoalTransferAmountStr('')} className="h-11 bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl text-[#706B5E] text-xs">
                  Clear
                </button>
                <button type="button" onClick={() => handleGoalTransferKeypad('0')} className="h-11 bg-white border border-[#EADBCC] rounded-2xl text-[#1A1A18]">
                  0
                </button>
                <button type="button" onClick={() => setGoalTransferAmountStr((prev) => prev.slice(0, -1))} className="h-11 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 flex items-center justify-center">
                  <Delete className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!goalTransferAmountStr || Number(goalTransferAmountStr) <= 0 || !targetGoalId}
                className="w-full py-3.5 bg-[#1A1A18] hover:bg-black text-[#FEF6D8] font-bold text-xs rounded-2xl mt-3 transition disabled:opacity-40"
              >
                Execute Goal Transfer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. NEW GOAL CREATION MODAL */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm butter-card rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-butter-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAE4D6] pb-3">
              <span className="font-black text-sm text-[#1A1A18]">Create New Target</span>
              <button onClick={() => setIsAddGoalOpen(false)} className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#706B5E] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3 mt-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">CATEGORY</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORY_PRESETS.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = newGoalCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewGoalCategory(cat.id)}
                        className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          isSelected ? 'bg-[#1A1A18] text-[#FEF6D8] border-[#1A1A18]' : 'bg-[#FAF9F5] text-slate-600 border-[#EADBCC]'
                        }`}
                      >
                        <CatIcon className="w-4 h-4" />
                        <span className="text-[10px] font-bold">{cat.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">TARGET TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. MacBook Air M2, Bali Trip"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A1A18]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">TARGET CAPITAL (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 120000"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A1A18]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">START DATE</label>
                  <input
                    type="date"
                    value={newGoalStartDate}
                    onChange={(e) => setNewGoalStartDate(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl px-2 py-2 text-xs text-[#1A1A18]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">TARGET END DATE</label>
                  <input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl px-2 py-2 text-xs text-[#1A1A18]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1A1A18] hover:bg-black text-[#FEF6D8] font-bold text-xs rounded-2xl mt-2 transition"
              >
                Initiate Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. EXTEND TIMELINE / EDIT MODAL */}
      {isEditGoalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm butter-card rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-butter-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAE4D6] pb-3">
              <span className="font-black text-sm text-[#1A1A18]">Extend Timeline / Modify Goal</span>
              <button onClick={() => setIsEditGoalOpen(false)} className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#706B5E] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoalChanges} className="space-y-3 mt-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">TITLE</label>
                <input
                  type="text"
                  value={editGoalName}
                  onChange={(e) => setEditGoalName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A1A18]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">TARGET AMOUNT (₹)</label>
                <input
                  type="number"
                  value={editGoalAmount}
                  onChange={(e) => setEditGoalAmount(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl px-3.5 py-2.5 text-xs text-[#1A1A18]"
                  required
                />
              </div>

              {/* Quick Preset Buttons for Easy Timeline Postponing */}
              <div className="bg-[#FAF9F5] border border-[#EADBCC] rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#1A1A18]" />
                    <span className="text-[10px] text-[#1A1A18] font-extrabold uppercase tracking-wider">
                      Extend Completion Deadline
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {daysLeft}d left
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickExtendDays(30)}
                    className="flex-1 py-1 text-[10px] font-bold bg-white border border-[#EADBCC] hover:bg-[#FEF6D8] rounded-xl transition"
                  >
                    +30d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExtendDays(90)}
                    className="flex-1 py-1 text-[10px] font-bold bg-white border border-[#EADBCC] hover:bg-[#FEF6D8] rounded-xl transition"
                  >
                    +3 mo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExtendDays(180)}
                    className="flex-1 py-1 text-[10px] font-bold bg-white border border-[#EADBCC] hover:bg-[#FEF6D8] rounded-xl transition"
                  >
                    +6 mo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExtendDays(365)}
                    className="flex-1 py-1 text-[10px] font-bold bg-white border border-[#EADBCC] hover:bg-[#FEF6D8] rounded-xl transition"
                  >
                    +1 yr
                  </button>
                </div>

                <div>
                  <label className="text-[9px] text-[#706B5E] font-semibold block mb-1">Pick specific date:</label>
                  <input
                    type="date"
                    value={editGoalDate}
                    onChange={(e) => setEditGoalDate(e.target.value)}
                    className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 text-xs text-[#1A1A18] font-semibold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingEdit}
                className="w-full py-3.5 bg-[#1A1A18] hover:bg-black text-[#FEF6D8] font-bold text-xs rounded-2xl mt-2 transition"
              >
                {isSavingEdit ? 'Saving...' : 'Save Extended Timeline'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. RESET ALL DATA MODAL */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm butter-card rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-butter-up">
            <div className="flex items-center justify-between border-b border-[#EAE4D6] pb-3 text-rose-700">
              <span className="font-black text-sm uppercase flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Reset All Data
              </span>
              <button onClick={() => setIsResetModalOpen(false)} className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#706B5E] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetAllData} className="mt-4 space-y-4 text-xs">
              <p className="text-[#706B5E] leading-relaxed font-medium">
                This action is <span className="text-rose-700 font-bold">permanent</span>. All your goals, transaction sessions, and allocations will be wiped from FinNest.
              </p>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B5E] block mb-1">
                  Type <span className="text-rose-700 font-black">RESET</span> to confirm
                </label>
                <input
                  type="text"
                  placeholder="RESET"
                  value={resetInput}
                  onChange={(e) => setResetInput(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-rose-300 rounded-2xl px-4 py-2.5 text-[#1A1A18] font-bold uppercase focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button type="button" onClick={() => setIsResetModalOpen(false)} className="py-2.5 bg-[#FAF9F5] text-[#706B5E] font-bold rounded-2xl">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetInput.trim().toUpperCase() !== 'RESET' || isResetting}
                  className="py-2.5 bg-rose-600 text-white font-bold rounded-2xl disabled:opacity-40"
                >
                  {isResetting ? 'Wiping...' : 'Confirm Reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}