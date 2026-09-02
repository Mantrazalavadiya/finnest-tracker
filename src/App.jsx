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
  { id: 'tech', label: 'Gadgets & Tech', icon: Laptop },
  { id: 'travel', label: 'Travel & Trips', icon: Plane },
  { id: 'vehicle', label: 'Vehicle & Auto', icon: Car },
  { id: 'education', label: 'Education', icon: GraduationCap },
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2A26] flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-sm bg-white border border-[#F1E8DF] shadow-[0_12px_32px_rgba(224,122,95,0.08)] rounded-3xl p-6 sm:p-8 animate-warm-up">
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E07A5F] flex items-center justify-center text-white shadow-md shadow-[#E07A5F]/20 mb-1">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-[#2D2A26] tracking-tight">
            {isSignUp ? 'Create Warm Vault' : 'Welcome to FinNest'}
          </h1>
          <p className="text-xs text-[#7D756D] font-medium">
            {isSignUp ? 'Organize your goals with calm, mindful tracking' : 'Sign in to review your savings progress'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C948B] pl-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9C948B] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#2D2A26] focus:outline-none focus:bg-white focus:border-[#E07A5F] transition shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C948B] pl-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9C948B] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#2D2A26] focus:outline-none focus:bg-white focus:border-[#E07A5F] transition shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-[#E07A5F] hover:bg-[#D46B50] active:scale-[0.98] text-white font-bold text-xs rounded-2xl transition shadow-md shadow-[#E07A5F]/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Open Vault'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-[#F1E8DF]">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-xs font-bold text-[#7D756D] hover:text-[#E07A5F] transition"
          >
            {isSignUp ? 'Already registered? Sign In' : "Don't have an account? Sign up"}
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

  // Modals decoupled
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);

  // Transaction form states
  const [actionType, setActionType] = useState('deposit'); // strictly deposit | withdraw
  const [walletType, setWalletType] = useState('online');
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');

  // Transfer form states
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
          date: t.date
        });
      });

      setTxStore(grouped);
    } catch (err) {
      console.error('Data sync error:', err.message);
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
        trajectoryLabel: `-${diffDays}d Behind (−₹${Math.abs(variance).toLocaleString()})`
      };
    } else {
      return {
        trajectoryStatus: 'on-track',
        daysDifference: 0,
        trajectoryLabel: 'On Track (0d gap)'
      };
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

  // Submit Standard Transaction (Deposit / Withdraw ONLY)
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
          note: transferNote.trim() ? `Bank Credit (${transferNote.trim()})` : 'Bank deposit from Cash Stash',
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
          note: transferNote.trim() ? `Bank ➔ Cash (${transferNote.trim()})` : 'Withdrew Bank balance to Cash',
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
    if (confirm('Delete this goal and its saved records?')) {
      await supabase.from('goals').delete().eq('id', goalId);
      fetchData();
    }
  };

  const handleFormatAllData = async () => {
    if (!user) return;
    const confirmPrompt = prompt('RESET DATA: This permanently deletes all goals and transaction records.\n\nType "FORMAT" to confirm:');
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
      alert('Data reset successfully completed.');
    } catch (err) {
      console.error('Format error:', err.message);
      alert('Reset failed: ' + err.message);
    } finally {
      setIsFormatting(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E07A5F] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  const ActiveIcon = activeGoal ? (ICON_MAP[activeGoal.category] || Target) : Target;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2A26] flex flex-col antialiased selection:bg-[#E07A5F]/20">
      
      {/* Top Navbar */}
      <nav className="bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#F1E8DF] sticky top-0 z-30 shadow-[0_2px_12px_rgba(224,122,95,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E07A5F] flex items-center justify-center text-white shadow-sm shadow-[#E07A5F]/20">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-[#2D2A26] block leading-tight">FinNest</span>
              <span className="text-[10px] font-semibold text-[#9C948B] tracking-wide uppercase">Sunset Sanctuary</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {goals.length > 0 && (
              <div className="hidden sm:flex items-center gap-2.5 bg-[#FAF7F2] border border-[#EADBCC] px-3.5 py-1.5 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-[#2A9D8F]" />
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-bold uppercase text-[#9C948B] tracking-wider">Total Vault</span>
                  <span className="text-xs font-black text-[#2D2A26]">₹{portfolioTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleFormatAllData}
              disabled={isFormatting}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl text-[#9C948B] hover:text-[#E76F51] hover:bg-rose-50 border border-transparent hover:border-rose-200 active:scale-95 transition flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
              title="Reset records"
            >
              {isFormatting ? <Loader2 className="w-4 h-4 animate-spin text-[#E76F51]" /> : <RotateCcw className="w-4 h-4" />}
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="bg-[#E07A5F] hover:bg-[#D46B50] text-white text-xs font-bold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-[#E07A5F]/20"
            >
              <Plus className="w-4 h-4" /> <span>Add Goal</span>
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 rounded-xl text-[#9C948B] hover:text-[#2D2A26] hover:bg-[#FAF7F2] transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Goal Switcher */}
      {goals.length > 0 && (
        <div className="lg:hidden border-b border-[#F1E8DF] bg-white px-4 py-2.5 overflow-x-auto flex gap-2 no-scrollbar z-10">
          {goals.map((g) => {
            const isSelected = g.id === selectedGoalId;
            const GoalIcon = ICON_MAP[g.category] || Target;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGoalId(g.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-[#2D2A26] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#7D756D] border border-[#EADBCC]'
                }`}
              >
                <GoalIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E07A5F]' : 'text-[#9C948B]'}`} />
                <span>{g.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 py-4 sm:py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        
        {/* Desktop Goals List */}
        <aside className="hidden lg:block lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#9C948B]">
              Active Goals ({goals.length})
            </h2>
            <button 
              onClick={() => setIsAddGoalOpen(true)}
              className="text-xs font-bold text-[#E07A5F] hover:text-[#D46B50] transition"
            >
              + Create
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="bg-white border border-[#F1E8DF] rounded-3xl p-8 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border border-[#EADBCC] text-[#E07A5F] flex items-center justify-center mx-auto">
                <FolderPlus className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#2D2A26]">No financial goals yet</h3>
              <p className="text-xs text-[#7D756D] leading-relaxed">Establish your first target to monitor timeline pace.</p>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="bg-[#2D2A26] text-white text-xs font-bold px-4 py-2.5 rounded-2xl active:scale-95 transition shadow-sm"
              >
                Launch First Target
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
                        ? 'bg-white border-[#E07A5F]/40 shadow-md shadow-[#E07A5F]/5 ring-1 ring-[#E07A5F]/30' 
                        : 'bg-white/70 hover:bg-white border-[#F1E8DF] shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <GoalIcon className="w-3.5 h-3.5 text-[#9C948B]" />
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-[#2D2A26] text-white' : 'bg-[#FAF7F2] text-[#7D756D]'
                          }`}>
                            {g.badge || 'Goal'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#2D2A26] mt-1">{g.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-[#7D756D] font-medium">₹{gSaved.toLocaleString()} / ₹{g.targetAmount.toLocaleString()}</p>
                          {isDelayed && (
                            <span className="text-[10px] font-extrabold text-[#E76F51] bg-[#E76F51]/10 px-1.5 py-0.2 rounded-md">
                              {sidebarDaysGap}d delay
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-base font-black ${isSelected ? 'text-[#E07A5F]' : 'text-[#9C948B]'}`}>
                        {gPct}%
                      </span>
                    </div>

                    <div className="w-full bg-[#F1E8DF] h-2 rounded-full overflow-hidden mt-3">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-[#E07A5F]' : 'bg-[#D1C7BD]'}`}
                        style={{ width: `${gPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* Selected Target View */}
        <main className="lg:col-span-8 space-y-4 sm:space-y-6">
          {activeGoal ? (
            <>
              {/* Sunset Vault Primary Card */}
              <div className="bg-white border border-[#F1E8DF] rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 relative overflow-hidden animate-warm-up">
                
                {/* Header Section */}
                <div className="space-y-4 pb-4 border-b border-[#F1E8DF]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#FAF7F2] border border-[#EADBCC] text-[#E07A5F] rounded-2xl shadow-xs shrink-0">
                        <ActiveIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-xl sm:text-2xl font-black text-[#2D2A26] leading-tight">{activeGoal.name}</h1>
                          <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 bg-[#FAF7F2] text-[#7D756D] rounded-lg border border-[#EADBCC]">
                            {activeGoal.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#7D756D] mt-0.5 font-medium">Target Ceiling: ₹{activeGoal.targetAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteGoal(activeGoal.id)}
                      className="p-2 text-[#9C948B] hover:text-[#E76F51] hover:bg-rose-50 active:scale-95 rounded-xl transition"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dates Banner */}
                  <div className="flex items-center justify-between text-xs bg-[#FAF7F2] border border-[#EADBCC] p-3 rounded-2xl font-semibold text-[#7D756D]">
                    <div className="flex items-center gap-2 truncate">
                      <Calendar className="w-3.5 h-3.5 text-[#9C948B] shrink-0" />
                      <span>{activeGoal.startDate || 'Start'}</span>
                      <ArrowRight className="w-3 h-3 text-[#9C948B] shrink-0" />
                      <span>{activeGoal.targetDate}</span>
                    </div>
                    <span className="text-[11px] font-black text-[#E07A5F] bg-[#E07A5F]/10 border border-[#E07A5F]/20 px-2.5 py-0.5 rounded-xl shrink-0">
                      {daysLeft}d left
                    </span>
                  </div>

                  {/* Clean 2-Action Split: Transaction vs Transfer */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => {
                        setTransferAmountStr('');
                        setTransferNote('');
                        setIsTransferModalOpen(true);
                      }}
                      className="bg-[#FAF7F2] hover:bg-[#F4ECE2] active:scale-[0.98] text-[#2A9D8F] border border-[#EADBCC] font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-[#2A9D8F]" /> 
                      <span>Shift Funds</span>
                    </button>
                    <button
                      onClick={() => {
                        setActionType('deposit');
                        setAmountStr('');
                        setNote('');
                        setIsTxModalOpen(true);
                      }}
                      className="bg-[#E07A5F] hover:bg-[#D46B50] active:scale-[0.98] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition shadow-md shadow-[#E07A5F]/20"
                    >
                      <Plus className="w-4 h-4" /> 
                      <span>Add / Withdraw</span>
                    </button>
                  </div>
                </div>

                {/* Horizon Status Indicator */}
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  trajectoryStatus === 'advance' 
                    ? 'bg-[#2A9D8F]/10 border-[#2A9D8F]/25 text-[#1D6C63]' 
                    : trajectoryStatus === 'delay' 
                    ? 'bg-[#E76F51]/10 border-[#E76F51]/25 text-[#A83D24]' 
                    : 'bg-[#FAF7F2] border-[#EADBCC] text-[#2D2A26]'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 text-white shadow-xs ${
                      trajectoryStatus === 'advance' 
                        ? 'bg-[#2A9D8F]' 
                        : trajectoryStatus === 'delay' 
                        ? 'bg-[#E76F51]' 
                        : 'bg-[#E07A5F]'
                    }`}>
                      {trajectoryStatus === 'advance' ? <Zap className="w-4 h-4" /> : trajectoryStatus === 'delay' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-wider">Schedule Status:</span>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-white border border-[#EADBCC] shadow-xs">
                          {trajectoryLabel}
                        </span>
                      </div>
                      <p className="text-xs font-medium opacity-85 mt-1 leading-snug">
                        {trajectoryStatus === 'advance' 
                          ? `Advancing nicely: ${daysDifference} days ahead of target schedule.` 
                          : trajectoryStatus === 'delay' 
                          ? `Schedule gap: ${daysDifference} days. Suggested rate: ₹${requiredPace}/day.` 
                          : 'You are directly matching the timeline trajectory.'}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs opacity-80 font-bold pl-11 sm:pl-0">
                    Expected: ₹{Math.round(activeGoal.targetAmount * Math.min(1, daysElapsed / totalDurationDays)).toLocaleString()}
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#9C948B] tracking-wider">Timeline Window</span>
                    <span className="font-bold text-[#7D756D]">{daysElapsed} of {totalDurationDays} days ({timeProgressPct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-[#EADBCC] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#2D2A26] rounded-full transition-all duration-500" 
                      style={{ width: `${timeProgressPct}%` }}
                    />
                  </div>
                </div>

                {/* Savings Balance Display */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#9C948B] tracking-wider block">Total Vault Saved</span>
                      <span className="text-3xl sm:text-4xl font-black text-[#2D2A26] tracking-tight">₹{totalSaved.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-[#E07A5F]">{percentage}%</span>
                      <span className="text-xs text-[#9C948B] block font-semibold">₹{remainingNeeded.toLocaleString()} remaining</span>
                    </div>
                  </div>

                  {/* Dual Allocation Bar */}
                  <div className="h-3.5 bg-[#F1E8DF] rounded-full overflow-hidden p-0.5 flex border border-[#EADBCC] shadow-inner">
                    <div 
                      className="h-full bg-[#2A9D8F] rounded-l-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalCash / activeGoal.targetAmount) * 100)}%` }}
                    />
                    <div 
                      className="h-full bg-[#E07A5F] rounded-r-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalOnline / activeGoal.targetAmount) * 100)}%` }}
                    />
                  </div>

                  {/* Sub-account Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold pt-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-[#1D6C63] bg-[#2A9D8F]/10 border border-[#2A9D8F]/25 px-2.5 py-1 rounded-xl">
                        <Banknote className="w-3.5 h-3.5 text-[#2A9D8F]" /> Cash: ₹{totalCash.toLocaleString()}
                      </span>
                      {totalCash > 0 && (
                        <button
                          onClick={() => {
                            setTransferDirection('cash_to_bank');
                            setTransferAmountStr('');
                            setTransferNote('');
                            setIsTransferModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-[#1D6C63] bg-white border border-[#2A9D8F]/30 px-2.5 py-1 rounded-xl active:bg-[#2A9D8F]/5 transition shadow-2xs"
                        >
                          Deposit to Bank ➔
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {totalOnline > 0 && (
                        <button
                          onClick={() => {
                            setTransferDirection('bank_to_cash');
                            setTransferAmountStr('');
                            setTransferNote('');
                            setIsTransferModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-[#A83D24] bg-white border border-[#E07A5F]/30 px-2.5 py-1 rounded-xl active:bg-[#E07A5F]/5 transition shadow-2xs"
                        >
                          Withdraw to Cash ➔
                        </button>
                      )}
                      <span className="flex items-center gap-1.5 text-[#A83D24] bg-[#E07A5F]/10 border border-[#E07A5F]/25 px-2.5 py-1 rounded-xl">
                        <Smartphone className="w-3.5 h-3.5 text-[#E07A5F]" /> Online / Bank: ₹{totalOnline.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Breakdown Tiles */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-[#F1E8DF] p-3.5 sm:p-4 rounded-3xl shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[#9C948B] mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#E76F51]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Required Pace</span>
                  </div>
                  <p className="text-base sm:text-xl font-black text-[#2D2A26]">
                    ₹{requiredPace}<span className="text-xs font-normal text-[#9C948B]">/d</span>
                  </p>
                </div>

                <div className="bg-white border border-[#F1E8DF] p-3.5 sm:p-4 rounded-3xl shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[#9C948B] mb-1">
                    <Zap className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Offset</span>
                  </div>
                  <p className={`text-base sm:text-xl font-black ${
                    trajectoryStatus === 'advance' ? 'text-[#2A9D8F]' : trajectoryStatus === 'delay' ? 'text-[#E76F51]' : 'text-[#2D2A26]'
                  }`}>
                    {trajectoryStatus === 'advance' ? `+${daysDifference}d` : trajectoryStatus === 'delay' ? `-${daysDifference}d` : '0d'}
                  </p>
                </div>

                <div className="bg-white border border-[#F1E8DF] p-3.5 sm:p-4 rounded-3xl shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[#9C948B] mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#9C948B]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Horizon</span>
                  </div>
                  <p className="text-base sm:text-xl font-black text-[#2D2A26]">{daysLeft} days</p>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="bg-white border border-[#F1E8DF] rounded-3xl p-4 sm:p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#7D756D]" />
                    <h2 className="text-sm sm:text-base font-black text-[#2D2A26]">Transaction Stream</h2>
                  </div>
                  <span className="text-[10px] font-bold text-[#7D756D] bg-[#FAF7F2] border border-[#EADBCC] px-2 py-0.5 rounded-lg">
                    {currentTxs.length} records
                  </span>
                </div>

                <div className="divide-y divide-[#F1E8DF] max-h-72 overflow-y-auto pr-1">
                  {currentTxs.length === 0 ? (
                    <div className="py-8 text-center space-y-1">
                      <p className="text-xs font-semibold text-[#9C948B]">No records saved yet</p>
                      <p className="text-[11px] text-[#9C948B]">Use "Add / Withdraw" to log your first transaction.</p>
                    </div>
                  ) : (
                    currentTxs.map((tx) => (
                      <div key={tx.id} className="py-3 flex items-center justify-between hover:bg-[#FAF7F2]/60 px-1 rounded-xl transition">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-2xl border shadow-2xs ${
                            tx.type === 'online' 
                              ? 'bg-[#E07A5F]/10 border-[#E07A5F]/20 text-[#E07A5F]' 
                              : 'bg-[#2A9D8F]/10 border-[#2A9D8F]/20 text-[#2A9D8F]'
                          }`}>
                            {tx.type === 'online' ? <Smartphone className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#2D2A26] leading-snug">{tx.note}</p>
                            <p className="text-[10px] text-[#9C948B] font-medium capitalize">{tx.type} • {tx.date}</p>
                          </div>
                        </div>
                        <span className={`text-xs sm:text-sm font-black tracking-tight ${
                          tx.action === 'withdraw' ? 'text-[#E76F51]' : 'text-[#2A9D8F]'
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
            <div className="bg-white border border-[#F1E8DF] rounded-3xl p-12 text-center space-y-4 shadow-sm animate-warm-up">
              <div className="w-16 h-16 rounded-3xl bg-[#FAF7F2] border border-[#EADBCC] text-[#9C948B] flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-[#9C948B]" />
              </div>
              <h2 className="text-lg font-black text-[#2D2A26]">No Target Active</h2>
              <p className="text-xs text-[#7D756D] max-w-sm mx-auto leading-relaxed">
                Choose a goal from the list or create a new one to track your savings.
              </p>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="bg-[#E07A5F] hover:bg-[#D46B50] text-white font-bold text-xs px-5 py-3 rounded-2xl active:scale-95 shadow-md shadow-[#E07A5F]/20 transition"
              >
                + Create Financial Target
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 1. TRANSACTION MODAL (Add / Withdraw ONLY) */}
      {isTxModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-[#2D2A26]/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center overflow-y-auto">
          <div className="relative w-full max-w-md my-auto sm:my-0 bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-[#F1E8DF] flex flex-col shrink-0 max-h-[90vh] overflow-y-auto animate-warm-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E8DF]">
              {/* Deposit / Withdraw Toggle ONLY */}
              <div className="flex bg-[#FAF7F2] p-1 rounded-2xl border border-[#EADBCC]">
                <button
                  type="button"
                  onClick={() => setActionType('deposit')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                    actionType === 'deposit' ? 'bg-[#2A9D8F] text-white shadow-xs' : 'text-[#7D756D]'
                  }`}
                >
                  Deposit (+)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('withdraw')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                    actionType === 'withdraw' ? 'bg-[#E76F51] text-white shadow-xs' : 'text-[#7D756D]'
                  }`}
                >
                  Withdraw (−)
                </button>
              </div>
              <button 
                onClick={() => setIsTxModalOpen(false)} 
                className="p-2 rounded-full bg-[#FAF7F2] active:bg-[#F1E8DF] text-[#7D756D] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Display Amount */}
            <div className="bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl p-3 text-center mt-3 shadow-inner">
              <span className="text-[10px] font-bold text-[#9C948B] uppercase tracking-wider block">
                {actionType === 'deposit' ? 'Add to Goal' : 'Withdraw from Goal'} ({activeGoal.name})
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#2D2A26] mt-0.5">
                <span className="text-[#E07A5F] mr-1 text-xl">₹</span>
                {amountStr ? Number(amountStr).toLocaleString() : '0'}
              </div>
            </div>

            {/* Account Selector */}
            <div className="grid grid-cols-2 gap-2 mt-2.5">
              <button
                type="button"
                onClick={() => setWalletType('online')}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  walletType === 'online' 
                    ? 'bg-[#E07A5F]/10 border-[#E07A5F] text-[#A83D24] font-black ring-1 ring-[#E07A5F]/30' 
                    : 'bg-white border-[#EADBCC] text-[#7D756D]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Online (₹{totalOnline.toLocaleString()})
              </button>
              <button
                type="button"
                onClick={() => setWalletType('cash')}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  walletType === 'cash' 
                    ? 'bg-[#2A9D8F]/10 border-[#2A9D8F] text-[#1D6C63] font-black ring-1 ring-[#2A9D8F]/30' 
                    : 'bg-white border-[#EADBCC] text-[#7D756D]'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" /> Cash (₹{totalCash.toLocaleString()})
              </button>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleTxKeypad(digit)}
                  className="h-11 bg-[#FAF7F2] hover:bg-[#F4ECE2] active:bg-[#EADBCC] text-[#2D2A26] font-bold text-lg rounded-2xl border border-[#EADBCC] shadow-2xs flex items-center justify-center transition active:scale-[0.96]"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmountStr('')}
                className="h-11 bg-amber-50 active:bg-amber-100 text-amber-800 font-bold text-xs rounded-2xl border border-amber-200 flex items-center justify-center transition active:scale-[0.96]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleTxKeypad('0')}
                className="h-11 bg-[#FAF7F2] hover:bg-[#F4ECE2] active:bg-[#EADBCC] text-[#2D2A26] font-bold text-lg rounded-2xl border border-[#EADBCC] shadow-2xs flex items-center justify-center transition active:scale-[0.96]"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setAmountStr((prev) => prev.slice(0, -1))}
                className="h-11 bg-rose-50 active:bg-rose-100 text-[#E76F51] font-bold text-xs rounded-2xl border border-rose-200 flex items-center justify-center transition active:scale-[0.96]"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Memo / Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs text-[#2D2A26] mt-3 font-semibold focus:outline-none focus:bg-white focus:border-[#E07A5F] transition"
            />

            <button
              type="button"
              onClick={handleTransactionSubmit}
              disabled={!amountStr || Number(amountStr) <= 0}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs text-white transition active:scale-[0.98] disabled:opacity-40 mt-3 shadow-md ${
                actionType === 'deposit'
                  ? 'bg-[#2A9D8F] active:bg-[#238276] shadow-[#2A9D8F]/25'
                  : 'bg-[#E76F51] active:bg-[#D55F42] shadow-[#E76F51]/25'
              }`}
            >
              Confirm {actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </button>
          </div>
        </div>
      )}

      {/* 2. DEDICATED TRANSFER MODAL (Shift Funds) */}
      {isTransferModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-[#2D2A26]/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center overflow-y-auto">
          <div className="relative w-full max-w-md my-auto sm:my-0 bg-white rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-[#F1E8DF] flex flex-col shrink-0 max-h-[90vh] overflow-y-auto animate-warm-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E8DF]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-xl">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#2D2A26]">Shift Vault Funds</h3>
                  <p className="text-[10px] text-[#9C948B]">Move balance between Cash and Bank</p>
                </div>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(false)} 
                className="p-2 rounded-full bg-[#FAF7F2] active:bg-[#F1E8DF] text-[#7D756D] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direction Selection with Live Available Balance */}
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EADBCC]">
                <button
                  type="button"
                  onClick={() => {
                    setTransferDirection('cash_to_bank');
                    setTransferAmountStr('');
                  }}
                  className={`py-2 px-3 rounded-xl text-left transition flex flex-col justify-between ${
                    transferDirection === 'cash_to_bank' 
                      ? 'bg-white text-[#2D2A26] shadow-sm border border-[#EADBCC] ring-1 ring-[#2A9D8F]/30' 
                      : 'text-[#7D756D] hover:text-[#2D2A26]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black flex items-center gap-1.5">
                      <Banknote className="w-3.5 h-3.5 text-[#2A9D8F]" /> Cash ➔ Bank
                    </span>
                    {transferDirection === 'cash_to_bank' && (
                      <span className="w-2 h-2 rounded-full bg-[#2A9D8F]" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#9C948B]">Available:</span>
                    <span className="text-xs font-black text-[#1D6C63]">₹{totalCash.toLocaleString()}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTransferDirection('bank_to_cash');
                    setTransferAmountStr('');
                  }}
                  className={`py-2 px-3 rounded-xl text-left transition flex flex-col justify-between ${
                    transferDirection === 'bank_to_cash' 
                      ? 'bg-white text-[#2D2A26] shadow-sm border border-[#EADBCC] ring-1 ring-[#E07A5F]/30' 
                      : 'text-[#7D756D] hover:text-[#2D2A26]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#E07A5F]" /> Bank ➔ Cash
                    </span>
                    {transferDirection === 'bank_to_cash' && (
                      <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#9C948B]">Available:</span>
                    <span className="text-xs font-black text-[#A83D24]">₹{totalOnline.toLocaleString()}</span>
                  </div>
                </button>
              </div>

              {/* Quick Fill Max Button */}
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="text-[#7D756D] font-medium">
                  Source: {transferDirection === 'cash_to_bank' ? 'Cash Stash' : 'Bank Balance'}
                </span>
                <button
                  type="button"
                  onClick={() => setTransferAmountStr(String(transferDirection === 'cash_to_bank' ? totalCash : totalOnline))}
                  className="font-bold text-[#E07A5F] hover:text-[#D46B50] active:scale-95 bg-[#E07A5F]/10 px-2.5 py-1 rounded-lg border border-[#E07A5F]/30"
                >
                  Shift Max (₹{(transferDirection === 'cash_to_bank' ? totalCash : totalOnline).toLocaleString()})
                </button>
              </div>
            </div>

            {/* Transfer Amount Display */}
            <div className="bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl p-3 text-center mt-3 shadow-inner">
              <span className="text-[10px] font-bold text-[#9C948B] uppercase tracking-wider block">
                Transfer Sum
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#2D2A26] mt-0.5">
                <span className="text-[#E07A5F] mr-1 text-xl">₹</span>
                {transferAmountStr ? Number(transferAmountStr).toLocaleString() : '0'}
              </div>
            </div>

            {/* Transfer Number Pad */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleTransferKeypad(digit)}
                  className="h-11 bg-[#FAF7F2] hover:bg-[#F4ECE2] active:bg-[#EADBCC] text-[#2D2A26] font-bold text-lg rounded-2xl border border-[#EADBCC] shadow-2xs flex items-center justify-center transition active:scale-[0.96]"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTransferAmountStr('')}
                className="h-11 bg-amber-50 active:bg-amber-100 text-amber-800 font-bold text-xs rounded-2xl border border-amber-200 flex items-center justify-center transition active:scale-[0.96]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleTransferKeypad('0')}
                className="h-11 bg-[#FAF7F2] hover:bg-[#F4ECE2] active:bg-[#EADBCC] text-[#2D2A26] font-bold text-lg rounded-2xl border border-[#EADBCC] shadow-2xs flex items-center justify-center transition active:scale-[0.96]"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setTransferAmountStr((prev) => prev.slice(0, -1))}
                className="h-11 bg-rose-50 active:bg-rose-100 text-[#E76F51] font-bold text-xs rounded-2xl border border-rose-200 flex items-center justify-center transition active:scale-[0.96]"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Transfer note (e.g. ATM withdrawal, bank deposit)"
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs text-[#2D2A26] mt-3 font-semibold focus:outline-none focus:bg-white focus:border-[#E07A5F] transition"
            />

            <button
              type="button"
              onClick={handleTransferSubmit}
              disabled={!transferAmountStr || Number(transferAmountStr) <= 0}
              className="w-full py-3.5 rounded-2xl font-bold text-xs text-white transition active:scale-[0.98] disabled:opacity-40 mt-3 shadow-md bg-[#2A9D8F] active:bg-[#238276] shadow-[#2A9D8F]/25"
            >
              Confirm Transfer (₹{transferAmountStr ? Number(transferAmountStr).toLocaleString() : '0'})
            </button>
          </div>
        </div>
      )}

      {/* 3. NEW GOAL MODAL */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 bg-[#2D2A26]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-[#F1E8DF] animate-warm-up">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F1E8DF]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#E07A5F]/10 text-[#E07A5F] rounded-2xl border border-[#E07A5F]/20">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#2D2A26] text-base">New Financial Goal</h3>
              </div>
              <button onClick={() => setIsAddGoalOpen(false)} className="p-2 rounded-full bg-[#FAF7F2] active:bg-[#F1E8DF] text-[#7D756D] transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C948B] block mb-2">Category</label>
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
                            ? 'bg-[#2D2A26] text-white border-[#2D2A26] shadow-sm' 
                            : 'bg-[#FAF7F2] text-[#7D756D] border-[#EADBCC] hover:bg-[#F4ECE2]'
                        }`}
                      >
                        <CatIcon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-[#E07A5F]' : 'text-[#9C948B]'}`} />
                        <span className="text-[10px] font-bold line-clamp-1">{cat.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C948B]">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. MacBook Pro, Bali Trip, Emergency Stash"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#E07A5F] transition"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C948B]">Target Capital (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#E07A5F] transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C948B]">Start Date</label>
                  <input
                    type="date"
                    value={newGoalStartDate}
                    onChange={(e) => setNewGoalStartDate(e.target.value)}
                    className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#E07A5F] transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C948B]">Target Completion Date</label>
                  <input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#E07A5F] transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E07A5F] hover:bg-[#D46B50] text-white font-bold text-xs py-3.5 rounded-2xl active:scale-[0.98] shadow-md shadow-[#E07A5F]/20 mt-2 transition"
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