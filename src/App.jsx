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
  Edit3
} from 'lucide-react';

/* Warm Organic Ambient 3D Canvas */
function AmbientCeramicCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = width < 768 ? 20 : 38;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.75 + 0.25,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2.8 + 1.2,
      isTerracotta: Math.random() > 0.5
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const time = Date.now() * 0.0006;
      const orb1X = width * 0.25 + Math.sin(time) * 35;
      const orb1Y = height * 0.3 + Math.cos(time) * 35;
      const orb1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, width * 0.45);
      orb1.addColorStop(0, 'rgba(224, 122, 95, 0.08)');
      orb1.addColorStop(1, 'transparent');
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, width, height);

      const orb2X = width * 0.8 + Math.cos(time * 0.9) * 40;
      const orb2Y = height * 0.7 + Math.sin(time * 0.9) * 35;
      const orb2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, width * 0.45);
      orb2.addColorStop(0, 'rgba(42, 157, 143, 0.07)');
      orb2.addColorStop(1, 'transparent');
      ctx.fillStyle = orb2;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const alpha = (1 - dist / 115) * 0.12 * Math.min(particles[i].z, particles[j].z);
            ctx.strokeStyle = `rgba(224, 122, 95, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        const offsetX = (mouseX - width / 2) * 0.012 * p.z;
        const offsetY = (mouseY - height / 2) * 0.012 * p.z;

        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x + offsetX, p.y + offsetY, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = p.isTerracotta 
          ? `rgba(224, 122, 95, ${0.28 * p.z})` 
          : `rgba(42, 157, 143, ${0.32 * p.z})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />;
}

const CATEGORY_PRESETS = [
  { id: 'savings', label: 'Savings', icon: PiggyBank },
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
  savings: PiggyBank,
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2A26] flex flex-col items-center justify-center p-4 relative">
      <AmbientCeramicCanvas />
      <div className="w-full max-w-sm ceramic-panel rounded-3xl p-6 sm:p-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E07A5F] flex items-center justify-center text-white shadow-md shadow-[#E07A5F]/25 mb-1">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#2D2A26] tracking-tight">FinTrack</h1>
          <p className="text-xs text-[#7D756D] font-medium">
            {isSignUp ? 'Create your calm savings sanctuary' : 'Sign in to access your ledger'}
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
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#E07A5F] transition"
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#E07A5F] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-[#E07A5F] hover:bg-[#D46B50] active:scale-95 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-[#E07A5F]/20 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Opening vault...' : isSignUp ? 'Create Sanctuary' : 'Enter Sanctuary'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-[#F1E8DF]">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
            className="text-xs font-bold text-[#7D756D] hover:text-[#E07A5F] transition"
          >
            {isSignUp ? 'Already registered? Sign In' : 'Need an account? Sign up'}
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
  const [newGoalCategory, setNewGoalCategory] = useState('savings');
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
    const diffDays = Math.max(1, Math.round(Math.abs(variance) / baselineDailyPace));

    const TOLERANCE = 20;

    if (variance < -TOLERANCE) {
      return { 
        trajectoryStatus: 'delay', 
        daysDifference: diffDays, 
        varianceAmount: Math.abs(variance) 
      };
    } else if (variance > TOLERANCE) {
      return { 
        trajectoryStatus: 'advance', 
        daysDifference: diffDays, 
        varianceAmount: variance 
      };
    } else {
      return { 
        trajectoryStatus: 'on-track', 
        daysDifference: 0, 
        varianceAmount: 0 
      };
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
      alert(`Successfully shifted ₹${val.toLocaleString()} from ${activeGoal.name} to ${destName}!`);
    } catch (err) {
      alert('Cross-goal transfer failed: ' + err.message);
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
      setNewGoalCategory('savings');
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
      alert('Timeline and goal parameters successfully updated!');
    } catch (err) {
      alert('Failed to update goal: ' + err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (confirm('Delete this goal and its cloud records?')) {
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
      alert('All goals and transaction records have been completely reset.');
    } catch (err) {
      console.error('Reset error:', err.message);
      alert('Failed to reset: ' + err.message);
    } finally {
      setIsResetting(false);
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
  const eligibleTargetGoals = goals.filter((g) => g.id !== selectedGoalId);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2A26] flex flex-col md:flex-row pb-24 md:pb-0 font-sans relative overflow-x-hidden">
      
      {/* 3D Ambient Canvas */}
      <AmbientCeramicCanvas />

      {/* LAPTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 ceramic-panel border-r border-[#F1E8DF] p-5 shrink-0 justify-between sticky top-0 h-screen z-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E07A5F] text-white flex items-center justify-center shadow-md shadow-[#E07A5F]/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-[#E07A5F] block leading-tight">FinTrack</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9C948B]">Warm Ceramic</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                activeTab === 'home' ? 'bg-[#2A9D8F]/15 text-[#2A9D8F]' : 'text-[#7D756D] hover:bg-[#FAF7F2]'
              }`}
            >
              <HomeIcon className="w-4 h-4" /> Home
            </button>

            <button
              onClick={() => setActiveTab('goals')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                activeTab === 'goals' ? 'bg-[#E07A5F]/15 text-[#E07A5F]' : 'text-[#7D756D] hover:bg-[#FAF7F2]'
              }`}
            >
              <Target className="w-4 h-4" /> Goals & Tracker
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                activeTab === 'history' ? 'bg-[#2A9D8F]/15 text-[#2A9D8F]' : 'text-[#7D756D] hover:bg-[#FAF7F2]'
              }`}
            >
              <History className="w-4 h-4" /> Transactions
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                activeTab === 'settings' ? 'bg-[#E07A5F]/15 text-[#E07A5F]' : 'text-[#7D756D] hover:bg-[#FAF7F2]'
              }`}
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#F1E8DF]">
          <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EADBCC] shadow-2xs">
            <span className="text-[10px] font-mono text-[#9C948B] uppercase font-bold block">PORTFOLIO VAULT</span>
            <p className="text-lg font-black text-[#2D2A26] mt-0.5">₹{portfolioTotal.toLocaleString()}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#9C948B] hover:text-[#E76F51] transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        
        {/* Mobile Header */}
        <header className="md:hidden ceramic-panel px-5 pt-4 pb-3 border-b border-[#F1E8DF] sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#EADBCC] flex items-center justify-center text-[#E07A5F] font-black text-sm">
              {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="text-xl font-black tracking-tight text-[#E07A5F]">FinTrack</span>
          </div>

          <button className="p-2 text-[#E07A5F] hover:bg-[#FAF7F2] rounded-full transition">
            <Bell className="w-5 h-5" />
          </button>
        </header>

        {/* Laptop Subheader */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 ceramic-panel border-b border-[#F1E8DF]">
          <div>
            <h1 className="text-lg font-black text-[#2D2A26] capitalize">{activeTab}</h1>
            <p className="text-xs text-[#9C948B] font-medium">Logged in as {user.email}</p>
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
                className="bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#2A9D8F] font-bold text-xs px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition active:scale-95 border border-[#2A9D8F]/30"
              >
                <Share2 className="w-3.5 h-3.5" /> Goal ➔ Goal
              </button>
            )}
            <button
              onClick={() => {
                setTransferAmountStr('');
                setTransferNote('');
                setIsTransferModalOpen(true);
              }}
              className="bg-white border border-[#EADBCC] hover:bg-[#FAF7F2] text-[#E07A5F] font-bold text-xs px-4 py-2 rounded-2xl flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Shift Funds
            </button>
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="bg-[#E07A5F] hover:bg-[#D46B50] text-white font-bold text-xs px-4 py-2 rounded-2xl flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-[#E07A5F]/20"
            >
              <Plus className="w-3.5 h-3.5" /> New Goal
            </button>
          </div>
        </div>

        {/* CONTENT WORKSPACE */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-1">

          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#2D2A26] tracking-tight">
                  Good morning, {user.email?.split('@')[0] || 'Member'}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-[#9C948B] mt-0.5">
                  Here's a quick look at your sanctuary today.
                </p>
              </div>

              <div className="ceramic-panel rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#9C948B] font-bold block">
                    Total Vault
                  </span>
                  <p className="text-3xl sm:text-4xl font-black text-[#2D2A26] mt-1 tracking-tight">
                    ₹{portfolioTotal.toLocaleString()}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-[#2A9D8F]/15 text-[#2A9D8F] flex items-center justify-center">
                  <Landmark className="w-7 h-7 text-[#2A9D8F]" />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h2 className="text-lg font-black text-[#2D2A26]">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setTransferAmountStr('');
                      setTransferNote('');
                      setIsTransferModalOpen(true);
                    }}
                    className="ceramic-panel hover:bg-white text-[#E07A5F] font-bold text-xs py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition shadow-xs"
                  >
                    <ArrowLeftRight className="w-4 h-4" /> Shift Funds (Cash/Bank)
                  </button>

                  <button
                    onClick={() => {
                      setActionType('deposit');
                      setAmountStr('');
                      setNote('');
                      setIsTxModalOpen(true);
                    }}
                    className="bg-[#E07A5F] hover:bg-[#D46B50] text-white font-bold text-xs py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-98 shadow-md shadow-[#E07A5F]/20 transition"
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
                    className="w-full bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#2A9D8F] border border-[#2A9D8F]/30 font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition shadow-xs backdrop-blur-md"
                  >
                    <Share2 className="w-4 h-4 text-[#2A9D8F]" /> Transfer Money to Another Goal
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-[#2D2A26] tracking-tight">Transaction Stream</h1>
                <p className="text-xs font-semibold text-[#9C948B]">Recent savings and deposit records.</p>
              </div>

              <div className="ceramic-panel rounded-3xl p-5 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9C948B] font-bold block border-b border-[#F1E8DF] pb-2">
                  All Records
                </span>

                <div className="divide-y divide-[#F1E8DF]">
                  {allTransactions.length === 0 ? (
                    <p className="text-xs text-[#9C948B] py-8 text-center">No transactions recorded yet.</p>
                  ) : (
                    allTransactions.map((tx) => {
                      const isWithdraw = tx.action === 'withdraw';
                      return (
                        <div key={tx.id} className="py-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                              isWithdraw ? 'bg-[#E76F51]/15 text-[#E76F51]' : 'bg-[#2A9D8F]/15 text-[#2A9D8F]'
                            }`}>
                              {tx.type === 'online' ? <Smartphone className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#2D2A26] leading-snug">{tx.note || 'Savings Entry'}</p>
                              <p className="text-[10px] text-[#9C948B] font-medium">
                                {tx.goalName} • {tx.type} • {tx.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-black px-2.5 py-1 rounded-xl font-mono inline-block border ${
                              isWithdraw 
                                ? 'bg-[#E76F51]/10 text-[#E76F51] border-[#E76F51]/25' 
                                : 'bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/25'
                            }`}>
                              {isWithdraw ? '-' : '+'}₹{tx.amount.toLocaleString()}
                            </span>
                            <p className="text-[9px] text-[#9C948B] font-medium mt-0.5">
                              {isWithdraw ? 'Debited' : 'Completed'}
                            </p>
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
              
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#9C948B] font-bold">
                    Active Goals ({goals.length})
                  </span>
                  <button 
                    onClick={() => setIsAddGoalOpen(true)}
                    className="text-xs font-bold text-[#E07A5F] hover:text-[#D46B50]"
                  >
                    + Create Goal
                  </button>
                </div>

                {goals.length === 0 ? (
                  <div className="ceramic-panel border-2 border-dashed border-[#EADBCC] rounded-3xl p-8 text-center">
                    <button
                      onClick={() => setIsAddGoalOpen(true)}
                      className="w-10 h-10 rounded-full border border-[#EADBCC] text-[#9C948B] mx-auto flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <p className="text-xs font-bold text-[#7D756D] mt-2">No goals created yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                      
                      const isDelayed = gSaved < (gExpected - 20) && gSaved < g.targetAmount;
                      const sidebarDaysGap = Math.max(1, Math.round(Math.abs(gSaved - gExpected) / gDailyPace));
                      const GoalIcon = ICON_MAP[g.category] || Target;

                      return (
                        <div
                          key={g.id}
                          onClick={() => setSelectedGoalId(g.id)}
                          className={`ceramic-panel p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-[#E07A5F] ring-2 ring-[#E07A5F]/15 shadow-md' 
                              : 'hover:border-[#EADBCC]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#EADBCC] text-[#E07A5F] flex items-center justify-center">
                                <GoalIcon className="w-4 h-4" />
                              </div>
                              <span className="text-[9px] font-mono uppercase tracking-wider bg-[#2D2A26] text-white px-2 py-0.5 rounded-full font-bold">
                                {g.badge || 'Goal'}
                              </span>
                            </div>
                            <span className="text-xs font-mono font-black text-[#2A9D8F]">{gPct}%</span>
                          </div>

                          <h3 className="text-base font-black text-[#2D2A26] mt-2">{g.name}</h3>
                          
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="font-semibold text-[#2D2A26]">
                              ₹{gSaved.toLocaleString()} <span className="text-[#9C948B] font-normal">/ ₹{g.targetAmount.toLocaleString()}</span>
                            </span>
                            {isDelayed && (
                              <span className="text-[10px] font-mono font-bold text-[#E76F51] bg-[#E76F51]/10 px-2 py-0.5 rounded-full">
                                -{sidebarDaysGap}d delay
                              </span>
                            )}
                          </div>

                          <div className="w-full bg-[#FAF7F2] h-1.5 rounded-full overflow-hidden mt-3 border border-[#EADBCC]/60">
                            <div className="h-full bg-[#2A9D8F] rounded-full" style={{ width: `${gPct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {activeGoal && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* Left Column */}
                  <div className="lg:col-span-7 space-y-4">
                    
                    {/* Goal Header */}
                    <div className="ceramic-panel rounded-3xl p-5 sm:p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EADBCC] text-[#E07A5F] flex items-center justify-center shadow-xs">
                            <ActiveIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-xl sm:text-2xl font-black text-[#2D2A26] tracking-tight">{activeGoal.name}</h2>
                              <span className="text-[9px] font-mono uppercase tracking-wider bg-[#2D2A26] text-white px-2 py-0.5 rounded-full font-bold">
                                {activeGoal.badge}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-[#9C948B] mt-0.5">
                              Target Ceiling: ₹{activeGoal.targetAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button 
                            onClick={handleOpenEditGoal}
                            className="p-2 text-[#9C948B] hover:text-[#E07A5F] hover:bg-[#FAF7F2] rounded-xl transition"
                            title="Extend Timeline / Edit Goal"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button 
                            onClick={() => handleDeleteGoal(activeGoal.id)}
                            className="p-2 text-[#9C948B] hover:text-[#E76F51] hover:bg-rose-50 rounded-xl transition"
                            title="Delete Goal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Date Box */}
                      <div className="bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-[#7D756D] font-semibold text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#9C948B]" />
                          <span>{activeGoal.startDate}</span>
                          <ArrowRight className="w-3 h-3 text-[#9C948B]" />
                          <span>{activeGoal.targetDate}</span>
                        </div>
                        <button
                          onClick={handleOpenEditGoal}
                          className="text-[11px] font-bold text-[#E07A5F] bg-white border border-[#EADBCC] hover:bg-[#FAF7F2] px-2.5 py-1 rounded-xl transition"
                        >
                          {daysLeft}d left (Extend ➔)
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            setTransferAmountStr('');
                            setTransferNote('');
                            setIsTransferModalOpen(true);
                          }}
                          className="bg-white border border-[#EADBCC] hover:bg-[#FAF7F2] text-[#E07A5F] font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 active:scale-98 shadow-xs transition"
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
                            className="bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#2A9D8F] border border-[#2A9D8F]/30 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 active:scale-98 transition shadow-xs"
                          >
                            <Share2 className="w-3.5 h-3.5 text-[#2A9D8F]" /> Transfer to Goal
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActionType('deposit');
                            setAmountStr('');
                            setNote('');
                            setIsTxModalOpen(true);
                          }}
                          className={`bg-[#E07A5F] hover:bg-[#D46B50] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 active:scale-98 shadow-md shadow-[#E07A5F]/20 transition ${
                            eligibleTargetGoals.length === 0 ? 'sm:col-span-2' : ''
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" /> Add / Withdraw
                        </button>
                      </div>
                    </div>

                    {/* Schedule Status Card */}
                    <div className={`p-4 rounded-3xl border flex flex-col gap-2 ${
                      trajectoryStatus === 'delay' 
                        ? 'bg-[#E76F51]/10 border-[#E76F51]/25 text-[#A83D24] backdrop-blur-md' 
                        : 'bg-[#2A9D8F]/10 border-[#2A9D8F]/25 text-[#1D6C63] backdrop-blur-md'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`w-4 h-4 ${trajectoryStatus === 'delay' ? 'text-[#E76F51]' : 'text-[#2A9D8F]'}`} />
                          <span className="text-[11px] font-black uppercase tracking-wider font-mono">
                            Schedule Status:
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full text-white ${
                          trajectoryStatus === 'delay' ? 'bg-[#E76F51]' : 'bg-[#2A9D8F]'
                        }`}>
                          {trajectoryStatus === 'delay' ? `-${daysDifference}d Behind (-₹${varianceAmount.toLocaleString()})` : 'On Track'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold opacity-90 leading-snug">
                        Schedule gap: {daysDifference} days. Suggested rate: ₹{requiredPace}/day.
                        {trajectoryStatus === 'delay' && (
                          <span 
                            onClick={handleOpenEditGoal}
                            className="ml-1 text-[#E07A5F] underline font-bold cursor-pointer"
                          >
                            Extend end date?
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Total Saved Card */}
                    <div className="ceramic-panel rounded-3xl p-5 space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#9C948B]">
                          <span>TIMELINE WINDOW</span>
                          <span>{daysElapsed} OF {totalDurationDays} DAYS ({timeProgressPct}%)</span>
                        </div>
                        <div className="h-2 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EADBCC]/60">
                          <div className="h-full bg-[#2D2A26] rounded-full" style={{ width: `${timeProgressPct}%` }} />
                        </div>
                      </div>

                      <div className="pt-1 flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9C948B] font-bold block">
                            TOTAL VAULT SAVED
                          </span>
                          <span className="text-3xl font-black text-[#2D2A26] tracking-tight">
                            ₹{totalSaved.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-[#2A9D8F] font-mono">{percentage}%</span>
                          <span className="text-[11px] text-[#9C948B] block font-medium">₹{remainingNeeded.toLocaleString()} remaining</span>
                        </div>
                      </div>

                      <div className="h-2 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EADBCC]/60">
                        <div className="h-full bg-[#2A9D8F] rounded-full" style={{ width: `${percentage}%` }} />
                      </div>

                      <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                        <div className="bg-[#2A9D8F]/10 border border-[#2A9D8F]/25 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shrink-0">
                          <Banknote className="w-3.5 h-3.5 text-[#2A9D8F]" />
                          <span className="text-xs font-mono font-black text-[#1D6C63]">
                            Cash: ₹{totalCash.toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-[#2A9D8F]/10 border border-[#2A9D8F]/25 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shrink-0">
                          <Smartphone className="w-3.5 h-3.5 text-[#2A9D8F]" />
                          <span className="text-xs font-mono font-black text-[#1D6C63]">
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
                          className="bg-white border border-[#EADBCC] text-[#7D756D] text-xs font-bold px-3 py-1.5 rounded-2xl shrink-0 active:bg-[#FAF7F2]"
                        >
                          Withdraw to Cash ➔
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    {/* Pace & Timeline Card */}
                    <div className="ceramic-panel rounded-3xl p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#E07A5F]" />
                        <h3 className="text-base font-black text-[#2D2A26] tracking-tight">Pace & Timeline</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl p-4 space-y-1">
                          <span className="text-[9px] font-mono uppercase font-bold text-[#9C948B] block flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-[#2A9D8F]" /> REQUIRED PACE
                          </span>
                          <span className="text-[10px] text-[#9C948B] font-medium block">Daily target</span>
                          <p className="text-xl font-black text-[#E07A5F] font-mono">
                            ₹{requiredPace}<span className="text-xs text-[#9C948B] font-normal">/d</span>
                          </p>
                          <div className="h-1.5 w-full bg-white rounded-full overflow-hidden mt-2 border border-[#EADBCC]">
                            <div className="h-full bg-[#2A9D8F] rounded-full" style={{ width: '45%' }} />
                          </div>
                        </div>

                        <div className="bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl p-4 space-y-1">
                          <span className="text-[9px] font-mono uppercase font-bold text-[#9C948B] block flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#E07A5F]" /> HORIZON
                          </span>
                          <span className="text-[10px] text-[#9C948B] font-medium block">Time remaining</span>
                          <p className="text-xl font-black text-[#2D2A26] font-mono">
                            {daysLeft} <span className="text-xs font-normal text-[#9C948B]">days</span>
                          </p>
                          <div className="h-1.5 w-full bg-white rounded-full overflow-hidden mt-2 border border-[#EADBCC]">
                            <div className="h-full bg-[#E07A5F] rounded-full" style={{ width: `${timeProgressPct}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F1E8DF] flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#7D756D]">
                          {trajectoryStatus === 'delay' ? 'Pace adjustment recommended' : 'On track to meet goals.'}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          trajectoryStatus === 'delay' ? 'bg-[#E76F51]/15 text-[#E76F51]' : 'bg-[#2A9D8F]/15 text-[#2A9D8F]'
                        }`}>
                          {trajectoryStatus === 'delay' ? 'Needs Focus' : 'Healthy'}
                        </span>
                      </div>
                    </div>

                    {/* Goal Transaction Stream */}
                    <div className="ceramic-panel rounded-3xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-[#2D2A26] tracking-wide uppercase">Transaction Stream</h3>
                        <span className="text-[10px] font-mono font-bold bg-[#FAF7F2] text-[#E07A5F] border border-[#EADBCC] px-2.5 py-0.5 rounded-full">
                          {currentTxs.length} records
                        </span>
                      </div>

                      <div className="divide-y divide-[#F1E8DF] max-h-60 overflow-y-auto">
                        {currentTxs.length === 0 ? (
                          <p className="text-xs text-[#9C948B] py-4 text-center">No transactions logged yet.</p>
                        ) : (
                          currentTxs.slice(0, 6).map((tx) => {
                            const isWithdraw = tx.action === 'withdraw';
                            return (
                              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                    isWithdraw ? 'bg-[#E76F51]/15 text-[#E76F51]' : 'bg-[#2A9D8F]/15 text-[#2A9D8F]'
                                  }`}>
                                    {tx.type === 'online' ? <Smartphone className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-[#2D2A26] leading-tight">{tx.note || 'Savings Entry'}</p>
                                    <p className="text-[10px] text-[#9C948B] capitalize">{tx.type} • {tx.date}</p>
                                  </div>
                                </div>
                                <span className={`text-xs font-black px-2 py-0.5 rounded-lg font-mono border ${
                                  isWithdraw 
                                    ? 'bg-[#E76F51]/10 text-[#E76F51] border-[#E76F51]/25' 
                                    : 'bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/25'
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
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div>
                <h1 className="text-2xl font-black text-[#2D2A26] tracking-tight">Vault Settings</h1>
                <p className="text-xs text-[#9C948B] font-medium">Manage preferences, records, and access.</p>
              </div>
              
              <div className="ceramic-panel rounded-3xl p-5 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase text-[#9C948B] tracking-wider">Account Details</h3>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#7D756D]">Signed in user</span>
                  <span className="text-[#2D2A26] font-bold">{user.email}</span>
                </div>

                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-full bg-[#FAF7F2] hover:bg-white text-[#7D756D] font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 border border-[#EADBCC] transition"
                >
                  <LogOut className="w-4 h-4 text-[#9C948B]" /> Sign Out
                </button>
              </div>

              <div className="ceramic-panel border border-[#E76F51]/30 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#E76F51]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider">Danger Zone</h3>
                </div>

                <p className="text-xs text-[#7D756D] leading-relaxed">
                  Resetting all data will permanently wipe every goal, historical ledger record, and cash/bank balance for this account.
                </p>

                <button
                  onClick={() => {
                    setResetInput('');
                    setIsResetModalOpen(true);
                  }}
                  className="w-full bg-[#E76F51]/10 hover:bg-[#E76F51]/20 text-[#E76F51] border border-[#E76F51]/30 font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
                >
                  <RotateCcw className="w-4 h-4 text-[#E76F51]" />
                  <span>Reset All Data</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 ceramic-panel border-t border-[#F1E8DF] px-6 py-2 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? 'text-[#2A9D8F]' : 'text-[#9C948B]'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'home' ? 'bg-[#2A9D8F] text-white px-4' : ''}`}>
              <HomeIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'history' ? 'text-[#2A9D8F]' : 'text-[#9C948B]'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'history' ? 'bg-[#2A9D8F] text-white px-4' : ''}`}>
              <History className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold">History</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'goals' ? 'text-[#E07A5F]' : 'text-[#9C948B]'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'goals' ? 'bg-[#E07A5F] text-white px-4' : ''}`}>
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold">Goals</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 transition ${activeTab === 'settings' ? 'text-[#E07A5F]' : 'text-[#9C948B]'}`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'settings' ? 'bg-[#E07A5F] text-white px-4' : ''}`}>
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold">Profile</span>
          </button>
        </div>
      </nav>

      {/* 1. TRANSACTION MODAL */}
      {isTxModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-[#2D2A26]/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm ceramic-panel rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col animate-sheet-up max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 bg-[#FAF7F2] p-1 rounded-full flex border border-[#EADBCC]">
                <button
                  type="button"
                  onClick={() => setActionType('deposit')}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-full transition ${
                    actionType === 'deposit' ? 'bg-[#2A9D8F] text-white shadow-xs' : 'text-[#7D756D]'
                  }`}
                >
                  Deposit (+)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('withdraw')}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-full transition ${
                    actionType === 'withdraw' ? 'bg-[#E76F51] text-white shadow-xs' : 'text-[#7D756D]'
                  }`}
                >
                  Withdraw (-)
                </button>
              </div>

              <button 
                onClick={() => setIsTxModalOpen(false)} 
                className="w-9 h-9 rounded-full bg-[#FAF7F2] text-[#7D756D] border border-[#EADBCC] flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl p-4 text-center mt-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7D756D] block">
                {actionType === 'deposit' ? 'ADD TO GOAL' : 'WITHDRAW FROM GOAL'} ({activeGoal.name.toUpperCase()})
              </span>
              <div className="text-2xl font-mono font-bold text-[#2D2A26] mt-1">
                <span className="text-[#E07A5F] mr-1 text-lg">₹</span>
                {amountStr ? Number(amountStr).toLocaleString() : '0'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <button
                type="button"
                onClick={() => setWalletType('online')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2 ${
                  walletType === 'online' 
                    ? 'bg-[#2A9D8F]/10 border-[#2A9D8F] text-[#1D6C63] ring-1 ring-[#2A9D8F]' 
                    : 'bg-white border-[#EADBCC] text-[#7D756D]'
                }`}
              >
                <Smartphone className="w-4 h-4 shrink-0 text-[#2A9D8F]" />
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
                    ? 'bg-[#2A9D8F]/10 border-[#2A9D8F] text-[#1D6C63] ring-1 ring-[#2A9D8F]' 
                    : 'bg-white border-[#EADBCC] text-[#7D756D]'
                }`}
              >
                <Banknote className="w-4 h-4 shrink-0 text-[#9C948B]" />
                <div>
                  <span className="text-xs font-bold block leading-tight">Cash</span>
                  <span className="text-[11px] font-mono font-bold">(₹{totalCash.toLocaleString()})</span>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleTxKeypad(digit)}
                  className="h-12 bg-white text-[#2D2A26] font-bold text-lg rounded-2xl border border-[#EADBCC] active:bg-[#FAF7F2] flex items-center justify-center transition active:scale-95"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmountStr('')}
                className="h-12 bg-[#FAF7F2] text-[#7D756D] font-bold text-xs rounded-2xl border border-[#EADBCC] flex items-center justify-center active:scale-95 font-mono"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleTxKeypad('0')}
                className="h-12 bg-white text-[#2D2A26] font-bold text-lg rounded-2xl border border-[#EADBCC] active:bg-[#FAF7F2] flex items-center justify-center active:scale-95"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setAmountStr((prev) => prev.slice(0, -1))}
                className="h-12 bg-[#E76F51]/10 text-[#E76F51] font-bold text-xs rounded-2xl border border-[#E76F51]/30 flex items-center justify-center active:scale-95"
              >
                <Delete className="w-4 h-4 text-[#E76F51]" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Memo / Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs text-[#2D2A26] mt-3 font-medium focus:outline-none focus:bg-white focus:border-[#E07A5F]"
            />

            <button
              type="button"
              onClick={handleTransactionSubmit}
              disabled={!amountStr || Number(amountStr) <= 0}
              className={`w-full py-3.5 text-white font-bold text-xs rounded-2xl mt-3 shadow-md disabled:opacity-40 transition active:scale-98 ${
                actionType === 'deposit' 
                  ? 'bg-[#2A9D8F] hover:bg-[#238276] shadow-[#2A9D8F]/25' 
                  : 'bg-[#E76F51] hover:bg-[#D55F42] shadow-[#E76F51]/25'
              }`}
            >
              Confirm {actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </button>
          </div>
        </div>
      )}

      {/* 2. DEDICATED CASH <-> BANK SHIFT MODAL */}
      {isTransferModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-[#2D2A26]/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm ceramic-panel rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col animate-sheet-up max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E8DF]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#E07A5F]/15 text-[#E07A5F] flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#2D2A26]">Shift Vault Funds</h3>
                  <p className="text-[10px] text-[#9C948B]">Move balance between Cash and Bank</p>
                </div>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EADBCC] text-[#7D756D] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setTransferDirection('cash_to_bank');
                  setTransferAmountStr('');
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  transferDirection === 'cash_to_bank' 
                    ? 'border-[#2A9D8F] ring-2 ring-[#2A9D8F]/20 bg-white' 
                    : 'border-[#EADBCC] bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1 text-[#2D2A26]">
                    <Banknote className="w-3.5 h-3.5 text-[#2A9D8F]" /> Cash ➔ Bank
                  </span>
                  {transferDirection === 'cash_to_bank' && (
                    <span className="w-2 h-2 rounded-full bg-[#2A9D8F]" />
                  )}
                </div>
                <div className="mt-2 text-xs font-semibold">
                  <span className="text-[10px] text-[#9C948B] block">Available:</span>
                  <span className="font-mono font-black text-[#2D2A26]">₹{totalCash.toLocaleString()}</span>
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
                    ? 'border-[#E07A5F] ring-2 ring-[#E07A5F]/20 bg-white' 
                    : 'border-[#EADBCC] bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1 text-[#2D2A26]">
                    <Smartphone className="w-3.5 h-3.5 text-[#E07A5F]" /> Bank ➔ Cash
                  </span>
                  {transferDirection === 'bank_to_cash' && (
                    <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                  )}
                </div>
                <div className="mt-2 text-xs font-semibold">
                  <span className="text-[10px] text-[#9C948B] block">Available:</span>
                  <span className="font-mono font-black text-[#E07A5F]">₹{totalOnline.toLocaleString()}</span>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between px-1 text-xs mt-3">
              <span className="text-[#7D756D] font-medium">
                Source: {transferDirection === 'cash_to_bank' ? 'Cash Stash' : 'Bank Account'}
              </span>
              <button
                type="button"
                onClick={() => setTransferAmountStr(String(transferDirection === 'cash_to_bank' ? totalCash : totalOnline))}
                className="font-mono text-[11px] font-bold text-[#E07A5F] bg-[#FAF7F2] border border-[#EADBCC] px-2.5 py-1 rounded-xl"
              >
                Shift Max (₹{(transferDirection === 'cash_to_bank' ? totalCash : totalOnline).toLocaleString()})
              </button>
            </div>

            <div className="bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl p-3.5 text-center mt-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B] block">
                TRANSFER SUM
              </span>
              <div className="text-2xl font-mono font-bold text-[#2D2A26] mt-0.5">
                <span className="text-[#E07A5F] mr-1 text-lg">₹</span>
                {transferAmountStr ? Number(transferAmountStr).toLocaleString() : '0'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleTransferKeypad(digit)}
                  className="h-11 bg-white text-[#2D2A26] font-bold text-lg rounded-2xl border border-[#EADBCC] active:bg-[#FAF7F2] flex items-center justify-center transition active:scale-95"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTransferAmountStr('')}
                className="h-11 bg-[#FAF7F2] text-[#7D756D] font-bold text-xs rounded-2xl border border-[#EADBCC] flex items-center justify-center font-mono"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleTransferKeypad('0')}
                className="h-11 bg-white text-[#2D2A26] font-bold text-lg rounded-2xl border border-[#EADBCC] active:bg-[#FAF7F2] flex items-center justify-center active:scale-95"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setTransferAmountStr((prev) => prev.slice(0, -1))}
                className="h-11 bg-[#E76F51]/10 text-[#E76F51] font-bold text-xs rounded-2xl border border-[#E76F51]/30 flex items-center justify-center"
              >
                <Delete className="w-4 h-4 text-[#E76F51]" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Transfer note (e.g. ATM withdrawal, bank deposit)"
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs text-[#2D2A26] mt-2 font-medium focus:outline-none focus:bg-white focus:border-[#E07A5F]"
            />

            <button
              type="button"
              onClick={handleTransferSubmit}
              disabled={!transferAmountStr || Number(transferAmountStr) <= 0}
              className="w-full py-3.5 bg-[#2A9D8F] hover:bg-[#238276] text-white font-bold text-xs rounded-2xl mt-3 shadow-md shadow-[#2A9D8F]/20 disabled:opacity-40"
            >
              Confirm Transfer (₹{transferAmountStr ? Number(transferAmountStr).toLocaleString() : '0'})
            </button>
          </div>
        </div>
      )}

      {/* 3. DEDICATED CROSS-GOAL TRANSFER MODAL */}
      {isGoalTransferModalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-[#2D2A26]/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm ceramic-panel rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col animate-sheet-up max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E8DF]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#2A9D8F]/15 text-[#2A9D8F] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#2D2A26]">Transfer to Another Goal</h3>
                  <p className="text-[10px] text-[#9C948B]">Shift surplus from {activeGoal.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsGoalTransferModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EADBCC] text-[#7D756D] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCrossGoalTransferSubmit} className="space-y-3 mt-3">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B] block mb-1">
                  Destination Goal
                </label>
                <select
                  value={targetGoalId}
                  onChange={(e) => setTargetGoalId(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#2D2A26] focus:outline-none focus:border-[#2A9D8F]"
                  required
                >
                  {eligibleTargetGoals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} (Target: ₹{g.targetAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B] block mb-1">
                  Take From Balance
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGoalTransferWallet('online')}
                    className={`py-2 px-3 rounded-2xl border text-left transition ${
                      goalTransferWallet === 'online' 
                        ? 'border-[#2A9D8F] bg-[#2A9D8F]/10 ring-2 ring-[#2A9D8F]/20' 
                        : 'border-[#EADBCC] bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1 text-[#2D2A26]">
                      <Smartphone className="w-3.5 h-3.5 text-[#E07A5F]" /> Online
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#7D756D] block mt-0.5">
                      ₹{totalOnline.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGoalTransferWallet('cash')}
                    className={`py-2 px-3 rounded-2xl border text-left transition ${
                      goalTransferWallet === 'cash' 
                        ? 'border-[#2A9D8F] bg-[#2A9D8F]/10 ring-2 ring-[#2A9D8F]/20' 
                        : 'border-[#EADBCC] bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1 text-[#2D2A26]">
                      <Banknote className="w-3.5 h-3.5 text-[#2A9D8F]" /> Cash
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#7D756D] block mt-0.5">
                      ₹{totalCash.toLocaleString()}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1 text-xs">
                <span className="text-[#7D756D] font-medium">Available to shift:</span>
                <button
                  type="button"
                  onClick={() => setGoalTransferAmountStr(String(goalTransferWallet === 'cash' ? totalCash : totalOnline))}
                  className="font-mono text-[11px] font-bold text-[#2A9D8F] bg-[#FAF7F2] border border-[#EADBCC] px-2.5 py-0.5 rounded-xl"
                >
                  Send Max (₹{(goalTransferWallet === 'cash' ? totalCash : totalOnline).toLocaleString()})
                </button>
              </div>

              <div className="bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl p-3 text-center">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B] block">
                  AMOUNT TO TRANSFER
                </span>
                <div className="text-2xl font-mono font-bold text-[#2D2A26] mt-0.5">
                  <span className="text-[#2A9D8F] mr-1 text-lg">₹</span>
                  {goalTransferAmountStr ? Number(goalTransferAmountStr).toLocaleString() : '0'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleGoalTransferKeypad(digit)}
                    className="h-11 bg-white text-[#2D2A26] font-bold text-lg rounded-2xl border border-[#EADBCC] active:bg-[#FAF7F2] flex items-center justify-center transition active:scale-95"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setGoalTransferAmountStr('')}
                  className="h-11 bg-[#FAF7F2] text-[#7D756D] font-bold text-xs rounded-2xl border border-[#EADBCC] flex items-center justify-center font-mono"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleGoalTransferKeypad('0')}
                  className="h-11 bg-white text-[#2D2A26] font-bold text-lg rounded-2xl border border-[#EADBCC] active:bg-[#FAF7F2] flex items-center justify-center active:scale-95"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => setGoalTransferAmountStr((prev) => prev.slice(0, -1))}
                  className="h-11 bg-[#E76F51]/10 text-[#E76F51] font-bold text-xs rounded-2xl border border-[#E76F51]/30 flex items-center justify-center"
                >
                  <Delete className="w-4 h-4 text-[#E76F51]" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Reason (e.g. Surplus funds transferred)"
                value={goalTransferNote}
                onChange={(e) => setGoalTransferNote(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs text-[#2D2A26] font-medium focus:outline-none focus:bg-white focus:border-[#2A9D8F]"
              />

              <button
                type="submit"
                disabled={!goalTransferAmountStr || Number(goalTransferAmountStr) <= 0 || !targetGoalId}
                className="w-full py-3.5 bg-[#2A9D8F] hover:bg-[#238276] active:scale-98 text-white font-bold text-xs rounded-2xl shadow-md shadow-[#2A9D8F]/20 disabled:opacity-40"
              >
                Execute Goal Transfer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. NEW FINANCIAL GOAL MODAL */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D2A26]/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm ceramic-panel rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col animate-sheet-up max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E8DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E07A5F]/15 text-[#E07A5F] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#2D2A26] text-base">New Financial Goal</h3>
              </div>
              <button 
                onClick={() => setIsAddGoalOpen(false)} 
                className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EADBCC] text-[#7D756D] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3.5">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B] block mb-2">
                  CATEGORY
                </label>
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
                          isSelected 
                            ? 'bg-[#E07A5F] text-white border-[#E07A5F] shadow-sm' 
                            : 'bg-white text-[#7D756D] border-[#EADBCC] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <CatIcon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#2A9D8F]'}`} />
                        <span className="text-[11px] font-bold">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B]">
                  GOAL TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5-Year Savings, MacBook, Bali Trip"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#E07A5F]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B]">
                  TARGET CAPITAL (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1000000"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#E07A5F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B]">
                    START DATE
                  </label>
                  <input
                    type="date"
                    value={newGoalStartDate}
                    onChange={(e) => setNewGoalStartDate(e.target.value)}
                    className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B]">
                    TARGET DATE
                  </label>
                  <input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#E07A5F] hover:bg-[#D46B50] active:scale-98 text-white font-bold text-xs rounded-2xl shadow-md shadow-[#E07A5F]/20 mt-2"
              >
                Launch Financial Target
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. EXTEND TIMELINE / EDIT GOAL PARAMETERS MODAL */}
      {isEditGoalOpen && activeGoal && (
        <div className="fixed inset-0 z-50 bg-[#2D2A26]/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm ceramic-panel rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col animate-sheet-up max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E8DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E07A5F]/15 text-[#E07A5F] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[#2D2A26] text-base">Extend Timeline / Modify</h3>
                  <p className="text-[10px] text-[#9C948B]">Adjust date or target after unexpected withdrawals</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditGoalOpen(false)} 
                className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EADBCC] text-[#7D756D] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoalChanges} className="mt-4 space-y-3.5">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B]">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={editGoalName}
                  onChange={(e) => setEditGoalName(e.target.value)}
                  className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#E07A5F]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B]">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={editGoalAmount}
                  onChange={(e) => setEditGoalAmount(e.target.value)}
                  className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#E07A5F]"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B]">
                    Extended Completion Date
                  </label>
                  <span className="text-[10px] text-[#E07A5F] font-bold">Postpone deadline</span>
                </div>
                <input
                  type="date"
                  value={editGoalDate}
                  onChange={(e) => setEditGoalDate(e.target.value)}
                  className="w-full mt-1 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#E07A5F]"
                  required
                />
                <p className="text-[10px] text-[#9C948B] mt-1">
                  Extending the deadline will recalculate and lower your daily required pace.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditGoalOpen(false)}
                  className="w-full py-3 bg-[#FAF7F2] hover:bg-[#F1E8DF] text-[#7D756D] font-bold text-xs rounded-2xl transition border border-[#EADBCC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="w-full py-3 bg-[#E07A5F] hover:bg-[#D46B50] active:scale-98 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-[#E07A5F]/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSavingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
                  <span>Save Updates</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. RESET ALL DATA CONFIRMATION MODAL */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D2A26]/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div className="relative w-full max-w-sm ceramic-panel rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#E76F51]/30 flex flex-col animate-sheet-up">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E8DF]">
              <div className="flex items-center gap-2 text-[#E76F51]">
                <div className="w-9 h-9 rounded-full bg-[#E76F51]/10 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-[#E76F51]" />
                </div>
                <h3 className="font-black text-[#2D2A26] text-base">Reset All Data</h3>
              </div>
              <button 
                onClick={() => setIsResetModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EADBCC] text-[#7D756D] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetAllData} className="mt-4 space-y-4">
              <p className="text-xs text-[#7D756D] leading-relaxed font-medium">
                This action is <span className="text-[#E76F51] font-bold">permanent and irreversible</span>. All your savings goals, timelines, and transaction records will be permanently deleted from the cloud.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9C948B]">
                  Type <span className="text-[#E76F51] font-black">RESET</span> to confirm
                </label>
                <input
                  type="text"
                  placeholder="RESET"
                  value={resetInput}
                  onChange={(e) => setResetInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E76F51]/30 rounded-2xl px-4 py-3 text-xs font-mono font-bold uppercase text-[#2D2A26] focus:outline-none focus:bg-white focus:border-[#E76F51]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="w-full py-3 bg-[#FAF7F2] hover:bg-[#F1E8DF] text-[#7D756D] font-bold text-xs rounded-2xl transition border border-[#EADBCC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetInput.trim().toUpperCase() !== 'RESET' || isResetting}
                  className="w-full py-3 bg-[#E76F51] hover:bg-[#D55F42] active:scale-98 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-[#E76F51]/20 disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                  <span>Wipe Everything</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}