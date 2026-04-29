import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Landmark, Clock, Percent, Activity, RefreshCw, AlertTriangle } from 'lucide-react';
import { simulateScenario } from '../utils/SimulateEngine';

export default function SimulateView({ baseData }) {
  const [tweaks, setTweaks] = useState({
    salary: baseData?.salary || 50000,
    loanAmount: baseData?.recommended?.loan?.netDisbursed || 1000000,
    tenureYears: baseData?.recommended?.overview?.years || 10,
    interestRate: baseData?.recommended?.bankRawInfo?.interest?.effective_mid || 9.5
  });

  const sim = useMemo(() => {
    if (!baseData?.recommended) return null;
    return simulateScenario(baseData.recommended, tweaks);
  }, [tweaks, baseData]);

  const resetTweaks = () => {
    setTweaks({
      salary: baseData?.salary,
      loanAmount: baseData?.recommended?.loan?.netDisbursed,
      tenureYears: baseData?.recommended?.overview?.years,
      interestRate: baseData?.recommended?.bankRawInfo?.interest?.effective_mid
    });
  };

  if (!sim) return null;

  const remaining = tweaks.salary - sim.simulatedLoan.emi;
  
  // Declaring isDanger to fix the Uncaught ReferenceError
  const isDanger = remaining <= 0 || sim.riskLevel === "High Risk";
  
  // Level mapping for specific screenshot shades
  const getLevel = () => {
    if (isDanger) return 'critical';
    if (remaining < 15000) return 'warning';
    return 'safe';
  };

  const level = getLevel();

  const theme = {
    critical: {
      bg: 'bg-[#FFF1F2]', // Soft Rose
      border: 'border-[#FECDD3]',
      text: 'text-[#E11D48]',
      accent: 'bg-white',
    },
    warning: {
      bg: 'bg-[#FFFBEB]', // Soft Amber
      border: 'border-[#FEF3C7]',
      text: 'text-[#D97706]',
      accent: 'bg-white',
    },
    safe: {
      bg: 'bg-[#F0FDF4]', // Soft Emerald
      border: 'border-[#DCFCE7]',
      text: 'text-[#16A34A]',
      accent: 'bg-white',
    }
  }[level];

  return (
    <div className="space-y-6 pb-20 font-sans max-w-[1400px] mx-auto">
      
      {/* --- REFERENCE HEADER --- */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
             <Activity size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Plan Reference</h4>
            <div className="flex gap-8 mt-1">
               <RefStat label="Loan" value={baseData?.recommended?.loan?.netDisbursed} />
               <RefStat label="Salary" value={baseData?.salary} />
               <RefStat label="EMI" value={baseData?.recommended?.overview?.emi} />
            </div>
          </div>
        </div>
        <button onClick={resetTweaks} className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 hover:text-violet-600 transition-colors">
          <RefreshCw size={14} /> Reset Base
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* --- CONTROLS --- */}
        <div className="lg:col-span-7 space-y-6">
           <ControlCard label="Adjusted Monthly Salary" value={tweaks.salary} min={15000} max={250000} step={1000} onChange={(v) => setTweaks({...tweaks, salary: v})} unit="/mo" base={baseData.salary} />
           <ControlCard label="Modified Loan Principal" value={tweaks.loanAmount} min={100000} max={5000000} step={10000} onChange={(v) => setTweaks({...tweaks, loanAmount: v})} unit="" base={baseData.recommended.loan.netDisbursed} />
           <ControlCard label="Repayment Duration" value={tweaks.tenureYears} min={1} max={15} step={1} onChange={(v) => setTweaks({...tweaks, tenureYears: v})} unit=" years" base={baseData.recommended.overview.years} />
           <ControlCard label="Interest Rate Shift" value={tweaks.interestRate} min={7} max={18} step={0.1} onChange={(v) => setTweaks({...tweaks, interestRate: v})} unit="%" base={baseData.recommended.bankRawInfo.interest.effective_mid} />
        </div>

        {/* --- DYNAMIC OUTPUT BOX --- */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`${theme.bg} ${theme.border} border rounded-[2rem] p-8 shadow-sm transition-colors duration-500`}>
             <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                   <div className={`${theme.accent} p-2 rounded-xl shadow-sm border border-black/5`}>
                      <AlertTriangle className={theme.text} size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Simulated Risk Status</p>
                      <h3 className={`text-lg font-black ${theme.text}`}>{sim.riskLevel}</h3>
                   </div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-black/5 text-slate-400 italic">Live Update</span>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <MetricBox label="Monthly EMI" value={sim.simulatedLoan.emi} delta={sim.deltas.emiDelta} />
                <MetricBox label="Total Repayable" value={sim.simulatedLoan.totalRepayment} delta={sim.deltas.totalRepaymentDelta} />
                <MetricBox label="Post-EMI Surplus" value={remaining} delta={remaining - (baseData.salary - baseData.recommended.overview.emi)} isSafe={!isDanger} />
                <MetricBox label="EMI/Salary Ratio" value={`${((sim.simulatedLoan.emi / (tweaks.salary || 1))*100).toFixed(0)}%`} isPercent />
             </div>

             <div className="mt-8 space-y-4">
                <ProgressBar label="Debt Consumption" percent={(sim.simulatedLoan.emi / (tweaks.salary || 1)) * 100} color={isDanger ? "bg-rose-500" : "bg-amber-400"} />
                <ProgressBar label="Available Liquidity" percent={(remaining / (tweaks.salary || 1)) * 100} color="bg-emerald-500" />
             </div>
          </div>

          <div className="space-y-3">
             {sim.simInsights.map((insight, idx) => (
                <div key={idx} className={`p-6 rounded-[1.5rem] border ${insight.severity === 'critical' ? 'bg-[#FFF1F2] border-[#FECDD3]' : 'bg-[#FFFBEB] border-[#FEF3C7]'}`}>
                   <div className="flex gap-3">
                      <div className="mt-1"><AlertTriangle size={14} className={insight.severity === 'critical' ? 'text-rose-500' : 'text-amber-500'} /></div>
                      <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">
                         {insight.text}
                      </p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function ControlCard({ label, value, min, max, step, onChange, unit, base }) {
  const diff = value - base;
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{label}</h5>
        <div className="text-right">
           <span className="text-sm font-black text-violet-600 font-mono tracking-tighter">
             {unit === "" ? `₹${Math.round(value).toLocaleString()}` : `${value}${unit}`}
           </span>
           {diff !== 0 && (
             <p className={`text-[9px] font-black uppercase mt-1 ${diff > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {diff > 0 ? '+' : ''}{unit === "" ? Math.round(diff).toLocaleString() : diff.toFixed(1)} {unit}
             </p>
           )}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600" />
      <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono">
         <span>Min: {unit === "" ? `₹${min/1000}k` : `${min}${unit}`}</span>
         <span>Max: {unit === "" ? `₹${max/100000}L` : `${max}${unit}`}</span>
      </div>
    </div>
  );
}

function MetricBox({ label, value, delta = 0, isPercent = false }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="text-lg font-black text-slate-900 tracking-tighter">
        {isPercent ? value : `₹${Math.round(value).toLocaleString()}`}
      </div>
      {delta !== 0 && (
        <p className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${delta > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
          {delta > 0 ? '↑' : '↓'} {Math.abs(Math.round(delta)).toLocaleString()}
        </p>
      )}
    </div>
  );
}

function ProgressBar({ label, percent, color }) {
  return (
    <div>
       <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
          <span className="text-[10px] font-black text-slate-900">{Math.max(0, Math.round(percent))}%</span>
       </div>
       <div className="w-full h-2.5 bg-white rounded-full border border-black/5 overflow-hidden">
          <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
       </div>
    </div>
  );
}

function RefStat({ label, value }) {
  return (
    <div className="text-left">
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-black text-slate-900 tracking-tight">₹{Math.round(value || 0).toLocaleString()}</p>
    </div>
  );
}