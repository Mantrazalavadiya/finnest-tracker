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
  FolderPlus,
  Laptop,
  Plane,
  ShieldAlert,
  GraduationCap,
  Home,
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
  TrendingUp,
  Wallet
} from 'lucide-react';

const CATEGORY_PRESETS = [
  { id: 'tech', label: 'Gadgets & Tech', icon: Laptop, color: 'from-blue-500 to-indigo-600' },
  { id: 'travel', label: 'Travel & Trips', icon: Plane, color: 'from-amber-500 to-orange-600' },
  { id: 'vehicle', label: 'Vehicle & Auto', icon: Car, color: 'from-rose-500 to-red-600' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'from-emerald-500 to-teal-600' },
  { id: 'emergency', label: 'Emergency Fund', icon: ShieldAlert, color: 'from-purple-500 to-indigo-700' },
  { id: 'home', label: 'Home & Living', icon: Home, color: 'from-cyan-500 to-blue-600' },
  { id: 'health', label: 'Health & Wellness', icon: HeartPulse, color: 'from-pink-500 to-rose-600' },
  { id: 'custom', label: 'Personal Target', icon: Sparkles, color: 'from-violet-500 to-purple-700' },
];

const ICON_MAP = {
  tech: Laptop,
  travel: Plane,
  vehicle: Car,
  education: GraduationCap,
  emergency: ShieldAlert,
  home: Home,
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
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="hidden sm:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-gradient-to-br from-indigo-300/30 via-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-glow" />
        <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] bg-gradient-to-bl from-sky-300/30 via-teal-200/20 to-blue-200/20 rounded-full blur-3xl animate-glow" />
      </div>

      <div className="w-full max-w-sm bg-white border border-slate-200/80 shadow-xl rounded-3xl p-6 sm:p-8 relative z-10 animate-slide-up">
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center text-white shadow-lg shadow-indigo-950/20 mb-1 ring-4 ring-indigo-50">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            {isSignUp ? 'Create your Vault' : 'Welcome back to FinNest'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {isSignUp ? 'Start mapping out your financial goals today' : 'Enter your credentials to access your goals'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-center flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1">Master Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 active:scale-[0.98] text-white font-bold text-xs rounded-2xl transition shadow-lg shadow-slate-900/15 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Verifying credentials...' : isSignUp ? 'Create Free Account' : 'Sign In to Vault'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-xs font-bold text-slate-600 hover:text-indigo-600 active:underline transition"
          >
            {isSignUp ? 'Already have an account? Sign in' : "New to FinNest? Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [txStore, setTxStore] = useState({});

  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);

  const [actionType, setActionType] = useState('deposit');
  const [transferDirection, setTransferDirection] = useState('cash_to_bank');
  const [walletType, setWalletType] = useState('online');
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');

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
          date: t.date
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
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
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

  const { trajectoryStatus, daysDifference, trajectoryLabel } = useMemo(() => {
    if (!activeGoal) return { trajectoryStatus: 'on-track', daysDifference: 0, trajectoryLabel: 'On Track' };
    if (isCompleted) return { trajectoryStatus: 'completed', daysDifference: 0, trajectoryLabel: 'Target Achieved' };

    const timeFraction = Math.min(1, Math.max(0, daysElapsed / totalDurationDays));
    const expectedSavedByNow = Math.round(activeGoal.targetAmount * timeFraction);
    const variance = totalSaved - expectedSavedByNow;
    const diffDays = Math.round(Math.abs(variance) / baselineDailyPace);

    if (variance > 1000) {
      return {
        trajectoryStatus: 'advance',
        daysDifference: diffDays,
        trajectoryLabel: `+${diffDays}d Ahead (+₹${variance.toLocaleString()})`
      };
    } else if (variance < -1000) {
      return {
        trajectoryStatus: 'delay',
        daysDifference: diffDays,
        trajectoryLabel: `-${diffDays}d Behind (−₹${Math.abs(variance).toLocaleString()})`
      };
    } else {
      return {
        trajectoryStatus: 'on-track',
        daysDifference: 0,
        trajectoryLabel: 'On Schedule (0d gap)'
      };
    }
  }, [activeGoal, isCompleted, daysElapsed, totalDurationDays, totalSaved, baselineDailyPace]);

  const handleKeypadPress = (digit) => {
    if (amountStr.length >= 8) return;
    setAmountStr((prev) => (prev === '0' ? digit : prev + digit));
  };

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
    } else if (actionType === 'transfer') {
      if (transferDirection === 'cash_to_bank') {
        if (val > totalCash) {
          alert(`Cannot transfer ₹${val.toLocaleString()}. You only have ₹${totalCash.toLocaleString()} in physical cash!`);
          return;
        }

        await supabase.from('transactions').insert([
          {
            user_id: user.id,
            goal_id: activeGoal.id,
            amount: val,
            action: 'withdraw',
            type: 'cash',
            note: note.trim() ? `Cash ➔ Bank (${note.trim()})` : 'Transferred Cash to Bank / UPI',
            date: todayStr
          },
          {
            user_id: user.id,
            goal_id: activeGoal.id,
            amount: val,
            action: 'deposit',
            type: 'online',
            note: note.trim() ? `Received in Bank (${note.trim()})` : 'Deposited from Cash Stash',
            date: todayStr
          }
        ]);
      } else {
        if (val > totalOnline) {
          alert(`Cannot withdraw ₹${val.toLocaleString()} to cash. You only have ₹${totalOnline.toLocaleString()} in Bank / Online!`);
          return;
        }

        await supabase.from('transactions').insert([
          {
            user_id: user.id,
            goal_id: activeGoal.id,
            amount: val,
            action: 'withdraw',
            type: 'online',
            note: note.trim() ? `Bank ➔ Cash (${note.trim()})` : 'Withdrew from Bank to Cash Stash',
            date: todayStr
          },
          {
            user_id: user.id,
            goal_id: activeGoal.id,
            amount: val,
            action: 'deposit',
            type: 'cash',
            note: note.trim() ? `Cash from Bank (${note.trim()})` : 'Cash added from Bank / ATM',
            date: todayStr
          }
        ]);
      }
      playSound('transfer');
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
    setIsKeypadOpen(false);
    fetchData();
  };

  const handleOpenTransfer = (direction = 'cash_to_bank') => {
    setActionType('transfer');
    setTransferDirection(direction);
    setAmountStr('');
    setNote('');
    setIsKeypadOpen(true);
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalAmount || !newGoalDate || !newGoalStartDate || !user) return;

    if (new Date(newGoalDate) <= new Date(newGoalStartDate)) {
      alert("Ending Date must be after Starting Date.");
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
    if (confirm('Delete this goal and all associated cloud transaction history?')) {
      await supabase.from('goals').delete().eq('id', goalId);
      fetchData();
    }
  };

  const handleFormatAllData = async () => {
    if (!user) return;
    const confirmPrompt = prompt('DANGER: This action clears all records permanently!\n\nType "FORMAT" to confirm:');
    if (confirmPrompt !== 'FORMAT') {
      if (confirmPrompt !== null) alert('Action cancelled.');
      return;
    }

    setIsFormatting(true);
    try {
      await supabase.from('transactions').delete().eq('user_id', user.id);
      await supabase.from('goals').delete().eq('user_id', user.id);
      localStorage.removeItem('finnest_goals');
      localStorage.removeItem('finnest_txs');

      setGoals([]);
      setTxStore({});
      setSelectedGoalId(null);
      alert('Data reset completed.');
    } catch (err) {
      console.error('Format error:', err.message);
      alert('Failed to format: ' + err.message);
    } finally {
      setIsFormatting(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  const ActiveIcon = activeGoal ? (ICON_MAP[activeGoal.category] || Target) : Target;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased relative overflow-x-hidden selection:bg-indigo-500/20">
      
      {/* Background Ambience */}
      <div className="hidden sm:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-gradient-to-br from-indigo-200/30 via-purple-100/20 to-pink-100/20 rounded-full blur-3xl animate-glow" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-sky-200/25 via-teal-100/20 to-blue-100/20 rounded-full blur-3xl animate-glow" />
      </div>

      {/* Header Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10 ring-2 ring-indigo-50">
              <Layers className="w-4 h-4 text-indigo-200" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 block leading-tight">FinNest</span>
              <span className="text-[10px] font-semibold text-slate-400 block tracking-wide uppercase">Savings Tracker</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {goals.length > 0 && (
              <div className="hidden sm:flex items-center gap-2.5 bg-slate-100/70 border border-slate-200/60 px-3.5 py-1.5 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Total Vault</span>
                  <span className="text-xs font-black text-slate-900">₹{portfolioTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleFormatAllData}
              disabled={isFormatting}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 active:scale-95 transition flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
              title="Reset records"
            >
              {isFormatting ? <Loader2 className="w-4 h-4 animate-spin text-rose-600" /> : <RotateCcw className="w-4 h-4" />}
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" /> <span>New Goal</span>
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Horizontal Carousel (Mobile) */}
      {goals.length > 0 && (
        <div className="lg:hidden border-b border-slate-200/80 bg-white/60 backdrop-blur-sm px-4 py-2.5 overflow-x-auto flex gap-2 no-scrollbar z-10">
          {goals.map((g) => {
            const isSelected = g.id === selectedGoalId;
            const GoalIcon = ICON_MAP[g.category] || Target;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGoalId(g.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 ring-2 ring-slate-900'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <GoalIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{g.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Grid View */}
      <div className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 py-4 sm:py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start relative z-10">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Your Goals ({goals.length})
            </h2>
            <button 
              onClick={() => setIsAddGoalOpen(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              + Create Goal
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
                <FolderPlus className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No active goals found</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Create a goal to begin logging allocations and monitoring schedules.</p>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl active:scale-95 transition shadow-sm"
              >
                Set up first goal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((g) => {
                const isSelected = g.id === selectedGoalId;
                const gTxs = txStore[g.id] || [];
                let gSaved = 0;
                gTxs.forEach((t) => {
                  gSaved += (t.action === 'withdraw' ? -t.amount : t.amount);
                });
                gSaved = Math.max(0, gSaved);
                const gPct = Math.min(100, Math.round((gSaved / g.targetAmount) * 100));
                const GoalIcon = ICON_MAP[g.category] || Target;

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
                    className={`p-4 rounded-3xl transition-all duration-200 cursor-pointer relative border active:scale-[0.99] ${
                      isSelected 
                        ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-500/10' 
                        : 'bg-white/60 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <GoalIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {g.badge || 'Goal'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{g.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-slate-500 font-medium">₹{gSaved.toLocaleString()} / ₹{g.targetAmount.toLocaleString()}</p>
                          {isDelayed && (
                            <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-md">
                              {sidebarDaysGap}d behind
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-base font-black ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {gPct}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        style={{ width: `${gPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* Selected Goal Content */}
        <main className="lg:col-span-8 space-y-4 sm:space-y-6">
          {activeGoal ? (
            <>
              {/* Primary Metric Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 relative overflow-hidden transition-all duration-300">
                
                {/* Header Section */}
                <div className="space-y-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-2xl shadow-md ring-4 ring-indigo-50 shrink-0">
                        <ActiveIcon className="w-6 h-6 text-indigo-200" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{activeGoal.name}</h1>
                          <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg border border-slate-200/60">
                            {activeGoal.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Target Cap: ₹{activeGoal.targetAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteGoal(activeGoal.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 rounded-xl transition"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Schedule Indicator */}
                  <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200/70 p-3 rounded-2xl font-semibold text-slate-700">
                    <div className="flex items-center gap-2 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{activeGoal.startDate || 'Started'}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{activeGoal.targetDate}</span>
                    </div>
                    <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-xl shrink-0">
                      {daysLeft} days remaining
                    </span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => handleOpenTransfer('cash_to_bank')}
                      className="bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-indigo-700 border border-slate-200 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-indigo-600" /> 
                      <span>Transfer Funds</span>
                    </button>
                    <button
                      onClick={() => { setActionType('deposit'); setIsKeypadOpen(true); }}
                      className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20"
                    >
                      <Plus className="w-4 h-4" /> 
                      <span>Log Transaction</span>
                    </button>
                  </div>
                </div>

                {/* Status Horizon Badge */}
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  trajectoryStatus === 'advance' 
                    ? 'bg-emerald-50 border-emerald-200/80 text-emerald-950' 
                    : trajectoryStatus === 'delay' 
                    ? 'bg-rose-50 border-rose-200/80 text-rose-950' 
                    : 'bg-indigo-50 border-indigo-200/80 text-indigo-950'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 shadow-xs ${
                      trajectoryStatus === 'advance' 
                        ? 'bg-emerald-600 text-white' 
                        : trajectoryStatus === 'delay' 
                        ? 'bg-rose-600 text-white' 
                        : 'bg-indigo-600 text-white'
                    }`}>
                      {trajectoryStatus === 'advance' ? <Zap className="w-4 h-4" /> : trajectoryStatus === 'delay' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-wider">Schedule Velocity:</span>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                          {trajectoryLabel}
                        </span>
                      </div>
                      <p className="text-xs font-medium opacity-80 mt-1 leading-snug">
                        {trajectoryStatus === 'advance' 
                          ? `You are ${daysDifference} days ahead of target pace.` 
                          : trajectoryStatus === 'delay' 
                          ? `Pacing lag: ${daysDifference} days. Required: ₹${requiredPace}/day.` 
                          : 'You are completely aligned with the projected timeline.'}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs opacity-80 font-bold pl-11 sm:pl-0">
                    Scheduled by now: ₹{Math.round(activeGoal.targetAmount * Math.min(1, daysElapsed / totalDurationDays)).toLocaleString()}
                  </div>
                </div>

                {/* Time Progress */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Timeline Window</span>
                    <span className="font-bold text-slate-700">{daysElapsed} of {totalDurationDays} days ({timeProgressPct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-800 rounded-full transition-all duration-500" 
                      style={{ width: `${timeProgressPct}%` }}
                    />
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Vault Saved</span>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">₹{totalSaved.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-indigo-600">{percentage}%</span>
                      <span className="text-xs text-slate-400 block font-semibold">₹{remainingNeeded.toLocaleString()} to reach target</span>
                    </div>
                  </div>

                  {/* Dual Segment Fill Indicator */}
                  <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 flex border border-slate-200/80 shadow-inner">
                    <div 
                      className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalCash / activeGoal.targetAmount) * 100)}%` }}
                    />
                    <div 
                      className="h-full bg-indigo-600 rounded-r-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalOnline / activeGoal.targetAmount) * 100)}%` }}
                    />
                  </div>

                  {/* Sub-account Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold pt-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-xl">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Cash: ₹{totalCash.toLocaleString()}
                      </span>
                      {totalCash > 0 && (
                        <button
                          onClick={() => handleOpenTransfer('cash_to_bank')}
                          className="text-[11px] font-bold text-emerald-700 bg-white border border-emerald-300 px-2.5 py-1 rounded-xl active:bg-emerald-50 transition shadow-2xs"
                        >
                          To Bank ➔
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {totalOnline > 0 && (
                        <button
                          onClick={() => handleOpenTransfer('bank_to_cash')}
                          className="text-[11px] font-bold text-indigo-700 bg-white border border-indigo-300 px-2.5 py-1 rounded-xl active:bg-indigo-50 transition shadow-2xs"
                        >
                          To Cash ➔
                        </button>
                      )}
                      <span className="flex items-center gap-1.5 text-indigo-800 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 rounded-xl">
                        <Smartphone className="w-3.5 h-3.5 text-indigo-600" /> Bank: ₹{totalOnline.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-3xl shadow-2xs">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Required Pace</span>
                  </div>
                  <p className="text-base sm:text-xl font-black text-slate-900">
                    ₹{requiredPace}<span className="text-xs font-normal text-slate-400">/day</span>
                  </p>
                </div>

                <div className="bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-3xl shadow-2xs">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Zap className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Variance</span>
                  </div>
                  <p className={`text-base sm:text-xl font-black ${
                    trajectoryStatus === 'advance' ? 'text-emerald-600' : trajectoryStatus === 'delay' ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {trajectoryStatus === 'advance' ? `+${daysDifference}d` : trajectoryStatus === 'delay' ? `-${daysDifference}d` : '0d'}
                  </p>
                </div>

                <div className="bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-3xl shadow-2xs">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Remaining</span>
                  </div>
                  <p className="text-base sm:text-xl font-black text-slate-900">{daysLeft} days</p>
                </div>
              </div>

              {/* Transaction Stream */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-slate-500" />
                    <h2 className="text-sm sm:text-base font-black text-slate-900">Transaction History</h2>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-lg">
                    {currentTxs.length} items
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                  {currentTxs.length === 0 ? (
                    <div className="py-8 text-center space-y-1">
                      <p className="text-xs font-semibold text-slate-400">No transactions recorded yet</p>
                      <p className="text-[11px] text-slate-400">Use the transaction action above to log an entry.</p>
                    </div>
                  ) : (
                    currentTxs.map((tx) => (
                      <div key={tx.id} className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-1 rounded-xl transition">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-2xl border shadow-2xs ${
                            tx.type === 'online' 
                              ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                              : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          }`}>
                            {tx.type === 'online' ? <Smartphone className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-snug">{tx.note}</p>
                            <p className="text-[10px] text-slate-400 font-medium capitalize">{tx.type} • {tx.date}</p>
                          </div>
                        </div>
                        <span className={`text-xs sm:text-sm font-black tracking-tight ${
                          tx.action === 'withdraw' ? 'text-rose-600' : 'text-emerald-700'
                        }`}>
                          {tx.action === 'withdraw' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 shadow-sm animate-slide-up">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-lg font-black text-slate-900">No Target Active</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Create a goal to begin tracking your cash and online savings with timeline tracking.
              </p>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-2xl active:scale-95 shadow-md shadow-indigo-600/20 transition"
              >
                + Create New Target
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Input Modal */}
      {isKeypadOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center overflow-y-auto">
          <div className="relative w-full max-w-md my-auto sm:my-0 bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-100 flex flex-col shrink-0 max-h-[90vh] overflow-y-auto animate-slide-up">
            
            {/* Header controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setActionType('deposit')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    actionType === 'deposit' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Deposit (+)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('withdraw')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    actionType === 'withdraw' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Withdraw (−)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('transfer')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                    actionType === 'transfer' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Transfer
                </button>
              </div>
              <button 
                onClick={() => setIsKeypadOpen(false)} 
                className="p-2 rounded-full bg-slate-100 active:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Transfer Mode Layout */}
            {actionType === 'transfer' && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/70">
                  <button
                    type="button"
                    onClick={() => {
                      setTransferDirection('cash_to_bank');
                      setAmountStr('');
                    }}
                    className={`py-2 px-3 rounded-xl text-left transition flex flex-col justify-between ${
                      transferDirection === 'cash_to_bank' 
                        ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80 ring-1 ring-indigo-500/20' 
                        : 'text-slate-600 hover:text-slate-900 active:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Cash ➔ Bank
                      </span>
                      {transferDirection === 'cash_to_bank' && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">Available:</span>
                      <span className="text-xs font-black text-emerald-700">₹{totalCash.toLocaleString()}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTransferDirection('bank_to_cash');
                      setAmountStr('');
                    }}
                    className={`py-2 px-3 rounded-xl text-left transition flex flex-col justify-between ${
                      transferDirection === 'bank_to_cash' 
                        ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80 ring-1 ring-indigo-500/20' 
                        : 'text-slate-600 hover:text-slate-900 active:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-indigo-600" /> Bank ➔ Cash
                      </span>
                      {transferDirection === 'bank_to_cash' && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">Available:</span>
                      <span className="text-xs font-black text-indigo-700">₹{totalOnline.toLocaleString()}</span>
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between px-1 text-xs">
                  <span className="text-slate-500 font-medium">
                    Origin: {transferDirection === 'cash_to_bank' ? 'Physical Stash' : 'Bank Balance'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAmountStr(String(transferDirection === 'cash_to_bank' ? totalCash : totalOnline))}
                    className="font-bold text-indigo-700 hover:text-indigo-900 active:scale-95 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/60"
                  >
                    Transfer Max (₹{(transferDirection === 'cash_to_bank' ? totalCash : totalOnline).toLocaleString()})
                  </button>
                </div>
              </div>
            )}

            {/* Numeric Display Area */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center mt-3 shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {actionType === 'transfer' 
                  ? (transferDirection === 'cash_to_bank' ? 'Cash to Online Transfer' : 'Online to Cash Transfer') 
                  : `Amount to ${actionType} (${activeGoal.name})`}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                <span className="text-indigo-600 mr-1 text-xl">₹</span>
                {amountStr ? Number(amountStr).toLocaleString() : '0'}
              </div>
            </div>

            {/* Wallet Selection for standard txs */}
            {actionType !== 'transfer' && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setWalletType('online')}
                  className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    walletType === 'online' 
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-black shadow-xs ring-1 ring-indigo-400/20' 
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Online (₹{totalOnline.toLocaleString()})
                </button>
                <button
                  type="button"
                  onClick={() => setWalletType('cash')}
                  className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    walletType === 'cash' 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-black shadow-xs ring-1 ring-emerald-400/20' 
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" /> Cash (₹{totalCash.toLocaleString()})
                </button>
              </div>
            )}

            {/* Soft-touch Number Pad */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="h-11 sm:h-12 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-lg rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-center transition active:scale-[0.96]"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmountStr('')}
                className="h-11 sm:h-12 bg-amber-50 active:bg-amber-100 text-amber-800 font-bold text-xs rounded-2xl border border-amber-200 flex items-center justify-center transition active:scale-[0.96]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-11 sm:h-12 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-lg rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-center transition active:scale-[0.96]"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setAmountStr((prev) => prev.slice(0, -1))}
                className="h-11 sm:h-12 bg-rose-50 active:bg-rose-100 text-rose-700 font-bold text-xs rounded-2xl border border-rose-200 flex items-center justify-center transition active:scale-[0.96]"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Add memo/note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 mt-3 font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition"
            />

            <button
              type="button"
              onClick={handleTransactionSubmit}
              disabled={!amountStr || Number(amountStr) <= 0}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs text-white transition active:scale-[0.98] disabled:opacity-40 mt-3 shadow-md ${
                actionType === 'transfer'
                  ? 'bg-indigo-600 active:bg-indigo-700 shadow-indigo-600/20'
                  : actionType === 'deposit'
                  ? 'bg-emerald-600 active:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-rose-600 active:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              {actionType === 'transfer'
                ? `Submit Transfer (₹${amountStr ? Number(amountStr).toLocaleString() : '0'})`
                : `Log ${actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
            </button>
          </div>
        </div>
      )}

      {/* Goal Creator Modal */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-100 animate-slide-up">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 text-base">New Financial Goal</h3>
              </div>
              <button onClick={() => setIsAddGoalOpen(false)} className="p-2 rounded-full bg-slate-100 active:bg-slate-200 text-slate-400 hover:text-slate-700 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Select Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORY_PRESETS.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = newGoalCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewGoalCategory(cat.id)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition active:scale-95 ${
                          isSelected 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900' 
                            : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100/70'
                        }`}
                      >
                        <CatIcon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-indigo-300' : 'text-slate-500'}`} />
                        <span className="text-[10px] font-bold line-clamp-1">{cat.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Title</label>
                <input
                  type="text"
                  placeholder="e.g. MacBook Pro, Bali Trip, Car Downpayment"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Capital (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Starting Horizon</label>
                  <input
                    type="date"
                    value={newGoalStartDate}
                    onChange={(e) => setNewGoalStartDate(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completion Target</label>
                  <input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-2xl active:scale-[0.98] shadow-lg shadow-slate-900/15 mt-2 transition"
              >
                Initiate Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}