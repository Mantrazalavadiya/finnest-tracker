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
  Globe,
  Clock,
  Compass,
  Radio,
  Search
} from 'lucide-react';

/* Cyber Global Grid Map Canvas */
function GlobalOperationsGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Flight corridor points
    const nodes = [
      { x: 0.22, y: 0.35, label: 'KSFO' },
      { x: 0.26, y: 0.42, label: 'KLAX' },
      { x: 0.48, y: 0.32, label: 'LEBL' },
      { x: 0.76, y: 0.38, label: 'HND' },
      { x: 0.85, y: 0.72, label: 'SYD' }
    ];

    let pulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulse += 0.03;

      // Draw faint terminal grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
      ctx.lineWidth = 1;
      const gridSize = 45;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw flight paths between nodes
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let i = 0; i < nodes.length - 1; i++) {
        const startX = nodes[i].x * width;
        const startY = nodes[i].y * height;
        const endX = nodes[i + 1].x * width;
        const endY = nodes[i + 1].y * height;

        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(
          (startX + endX) / 2, 
          startY - 40, 
          (startX + endX) / 2, 
          endY - 40, 
          endX, 
          endY
        );
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw node beacons
      nodes.forEach((node) => {
        const nx = node.x * width;
        const ny = node.y * height;
        const beaconRadius = Math.sin(pulse) * 3 + 5;

        ctx.beginPath();
        ctx.arc(nx, ny, beaconRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38BDF8';
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-45" />;
}

const CATEGORY_PRESETS = [
  { id: 'tech', label: 'Tech & Fleet', icon: Laptop },
  { id: 'savings', label: 'Vault Stash', icon: PiggyBank },
  { id: 'travel', label: 'Air Routes', icon: Plane },
  { id: 'vehicle', label: 'Transports', icon: Car },
  { id: 'education', label: 'Academy', icon: GraduationCap },
  { id: 'emergency', label: 'Contingency', icon: ShieldAlert },
  { id: 'home', label: 'Hangar', icon: HomeIcon },
  { id: 'health', label: 'Crew Vital', icon: HeartPulse },
  { id: 'custom', label: 'Special Ops', icon: Sparkles },
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
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
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
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-200 flex flex-col items-center justify-center p-4 relative font-mono">
      <GlobalOperationsGrid />
      <div className="w-full max-w-sm terminal-panel terminal-panel-glow rounded-2xl p-7 relative z-10">
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-1">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-black text-white tracking-widest uppercase">AIRLINESIM // FINTRACK</h1>
          <p className="text-[11px] text-slate-400">Terminal Access & Capital Simulation</p>
        </div>

        {errorMsg && (
          <div className="p-2.5 mb-4 text-xs bg-rose-950/60 border border-rose-500/50 text-rose-300 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CALLSIGN / EMAIL</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="pilot@airlinesim.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-sky-300 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ENCRYPTED KEY</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-sky-300 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <span>{loading ? 'AUTHENTICATING...' : isSignUp ? 'ENROLL PILOT' : 'AUTHORIZE ACCESS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-xs font-bold text-slate-400 hover:text-sky-400 transition"
          >
            {isSignUp ? 'Existing Operator? Sign In' : 'New Callsign? Register Protocol'}
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

  // Standard Keypad Transaction states
  const [actionType, setActionType] = useState('deposit');
  const [walletType, setWalletType] = useState('online');
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');

  // Cash <-> Bank Transfer states
  const [transferDirection, setTransferDirection] = useState('cash_to_bank');
  const [transferAmountStr, setTransferAmountStr] = useState('');
  const [transferNote, setTransferNote] = useState('');

  // Cross-Goal Transfer states
  const [targetGoalId, setTargetGoalId] = useState('');
  const [goalTransferWallet, setGoalTransferWallet] = useState('online');
  const [goalTransferAmountStr, setGoalTransferAmountStr] = useState('');
  const [goalTransferNote, setGoalTransferNote] = useState('');

  // New Goal Creation
  const todayStr = new Date().toISOString().split('T')[0];
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('tech');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalStartDate, setNewGoalStartDate] = useState(todayStr);
  const [newGoalDate, setNewGoalDate] = useState('');

  // Edit Goal states
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
        alert(`Insufficient funds in ${walletType === 'cash' ? 'Cash Reserve' : 'Online Balance'}! Available: ₹${available.toLocaleString()}`);
        return;
      }

      await supabase.from('transactions').insert([{
        user_id: user.id,
        goal_id: activeGoal.id,
        amount: val,
        action: 'withdraw',
        type: walletType,
        note: note.trim() || 'Flight Fuel / Debit',
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
        note: note.trim() || 'Fleet Inflow / Deposit',
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
        alert(`Cannot transfer ₹${val.toLocaleString()}. Available Physical Stash: ₹${totalCash.toLocaleString()}`);
        return;
      }

      await supabase.from('transactions').insert([
        {
          user_id: user.id,
          goal_id: activeGoal.id,
          amount: val,
          action: 'withdraw',
          type: 'cash',
          note: transferNote.trim() ? `Cash ➔ Bank (${transferNote.trim()})` : 'Transferred Cash to Bank UPI',
          date: todayStr
        },
        {
          user_id: user.id,
          goal_id: activeGoal.id,
          amount: val,
          action: 'deposit',
          type: 'online',
          note: transferNote.trim() ? `Bank Deposit (${transferNote.trim()})` : 'Bank deposit from Cash Reserve',
          date: todayStr
        }
      ]);
    } else {
      if (val > totalOnline) {
        alert(`Cannot transfer ₹${val.toLocaleString()}. Available Bank Balance: ₹${totalOnline.toLocaleString()}`);
        return;
      }

      await supabase.from('transactions').insert([
        {
          user_id: user.id,
          goal_id: activeGoal.id,
          amount: val,
          action: 'withdraw',
          type: 'online',
          note: transferNote.trim() ? `Bank ➔ Cash (${transferNote.trim()})` : 'Withdrew from Bank to Physical Cash',
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

  const handleCrossGoalTransferSubmit = async (e) => {
    e.preventDefault();
    const val = Number(goalTransferAmountStr);
    if (!val || val <= 0 || !activeGoal || !targetGoalId || !user) return;

    const available = goalTransferWallet === 'cash' ? totalCash : totalOnline;
    if (val > available) {
      alert(`Cannot transfer ₹${val.toLocaleString()}. Available is ₹${available.toLocaleString()}`);
      return;
    }

    const destinationGoal = goals.find((g) => g.id === targetGoalId);
    const destName = destinationGoal ? destinationGoal.name : 'Target Route';

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
      alert(`Capital Reallocated: ₹${val.toLocaleString()} moved to ${destName}!`);
    } catch (err) {
      alert('Reallocation failed: ' + err.message);
    }
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

  const handleOpenEditGoal = () => {
    if (!activeGoal) return;
    setEditGoalName(activeGoal.name);
    setEditGoalAmount(String(activeGoal.targetAmount));
    setEditGoalDate(activeGoal.targetDate);
    setIsEditGoalOpen(true);
  };

  const handleSaveGoalChanges = async (e) => {
    e.preventDefault();
    if (!activeGoal || !editGoalName.trim() || !editGoalAmount || !editGoalDate) return;

    if (new Date(editGoalDate) <= new Date(activeGoal.startDate)) {
      alert("Extended End Date must be after the starting date.");
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
      alert('Flight schedule and target capital successfully modified!');
    } catch (err) {
      alert('Modification failed: ' + err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (confirm('Decommission this fleet goal and purge its flight logs?')) {
      await supabase.from('goals').delete().eq('id', goalId);
      fetchData();
    }
  };

  const handleResetAllData = async (e) => {
    e.preventDefault();
    if (resetInput.trim().toUpperCase() !== 'RESET') {
      alert('Please type "RESET" exactly to execute master purge.');
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
      alert('Master Wipe Executed. All terminal records have been reset.');
    } catch (err) {
      alert('Reset failed: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center font-mono text-sky-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  const ActiveIcon = activeGoal ? (ICON_MAP[activeGoal.category] || Target) : Target;
  const eligibleTargetGoals = goals.filter((g) => g.id !== selectedGoalId);

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-200 flex flex-col md:flex-row pb-24 md:pb-0 font-sans relative overflow-x-hidden">
      
      {/* 3D Global Grid Animation Canvas */}
      <GlobalOperationsGrid />

      {/* SCI-FI TERMINAL SIDEBAR (LAPTOP / DESKTOP) */}
      <aside className="hidden md:flex flex-col w-64 terminal-panel border-r border-slate-800 p-5 shrink-0 justify-between sticky top-0 h-screen z-20 font-mono">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-wider block">AIRLINESIM</span>
              <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE OPS
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition ${
                activeTab === 'home' ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <HomeIcon className="w-4 h-4" /> Overview
            </button>

            <button
              onClick={() => setActiveTab('goals')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition ${
                activeTab === 'goals' ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" /> Fleet & Goals
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition ${
                activeTab === 'history' ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" /> Flight Ledger
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition ${
                activeTab === 'settings' ? 'bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" /> System Config
            </button>
          </nav>

          {/* Quick World Clocks (As in image) */}
          <div className="space-y-2 pt-3 border-t border-slate-800 text-[10px]">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">World Operations Clock</span>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block">Cupertino</span>
                <span className="font-black text-sky-400">05:25 AM</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block">Tokyo</span>
                <span className="font-black text-emerald-400">21:25 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="bg-[#070A12] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">NET CAPITAL VAULT</span>
            <p className="text-base font-black text-emerald-400 mt-0.5 tracking-wide">₹{portfolioTotal.toLocaleString()}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-400 transition"
          >
            <LogOut className="w-4 h-4" /> Abort Session
          </button>
        </div>
      </aside>

      {/* MAIN OPERATIONS WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 font-mono">
        
        {/* Top Navbar */}
        <header className="terminal-panel px-5 md:px-8 py-3.5 border-b border-slate-800 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 md:hidden">
              <Compass className="w-5 h-5 text-sky-400" />
              <span className="text-base font-black text-white tracking-widest">AIRLINESIM</span>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-[#070A12] border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-400">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Quick command or route lookup...</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full">
              <Radio className="w-3 h-3 animate-pulse" /> 510 min AS
            </span>

            {goals.length > 1 && (
              <button
                onClick={() => {
                  setTargetGoalId(eligibleTargetGoals[0]?.id || '');
                  setGoalTransferAmountStr('');
                  setGoalTransferNote('');
                  setIsGoalTransferModalOpen(true);
                }}
                className="hidden md:flex bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-400/30 text-xs font-bold px-3 py-1.5 rounded-lg items-center gap-1.5 transition active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" /> Reallocate
              </button>
            )}

            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-sky-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> New Fleet Goal
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <div className="p-4 sm:p-6 lg:p-7 max-w-6xl mx-auto w-full flex-1">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'home' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
                    Flight Operations & Capital Overview
                  </h1>
                  <p className="text-xs text-slate-400">Callsign: {user.email}</p>
                </div>
                <div className="text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
                  System Date: <span className="text-sky-400 font-bold">13 Oct 2034 // 05:25 AM</span>
                </div>
              </div>

              {/* Top Stat Ribbon (As in Image) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="terminal-panel p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">RESERVE CAPITAL</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">₹{portfolioTotal.toLocaleString()}</p>
                  <span className="text-[10px] text-emerald-500 block mt-0.5">● Fully Protected</span>
                </div>

                <div className="terminal-panel p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">ACTIVE CORRIDORS</span>
                  <p className="text-2xl font-black text-sky-400 mt-1">{goals.length} Routes</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Monitoring timeline horizon</span>
                </div>

                <div className="terminal-panel p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">JET FUEL / PACE COMMITTED</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">₹{requiredPace}<span className="text-xs text-slate-400 font-normal">/day</span></p>
                  <span className="text-[10px] text-amber-500 block mt-0.5">Required pace velocity</span>
                </div>
              </div>

              {/* Recent Flights Table (LEBL -> KLAX style) */}
              <div className="terminal-panel rounded-xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-2">
                    <Plane className="w-4 h-4 text-sky-400" /> Recent Flight Corridors & Ledger
                  </h3>
                  <span className="text-[10px] text-sky-400 font-bold">{allTransactions.length} Logged Entries</span>
                </div>

                <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
                  {allTransactions.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No flights or transactions logged in ledger.</p>
                  ) : (
                    allTransactions.map((tx) => {
                      const isWithdraw = tx.action === 'withdraw';
                      return (
                        <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isWithdraw ? 'bg-rose-950/70 text-rose-400 border border-rose-800/50' : 'bg-sky-950/70 text-sky-400 border border-sky-800/50'
                            }`}>
                              {tx.type === 'online' ? <Smartphone className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-bold text-white">{tx.note || 'Flight Inflow'}</p>
                              <p className="text-[10px] text-slate-500 font-mono">
                                Corridor: {tx.goalName} • {tx.type.toUpperCase()} • {tx.date}
                              </p>
                            </div>
                          </div>
                          <span className={`font-mono font-black text-sm ${
                            isWithdraw ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {isWithdraw ? '-' : '+'}₹{tx.amount.toLocaleString()}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FLIGHT LEDGER */}
          {activeTab === 'history' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="border-b border-slate-800 pb-3">
                <h1 className="text-xl font-black text-white tracking-widest uppercase">Flight Operations Ledger</h1>
                <p className="text-xs text-slate-400">Complete audit trail of all capital transactions.</p>
              </div>

              <div className="terminal-panel rounded-xl p-5 border border-slate-800 space-y-3">
                <div className="divide-y divide-slate-800">
                  {allTransactions.map((tx) => {
                    const isWithdraw = tx.action === 'withdraw';
                    return (
                      <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isWithdraw ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40' : 'bg-sky-950/60 text-sky-400 border border-sky-800/40'
                          }`}>
                            <Plane className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{tx.note || 'Capital Transaction'}</span>
                            <span className="text-[10px] text-slate-500 font-mono">Route: {tx.goalName} • {tx.date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono font-black text-sm ${
                            isWithdraw ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {isWithdraw ? '-' : '+'}₹{tx.amount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 block uppercase">
                            {isWithdraw ? 'Debited' : 'Verified'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FLEET & GOALS */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              
              {/* Top Goal Selectors (Terminal Style) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-widest text-slate-400">Active Aircraft & Fleet Goals ({goals.length})</span>
                  <button onClick={() => setIsAddGoalOpen(true)} className="text-sky-400 font-bold hover:underline">
                    + Deploy Fleet Target
                  </button>
                </div>

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
                    const GoalIcon = ICON_MAP[g.category] || Plane;

                    return (
                      <div
                        key={g.id}
                        onClick={() => setSelectedGoalId(g.id)}
                        className={`terminal-panel p-4 rounded-xl border cursor-pointer transition ${
                          isSelected 
                            ? 'border-sky-400 bg-sky-950/20 shadow-lg shadow-sky-500/10' 
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <GoalIcon className="w-4 h-4 text-sky-400" />
                            <span className="text-[10px] uppercase font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/60">
                              {g.badge || 'Fleet'}
                            </span>
                          </div>
                          <span className="font-mono font-black text-emerald-400">{gPct}%</span>
                        </div>

                        <h3 className="text-sm font-black text-white mt-2 tracking-wide">{g.name}</h3>

                        <div className="flex items-center justify-between text-xs mt-1 font-mono">
                          <span className="text-slate-300">₹{gSaved.toLocaleString()} <span className="text-slate-500">/ ₹{g.targetAmount.toLocaleString()}</span></span>
                          {isDelayed && (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/60">
                              -{sidebarDaysGap}d delay
                            </span>
                          )}
                        </div>

                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2.5">
                          <div className="h-full bg-sky-400 rounded-full" style={{ width: `${gPct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Fleet Goal Command Deck */}
              {activeGoal && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* Left Console */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="terminal-panel rounded-xl p-5 border border-slate-800 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center">
                            <ActiveIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-lg font-black text-white tracking-wide">{activeGoal.name}</h2>
                              <span className="text-[9px] uppercase font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/60">
                                {activeGoal.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              Cap Ceiling: ₹{activeGoal.targetAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button 
                            onClick={handleOpenEditGoal} 
                            className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition"
                            title="Extend Timeline"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteGoal(activeGoal.id)} 
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Flight Horizon Date Box */}
                      <div className="bg-[#070A12] border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{activeGoal.startDate}</span>
                          <ArrowRight className="w-3 h-3 text-sky-400" />
                          <span>{activeGoal.targetDate}</span>
                        </div>
                        <button
                          onClick={handleOpenEditGoal}
                          className="text-[11px] font-bold text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2.5 py-0.5 rounded transition hover:bg-sky-900/60"
                        >
                          {daysLeft}d left (Extend ➔)
                        </button>
                      </div>

                      {/* Control Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            setTransferAmountStr('');
                            setTransferNote('');
                            setIsTransferModalOpen(true);
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" /> Shift Funds
                        </button>

                        {eligibleTargetGoals.length > 0 && (
                          <button
                            onClick={() => {
                              setTargetGoalId(eligibleTargetGoals[0].id);
                              setGoalTransferAmountStr('');
                              setGoalTransferNote('');
                              setIsGoalTransferModalOpen(true);
                            }}
                            className="bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/60 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Reallocate
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActionType('deposit');
                            setAmountStr('');
                            setNote('');
                            setIsTxModalOpen(true);
                          }}
                          className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-sky-500/20"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add / Withdraw
                        </button>
                      </div>
                    </div>

                    {/* Schedule Velocity Status */}
                    <div className={`p-4 rounded-xl border flex flex-col gap-1.5 ${
                      trajectoryStatus === 'delay' 
                        ? 'bg-rose-950/40 border-rose-900/60 text-rose-300' 
                        : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-sky-400" />
                          <span className="font-black uppercase tracking-wider">CORRIDOR SCHEDULE VELOCITY</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          trajectoryStatus === 'delay' ? 'bg-rose-900/90 text-rose-200' : 'bg-emerald-900/90 text-emerald-200'
                        }`}>
                          {trajectoryStatus === 'delay' ? `-${daysDifference}d Behind (-₹${varianceAmount.toLocaleString()})` : 'On Track'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        Deficit: {daysDifference} days. Target required rate: ₹{requiredPace}/day.
                        {trajectoryStatus === 'delay' && (
                          <span onClick={handleOpenEditGoal} className="ml-1 text-sky-400 underline font-bold cursor-pointer">
                            Extend arrival date?
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Progress Bar & Sub-allocations */}
                    <div className="terminal-panel rounded-xl p-5 border border-slate-800 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">SAVED FLEET CAPITAL</span>
                          <span className="text-3xl font-black text-white font-mono">₹{totalSaved.toLocaleString()}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-xl font-black text-emerald-400">{percentage}%</span>
                          <span className="text-[11px] text-slate-500 block">₹{remainingNeeded.toLocaleString()} remaining</span>
                        </div>
                      </div>

                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-400 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>

                      <div className="flex items-center gap-2 pt-2 text-xs font-mono">
                        <div className="bg-[#070A12] border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-emerald-400">
                          <Banknote className="w-3.5 h-3.5" /> Physical Cash: ₹{totalCash.toLocaleString()}
                        </div>
                        <div className="bg-[#070A12] border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sky-400">
                          <Smartphone className="w-3.5 h-3.5" /> Online/Bank: ₹{totalOnline.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Console */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    {/* Pace & Timeline Metric Tile */}
                    <div className="terminal-panel rounded-xl p-5 border border-slate-800 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-400 border-b border-slate-800 pb-2">
                        <Activity className="w-4 h-4" /> PACE & HORIZON TELEMETRY
                      </div>

                      <div className="grid grid-cols-2 gap-3 font-mono">
                        <div className="bg-[#070A12] border border-slate-800 p-3 rounded-xl space-y-1">
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">DAILY VELOCITY</span>
                          <p className="text-lg font-black text-sky-400">₹{requiredPace}<span className="text-xs text-slate-500 font-normal">/d</span></p>
                        </div>
                        <div className="bg-[#070A12] border border-slate-800 p-3 rounded-xl space-y-1">
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">TIME REMAINING</span>
                          <p className="text-lg font-black text-white">{daysLeft} <span className="text-xs text-slate-500 font-normal">days</span></p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Flight Telemetry Status:</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          trajectoryStatus === 'delay' ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {trajectoryStatus === 'delay' ? 'NEEDS ATTENTION' : 'HEALTHY'}
                        </span>
                      </div>
                    </div>

                    {/* Goal-Specific Transaction Records */}
                    <div className="terminal-panel rounded-xl p-5 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                        <span className="font-bold text-white uppercase tracking-wider">Recent Route Activity</span>
                        <span className="text-[10px] text-sky-400">{currentTxs.length} records</span>
                      </div>

                      <div className="divide-y divide-slate-800 max-h-64 overflow-y-auto">
                        {currentTxs.length === 0 ? (
                          <p className="text-xs text-slate-500 py-4 text-center font-mono">No entries logged on this route.</p>
                        ) : (
                          currentTxs.slice(0, 5).map((tx) => {
                            const isWithdraw = tx.action === 'withdraw';
                            return (
                              <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                                <div>
                                  <p className="text-white font-bold">{tx.note || 'Flight Entry'}</p>
                                  <p className="text-[10px] text-slate-500">{tx.type.toUpperCase()} • {tx.date}</p>
                                </div>
                                <span className={`font-black ${isWithdraw ? 'text-rose-400' : 'text-emerald-400'}`}>
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

          {/* TAB 4: SYSTEM CONFIG */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-lg mx-auto font-mono">
              <div className="border-b border-slate-800 pb-3">
                <h1 className="text-xl font-black text-white tracking-widest uppercase">System Operations Config</h1>
                <p className="text-xs text-slate-400">Terminal callsign and master reset controls.</p>
              </div>

              <div className="terminal-panel rounded-xl p-5 border border-slate-800 space-y-3">
                <span className="text-xs text-slate-500 uppercase font-bold block">ACTIVE CALLSIGN</span>
                <p className="text-white font-bold text-sm">{user.email}</p>

                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-full mt-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition"
                >
                  Terminate Callsign Session
                </button>
              </div>

              <div className="terminal-panel rounded-xl p-5 border border-rose-900/60 bg-rose-950/20 space-y-3">
                <span className="text-xs text-rose-400 uppercase font-bold block flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500" /> MASTER PURGE PROTOCOL
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Purging all telemetry will wipe all active aircraft goals, ledger logs, and reserve capital.
                </p>

                <button
                  onClick={() => { setResetInput(''); setIsResetModalOpen(true); }}
                  className="w-full bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Execute Master Purge
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 terminal-panel border-t border-slate-800 px-6 py-2 z-40 font-mono">
        <div className="max-w-md mx-auto flex items-center justify-between text-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-sky-400' : 'text-slate-500'}`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-sky-400' : 'text-slate-500'}`}
          >
            <History className="w-5 h-5" />
            <span className="text-[10px]">Ledger</span>
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'goals' ? 'text-sky-400' : 'text-slate-500'}`}
          >
            <Target className="w-5 h-5" />
            <span className="text-[10px]">Fleet</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-sky-400' : 'text-slate-500'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px]">Config</span>
          </button>
        </div>
      </nav>

      {/* 1. TRANSACTION KEYPAD MODAL */}
      {isTxModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 font-mono">
          <div className="relative w-full max-w-sm terminal-panel terminal-panel-glow rounded-t-2xl sm:rounded-2xl p-5 animate-terminal-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex-1 bg-[#070A12] p-1 rounded-lg flex border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActionType('deposit')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded transition ${
                    actionType === 'deposit' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  DEPOSIT (+)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('withdraw')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded transition ${
                    actionType === 'withdraw' ? 'bg-rose-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  WITHDRAW (−)
                </button>
              </div>
              <button onClick={() => setIsTxModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#070A12] border border-slate-800 rounded-xl p-3 text-center mt-3">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">{activeGoal.name}</span>
              <div className="text-2xl font-black text-white mt-1">
                <span className="text-sky-400 mr-1">₹</span>{amountStr ? Number(amountStr).toLocaleString() : '0'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={() => setWalletType('online')}
                className={`p-2.5 rounded-lg border text-left text-xs ${
                  walletType === 'online' ? 'border-sky-400 bg-sky-950/40 text-sky-300' : 'border-slate-800 bg-[#070A12] text-slate-400'
                }`}
              >
                <span className="block font-bold">ONLINE</span>
                <span className="text-[10px] text-slate-500">₹{totalOnline.toLocaleString()}</span>
              </button>
              <button
                type="button"
                onClick={() => setWalletType('cash')}
                className={`p-2.5 rounded-lg border text-left text-xs ${
                  walletType === 'cash' ? 'border-sky-400 bg-sky-950/40 text-sky-300' : 'border-slate-800 bg-[#070A12] text-slate-400'
                }`}
              >
                <span className="block font-bold">CASH</span>
                <span className="text-[10px] text-slate-500">₹{totalCash.toLocaleString()}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-sm font-black">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleTxKeypad(digit)}
                  className="h-11 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 text-white flex items-center justify-center active:scale-95"
                >
                  {digit}
                </button>
              ))}
              <button type="button" onClick={() => setAmountStr('')} className="h-11 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-xs">
                CLR
              </button>
              <button type="button" onClick={() => handleTxKeypad('0')} className="h-11 bg-slate-900 border border-slate-800 rounded-lg text-white">
                0
              </button>
              <button type="button" onClick={() => setAmountStr((prev) => prev.slice(0, -1))} className="h-11 bg-rose-950 border border-rose-900 rounded-lg text-rose-300 flex items-center justify-center">
                <Delete className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Flight memo (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-3 focus:outline-none focus:border-sky-400"
            />

            <button
              type="button"
              onClick={handleTransactionSubmit}
              disabled={!amountStr || Number(amountStr) <= 0}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl mt-3 transition disabled:opacity-40"
            >
              EXECUTE {actionType.toUpperCase()}
            </button>
          </div>
        </div>
      )}

      {/* 2. CASH <-> BANK SHIFT MODAL */}
      {isTransferModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 font-mono">
          <div className="relative w-full max-w-sm terminal-panel terminal-panel-glow rounded-t-2xl sm:rounded-2xl p-5 animate-terminal-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-black text-sm text-white">SHIFT CAPITAL TYPE</span>
              <button onClick={() => setIsTransferModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={() => { setTransferDirection('cash_to_bank'); setTransferAmountStr(''); }}
                className={`p-2.5 rounded-lg border text-left text-xs ${
                  transferDirection === 'cash_to_bank' ? 'border-sky-400 bg-sky-950/40 text-sky-300' : 'border-slate-800 bg-[#070A12] text-slate-400'
                }`}
              >
                <span className="block font-bold">CASH ➔ BANK</span>
                <span className="text-[10px] text-slate-500">₹{totalCash.toLocaleString()}</span>
              </button>

              <button
                type="button"
                onClick={() => { setTransferDirection('bank_to_cash'); setTransferAmountStr(''); }}
                className={`p-2.5 rounded-lg border text-left text-xs ${
                  transferDirection === 'bank_to_cash' ? 'border-sky-400 bg-sky-950/40 text-sky-300' : 'border-slate-800 bg-[#070A12] text-slate-400'
                }`}
              >
                <span className="block font-bold">BANK ➔ CASH</span>
                <span className="text-[10px] text-slate-500">₹{totalOnline.toLocaleString()}</span>
              </button>
            </div>

            <div className="bg-[#070A12] border border-slate-800 rounded-xl p-3 text-center mt-3">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">SUM TO CONVERT</span>
              <div className="text-2xl font-black text-white mt-1">
                <span className="text-sky-400 mr-1">₹</span>{transferAmountStr ? Number(transferAmountStr).toLocaleString() : '0'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-sm font-black">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleTransferKeypad(digit)}
                  className="h-11 bg-slate-900 border border-slate-800 rounded-lg text-white flex items-center justify-center"
                >
                  {digit}
                </button>
              ))}
              <button type="button" onClick={() => setTransferAmountStr('')} className="h-11 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-xs">
                CLR
              </button>
              <button type="button" onClick={() => handleTransferKeypad('0')} className="h-11 bg-slate-900 border border-slate-800 rounded-lg text-white">
                0
              </button>
              <button type="button" onClick={() => setTransferAmountStr((prev) => prev.slice(0, -1))} className="h-11 bg-rose-950 border border-rose-900 rounded-lg text-rose-300 flex items-center justify-center">
                <Delete className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleTransferSubmit}
              disabled={!transferAmountStr || Number(transferAmountStr) <= 0}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl mt-3 transition disabled:opacity-40"
            >
              CONFIRM CAPITAL CONVERSION
            </button>
          </div>
        </div>
      )}

      {/* 3. CROSS-GOAL REALLOCATION MODAL */}
      {isGoalTransferModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 font-mono">
          <div className="relative w-full max-w-sm terminal-panel terminal-panel-glow rounded-t-2xl sm:rounded-2xl p-5 animate-terminal-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-black text-sm text-white">INTER-FLEET REALLOCATION</span>
              <button onClick={() => setIsGoalTransferModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCrossGoalTransferSubmit} className="space-y-3 mt-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">TARGET CORRIDOR</label>
                <select
                  value={targetGoalId}
                  onChange={(e) => setTargetGoalId(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                >
                  {eligibleTargetGoals.map((g) => (
                    <option key={g.id} value={g.id}>{g.name} (Cap: ₹{g.targetAmount.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="bg-[#070A12] border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">REALLOCATION SUM</span>
                <div className="text-2xl font-black text-white mt-1">
                  <span className="text-sky-400 mr-1">₹</span>{goalTransferAmountStr ? Number(goalTransferAmountStr).toLocaleString() : '0'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm font-black">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleGoalTransferKeypad(digit)}
                    className="h-11 bg-slate-900 border border-slate-800 rounded-lg text-white flex items-center justify-center"
                  >
                    {digit}
                  </button>
                ))}
                <button type="button" onClick={() => setGoalTransferAmountStr('')} className="h-11 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-xs">
                  CLR
                </button>
                <button type="button" onClick={() => handleGoalTransferKeypad('0')} className="h-11 bg-slate-900 border border-slate-800 rounded-lg text-white">
                  0
                </button>
                <button type="button" onClick={() => setGoalTransferAmountStr((prev) => prev.slice(0, -1))} className="h-11 bg-rose-950 border border-rose-900 rounded-lg text-rose-300 flex items-center justify-center">
                  <Delete className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!goalTransferAmountStr || Number(goalTransferAmountStr) <= 0 || !targetGoalId}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl mt-3 transition disabled:opacity-40"
              >
                EXECUTE REALLOCATION
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. NEW GOAL CREATION MODAL */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 font-mono">
          <div className="relative w-full max-w-sm terminal-panel terminal-panel-glow rounded-t-2xl sm:rounded-2xl p-5 animate-terminal-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-black text-sm text-white">DEPLOY NEW FLEET TARGET</span>
              <button onClick={() => setIsAddGoalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3 mt-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">CALLSIGN / TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Boeing 787 Fleet, New Route"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">CAPITAL TARGET (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500000"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
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
                    className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">ARRIVAL DATE</label>
                  <input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl mt-2 transition"
              >
                INITIALIZE FLEET CORRIDOR
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. EXTEND TIMELINE / EDIT MODAL */}
      {isEditGoalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 font-mono">
          <div className="relative w-full max-w-sm terminal-panel terminal-panel-glow rounded-t-2xl sm:rounded-2xl p-5 animate-terminal-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-black text-sm text-white">MODIFY CORRIDOR TELEMETRY</span>
              <button onClick={() => setIsEditGoalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoalChanges} className="space-y-3 mt-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">GOAL NAME</label>
                <input
                  type="text"
                  value={editGoalName}
                  onChange={(e) => setEditGoalName(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">TARGET CAPITAL (₹)</label>
                <input
                  type="number"
                  value={editGoalAmount}
                  onChange={(e) => setEditGoalAmount(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">EXTENDED COMPLETION DATE</label>
                <input
                  type="date"
                  value={editGoalDate}
                  onChange={(e) => setEditGoalDate(e.target.value)}
                  className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSavingEdit}
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl mt-2 transition"
              >
                {isSavingEdit ? 'COMMITTING...' : 'SAVE MODIFIED TELEMETRY'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. RESET ALL DATA CONFIRMATION MODAL */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 font-mono">
          <div className="relative w-full max-w-sm terminal-panel border border-rose-600 rounded-t-2xl sm:rounded-2xl p-6 animate-terminal-up">
            <div className="flex items-center justify-between border-b border-rose-900/60 pb-3 text-rose-400">
              <span className="font-black text-sm uppercase flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> MASTER PURGE PROTOCOL
              </span>
              <button onClick={() => setIsResetModalOpen(false)} className="w-8 h-8 rounded-lg bg-rose-950 text-rose-300 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetAllData} className="mt-4 space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Confirming this action will <span className="text-rose-400 font-bold">permanently erase</span> all flight paths, targets, and ledger records.
              </p>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Type <span className="text-rose-400 font-bold">RESET</span> to confirm
                </label>
                <input
                  type="text"
                  placeholder="RESET"
                  value={resetInput}
                  onChange={(e) => setResetInput(e.target.value)}
                  className="w-full bg-[#070A12] border border-rose-900/80 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setIsResetModalOpen(false)} className="py-2.5 bg-slate-900 text-slate-400 font-bold rounded-xl">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetInput.trim().toUpperCase() !== 'RESET' || isResetting}
                  className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl disabled:opacity-40"
                >
                  {isResetting ? 'Purging...' : 'Execute Wipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}