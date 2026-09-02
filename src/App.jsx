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
  RotateCcw
} from 'lucide-react';

const CATEGORY_PRESETS = [
  { id: 'tech', label: 'Gadgets & Tech', icon: Laptop },
  { id: 'travel', label: 'Travel & Trips', icon: Plane },
  { id: 'vehicle', label: 'Vehicle & Auto', icon: Car },
  { id: 'education', label: 'Education & Study', icon: GraduationCap },
  { id: 'emergency', label: 'Emergency Fund', icon: ShieldAlert },
  { id: 'home', label: 'Home & Living', icon: Home },
  { id: 'health', label: 'Health & Wellness', icon: HeartPulse },
  { id: 'custom', label: 'Personal Target', icon: Sparkles },
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
  if (navigator.vibrate) navigator.vibrate(type === 'deposit' ? [25, 30] : [50]);
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
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
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
    <div className="min-h-screen bg-[#edf2f7] text-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="hidden sm:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300/40 via-purple-300/30 to-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-sky-300/35 via-teal-200/25 to-blue-200/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm bg-white sm:bg-white/70 sm:backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white shadow-[0_10px_35px_rgba(0,0,0,0.04)] relative z-10">
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md mb-1">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            {isSignUp ? 'Create Account' : 'Welcome to FinNest'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {isSignUp ? 'Sign up to track your private savings' : 'Sign in to access your ledger'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 pl-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 sm:bg-white/60 border border-slate-200 rounded-2xl pl-9 pr-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-slate-800 transition shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 pl-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 sm:bg-white/60 border border-slate-200 rounded-2xl pl-9 pr-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-slate-800 transition shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-xs font-bold text-slate-600 hover:text-indigo-700 transition"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
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
      confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 } });
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
    if (isCompleted) return { trajectoryStatus: 'completed', daysDifference: 0, trajectoryLabel: 'Completed' };

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
        trajectoryLabel: `-${diffDays}d Delayed (−₹${Math.abs(variance).toLocaleString()})`
      };
    } else {
      return {
        trajectoryStatus: 'on-track',
        daysDifference: 0,
        trajectoryLabel: 'On Track (0d gap)'
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
    if (confirm('Delete this goal and its cloud transaction history?')) {
      await supabase.from('goals').delete().eq('id', goalId);
      fetchData();
    }
  };

  const handleFormatAllData = async () => {
    if (!user) return;
    const confirmPrompt = prompt('WARNING: This permanently wipes all your goals and transactions!\n\nType "FORMAT" to confirm:');
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
      <div className="min-h-screen bg-[#edf2f7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  const ActiveIcon = activeGoal ? (ICON_MAP[activeGoal.category] || Target) : Target;

  return (
    <div className="min-h-screen bg-[#edf2f7] text-slate-900 flex flex-col antialiased relative overflow-x-hidden selection:bg-indigo-500/20">
      
      {/* Background Aurora Orbs - Desktop only */}
      <div className="hidden sm:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-gradient-to-br from-indigo-300/40 via-purple-300/30 to-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-sky-300/35 via-teal-200/25 to-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[650px] h-[650px] bg-gradient-to-tr from-emerald-200/30 via-teal-300/20 to-indigo-200/25 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <nav className="bg-white sm:bg-white/40 sm:backdrop-blur-2xl border-b border-slate-200/80 sm:border-white/60 shadow-xs sm:shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-sm">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight">FinNest</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {goals.length > 0 && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Total Portfolio</span>
                <span className="text-xs sm:text-sm font-black text-emerald-700">₹{portfolioTotal.toLocaleString()}</span>
              </div>
            )}

            <button
              onClick={handleFormatAllData}
              disabled={isFormatting}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 active:scale-95 transition flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
              title="Format data"
            >
              {isFormatting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              <span className="hidden sm:inline">Format Data</span>
            </button>

            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl flex items-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" /> <span>Add Goal</span>
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Goal Horizontal Scroller */}
      {goals.length > 0 && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-2.5 overflow-x-auto flex gap-2 no-scrollbar z-10">
          {goals.map((g) => {
            const isSelected = g.id === selectedGoalId;
            const GoalIcon = ICON_MAP[g.category] || Target;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGoalId(g.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 active:bg-slate-200'
                }`}
              >
                <GoalIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{g.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 py-4 sm:py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start relative z-10">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Active Goals ({goals.length})
            </h2>
            <button 
              onClick={() => setIsAddGoalOpen(true)}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-800"
            >
              + Create
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="bg-white/50 sm:backdrop-blur-2xl border border-white/70 rounded-3xl p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center mx-auto border border-white/60">
                <FolderPlus className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Goals Created</h3>
              <p className="text-xs text-slate-500">Add a goal to activate your cloud tracker.</p>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition shadow-sm"
              >
                Create First Goal
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
                    className={`p-4 rounded-3xl transition-all cursor-pointer relative border ${
                      isSelected 
                        ? 'bg-white/80 sm:backdrop-blur-2xl border-white shadow-md ring-1 ring-white/80' 
                        : 'bg-white/40 hover:bg-white/60 border-white/50 hover:border-white/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <GoalIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-slate-900 text-white' : 'bg-white/60 text-slate-700 border border-white/50'
                          }`}>
                            {g.badge || 'Goal'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{g.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-slate-500">Target: ₹{g.targetAmount.toLocaleString()}</p>
                          {isDelayed && (
                            <span className="text-[10px] font-extrabold text-rose-600 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded-md">
                              {sidebarDaysGap}d delayed
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-base font-black ${isSelected ? 'text-indigo-700' : 'text-slate-400'}`}>
                        {gPct}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200/50 h-1.5 rounded-full overflow-hidden mt-3">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-slate-400'}`}
                        style={{ width: `${gPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* Selected Goal Details */}
        <main className="lg:col-span-8 space-y-4 sm:space-y-6">
          {activeGoal ? (
            <>
              {/* Glass Hero Card */}
              <div className="bg-white sm:bg-white/60 sm:backdrop-blur-2xl border border-slate-200/60 sm:border-white/80 rounded-3xl p-4 sm:p-7 shadow-[0_12px_30px_rgba(0,0,0,0.03)] space-y-4 sm:space-y-6 relative overflow-hidden">
                <div className="hidden sm:block absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-white/40 via-white/10 to-transparent rounded-full pointer-events-none blur-xl" />

                {/* Header info */}
                <div className="space-y-3.5 pb-4 border-b border-slate-100 sm:border-slate-200/40 relative z-10">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 sm:p-3 bg-indigo-50 sm:bg-white/80 border border-slate-100 sm:border-white rounded-2xl text-indigo-700 shadow-xs shrink-0">
                        <ActiveIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">{activeGoal.name}</h1>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 sm:bg-white/70 border border-slate-200 sm:border-white/60 text-slate-700 rounded-md">
                            {activeGoal.badge}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Target: ₹{activeGoal.targetAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteGoal(activeGoal.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 active:bg-rose-50 rounded-xl transition"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dates Banner */}
                  <div className="flex items-center justify-between text-[11px] sm:text-xs bg-slate-50 sm:bg-white/50 border border-slate-100 sm:border-white/70 p-2.5 rounded-2xl font-medium text-slate-700">
                    <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{activeGoal.startDate || 'Start'}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{activeGoal.targetDate}</span>
                    </div>
                    <span className="font-bold text-indigo-700 bg-indigo-50 sm:bg-indigo-500/10 border border-indigo-200 sm:border-indigo-500/20 px-2 py-0.5 rounded-lg shrink-0">
                      {daysLeft}d left
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleOpenTransfer('cash_to_bank')}
                      className="bg-slate-100 sm:bg-white/60 hover:bg-slate-200 sm:hover:bg-white/80 active:scale-95 text-indigo-700 border border-slate-200 sm:border-white font-bold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" /> <span>Transfer</span>
                    </button>
                    <button
                      onClick={() => { setActionType('deposit'); setIsKeypadOpen(true); }}
                      className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> <span>Transaction</span>
                    </button>
                  </div>
                </div>

                {/* Delay vs Advance Status */}
                <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10 ${
                  trajectoryStatus === 'advance' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                    : trajectoryStatus === 'delay' 
                    ? 'bg-rose-50 border-rose-200 text-rose-950' 
                    : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                }`}>
                  <div className="flex items-center gap-2.5">
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
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">Status:</span>
                        <span className="text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-xs">
                          {trajectoryLabel}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-medium opacity-85 mt-0.5 leading-snug">
                        {trajectoryStatus === 'advance' 
                          ? `You are ${daysDifference}d ahead of schedule.` 
                          : trajectoryStatus === 'delay' 
                          ? `Behind by ${daysDifference}d. Save ₹${requiredPace}/day.` 
                          : 'Your progress is directly on track.'}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-[10px] sm:text-xs opacity-75 font-semibold pl-9 sm:pl-0">
                    Expected: ₹{Math.round(activeGoal.targetAmount * Math.min(1, daysElapsed / totalDurationDays)).toLocaleString()}
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="bg-slate-50 sm:bg-white/40 border border-slate-100 sm:border-white/70 rounded-2xl p-3 space-y-1.5 relative z-10">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Timeline Horizon</span>
                    <span className="font-bold text-slate-700">{daysElapsed} of {totalDurationDays}d ({timeProgressPct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-800 rounded-full transition-all duration-300" 
                      style={{ width: `${timeProgressPct}%` }}
                    />
                  </div>
                </div>

                {/* Savings Balance & Split Gauge */}
                <div className="space-y-3 pt-1 relative z-10">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Saved</span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">₹{totalSaved.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg sm:text-2xl font-black text-indigo-700">{percentage}%</span>
                      <span className="text-[10px] text-slate-500 block font-semibold">₹{remainingNeeded.toLocaleString()} left</span>
                    </div>
                  </div>

                  <div className="h-3 bg-slate-100 sm:bg-white/60 rounded-full overflow-hidden p-0.5 flex border border-slate-200 sm:border-white/80 shadow-inner">
                    <div 
                      className="h-full bg-emerald-500 rounded-l-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (totalCash / activeGoal.targetAmount) * 100)}%` }}
                    />
                    <div 
                      className="h-full bg-indigo-600 rounded-r-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (totalOnline / activeGoal.targetAmount) * 100)}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold pt-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <Banknote className="w-3.5 h-3.5" /> Cash: ₹{totalCash.toLocaleString()}
                      </span>
                      {totalCash > 0 && (
                        <button
                          onClick={() => handleOpenTransfer('cash_to_bank')}
                          className="text-[10px] font-bold text-emerald-800 bg-white border border-emerald-300 px-2 py-0.5 rounded-lg active:bg-emerald-50 transition"
                        >
                          Deposit in Bank ➔
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {totalOnline > 0 && (
                        <button
                          onClick={() => handleOpenTransfer('bank_to_cash')}
                          className="text-[10px] font-bold text-indigo-800 bg-white border border-indigo-300 px-2 py-0.5 rounded-lg active:bg-indigo-50 transition"
                        >
                          Withdraw to Cash ➔
                        </button>
                      )}
                      <span className="flex items-center gap-1.5 text-indigo-800">
                        <Smartphone className="w-3.5 h-3.5" /> Online: ₹{totalOnline.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Tiles */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                <div className="bg-white sm:bg-white/50 sm:backdrop-blur-2xl border border-slate-200/80 sm:border-white/70 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xs text-center sm:text-left">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Pace</span>
                  <p className="text-sm sm:text-xl font-black text-amber-700 mt-1">₹{requiredPace}<span className="text-[10px] font-normal text-slate-400">/d</span></p>
                </div>

                <div className="bg-white sm:bg-white/50 sm:backdrop-blur-2xl border border-slate-200/80 sm:border-white/70 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xs text-center sm:text-left">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Offset</span>
                  <p className={`text-sm sm:text-xl font-black mt-1 ${
                    trajectoryStatus === 'advance' ? 'text-emerald-700' : trajectoryStatus === 'delay' ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {trajectoryStatus === 'advance' ? `+${daysDifference}d` : trajectoryStatus === 'delay' ? `-${daysDifference}d` : '0d'}
                  </p>
                </div>

                <div className="bg-white sm:bg-white/50 sm:backdrop-blur-2xl border border-slate-200/80 sm:border-white/70 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xs text-center sm:text-left">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Horizon</span>
                  <p className="text-sm sm:text-xl font-black text-slate-900 mt-1">{daysLeft}d</p>
                </div>
              </div>

              {/* Transaction Ledger */}
              <div className="bg-white sm:bg-white/50 sm:backdrop-blur-2xl border border-slate-200/80 sm:border-white/70 rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-black text-slate-900">Transaction History</h2>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 sm:bg-white/70 border border-slate-200 sm:border-white/80 px-2 py-0.5 rounded-lg">
                    {currentTxs.length} records
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {currentTxs.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No transactions logged yet.</p>
                  ) : (
                    currentTxs.map((tx) => (
                      <div key={tx.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl border border-slate-100 sm:border-white/60 shadow-xs ${tx.type === 'online' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {tx.type === 'online' ? <Smartphone className="w-3.5 h-3.5" /> : <Banknote className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-tight">{tx.note}</p>
                            <p className="text-[10px] text-slate-500 capitalize">{tx.type} • {tx.date}</p>
                          </div>
                        </div>
                        <span className={`text-xs sm:text-sm font-black ${tx.action === 'withdraw' ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {tx.action === 'withdraw' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white sm:bg-white/50 sm:backdrop-blur-2xl border border-slate-200/80 sm:border-white/70 rounded-3xl p-10 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 sm:bg-white/80 border border-slate-200 sm:border-white text-slate-500 flex items-center justify-center mx-auto">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900">No Goal Selected</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Create your first financial target to start tracking progress.
              </p>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-2xl active:scale-95 shadow-md transition"
              >
                + Add Goal
              </button>
            </div>
          )}
        </main>
      </div>

      {/* GPU Accelerated Keypad Modal */}
      {isKeypadOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center overflow-y-auto">
          <div className="relative w-full max-w-md my-auto sm:my-0 bg-white rounded-t-3xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl border border-slate-100 flex flex-col shrink-0 max-h-[88vh] overflow-y-auto transform-gpu will-change-transform">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setActionType('deposit')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${actionType === 'deposit' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
                >
                  Deposit (+)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('withdraw')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${actionType === 'withdraw' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'}`}
                >
                  Withdraw (−)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('transfer')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${actionType === 'transfer' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'}`}
                >
                  <ArrowLeftRight className="w-3 h-3" /> Transfer
                </button>
              </div>
              <button 
                onClick={() => setIsKeypadOpen(false)} 
                className="p-1.5 rounded-full bg-slate-100 active:bg-slate-200 text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {actionType === 'transfer' && (
              <div className="mt-2">
                <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTransferDirection('cash_to_bank')}
                    className={`py-1 px-2 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition ${
                      transferDirection === 'cash_to_bank' ? 'bg-white text-indigo-700 shadow-xs border border-slate-200' : 'text-slate-600'
                    }`}
                  >
                    <Banknote className="w-3 h-3" /> Cash ➔ Bank
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferDirection('bank_to_cash')}
                    className={`py-1 px-2 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition ${
                      transferDirection === 'bank_to_cash' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" /> Bank ➔ Cash
                  </button>
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center mt-2 shadow-inner">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                {actionType === 'transfer' 
                  ? (transferDirection === 'cash_to_bank' ? 'Cash to Bank' : 'Bank to Cash') 
                  : `Amount (${activeGoal.name})`}
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                <span className="text-indigo-600 mr-1 text-lg">₹</span>
                {amountStr ? Number(amountStr).toLocaleString() : '0'}
              </div>
            </div>

            {actionType !== 'transfer' && (
              <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={() => setWalletType('online')}
                  className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1 transition ${
                    walletType === 'online' ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-black shadow-xs' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-3 h-3" /> Online (₹{totalOnline.toLocaleString()})
                </button>
                <button
                  type="button"
                  onClick={() => setWalletType('cash')}
                  className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1 transition ${
                    walletType === 'cash' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-black shadow-xs' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <Banknote className="w-3 h-3" /> Cash (₹{totalCash.toLocaleString()})
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="h-9 sm:h-11 bg-slate-50 active:bg-slate-200 text-slate-900 font-bold text-base rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center transition"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmountStr('')}
                className="h-9 sm:h-11 bg-amber-50 active:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 flex items-center justify-center transition"
              >
                CLR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-9 sm:h-11 bg-slate-50 active:bg-slate-200 text-slate-900 font-bold text-base rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center transition"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setAmountStr((prev) => prev.slice(0, -1))}
                className="h-9 sm:h-11 bg-rose-50 active:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center transition"
              >
                <Delete className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              type="text"
              inputMode="text"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 mt-2 font-medium focus:outline-none focus:bg-white focus:border-slate-800"
            />

            <button
              type="button"
              onClick={handleTransactionSubmit}
              disabled={!amountStr || Number(amountStr) <= 0}
              className={`w-full py-2.5 rounded-xl font-bold text-xs text-white transition active:scale-95 disabled:opacity-40 mt-2 shadow-md ${
                actionType === 'transfer'
                  ? (transferDirection === 'cash_to_bank' ? 'bg-indigo-600 active:bg-indigo-700' : 'bg-emerald-600 active:bg-emerald-700')
                  : actionType === 'deposit'
                  ? 'bg-slate-900 active:bg-slate-800'
                  : 'bg-rose-600 active:bg-rose-700'
              }`}
            >
              {actionType === 'transfer'
                ? `Confirm Transfer (₹${amountStr ? Number(amountStr).toLocaleString() : '0'})`
                : `Confirm ${actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Goal Modal */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[92dvh] overflow-y-auto bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 transform-gpu">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">Create Financial Target</h3>
              </div>
              <button onClick={() => setIsAddGoalOpen(false)} className="p-1 rounded-full bg-slate-100 active:bg-slate-200 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1.5">Category</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {CATEGORY_PRESETS.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = newGoalCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewGoalCategory(cat.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition ${
                          isSelected 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 active:bg-slate-100'
                        }`}
                      >
                        <CatIcon className={`w-4 h-4 mb-1 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                        <span className="text-[9px] font-bold line-clamp-1">{cat.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. iPhone, Goa Trip, Bike"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">Target Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 100000"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">Start Date</label>
                  <input
                    type="date"
                    value={newGoalStartDate}
                    onChange={(e) => setNewGoalStartDate(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">End Date</label>
                  <input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-2xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-2xl active:scale-95 shadow-md mt-2 transition"
              >
                Launch Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}