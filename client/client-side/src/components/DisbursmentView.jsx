import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Zap, TrendingUp, Landmark, Clock,
  CheckCircle2, Info, RefreshCw, Target, BrainCircuit, 
  Wallet, Percent, AlertTriangle, Minus, Plus, ArrowRight, 
  BarChart3, ChevronDown, ChevronUp, Lightbulb, PiggyBank, Users
} from 'lucide-react';

// Engine and Utility imports
import { runDisbursementAnalysis, generateEqualDisbursements } from '../utils/disbursementEngine';
import { formatCurrency } from '../utils/LoanCalculator';

export default function DisbursementView({ baseData }) {
  // 1. DYNAMIC STATE - Expanded for Strategy features
  const [params, setParams] = useState({
    totalLoanAmount: baseData?.recommended?.loan?.netDisbursed || 1000000,
    interestRate: baseData?.recommended?.bankRawInfo?.interest?.effective_mid || 9.5,
    courseDuration: 4,
    gracePeriod: 0.5,
    repaymentTenure: baseData?.recommended?.overview?.years || 7,
    expectedSalary: baseData?.salary || 100000,
    parentalIncome: baseData?.input?.familyIncome || 400000,
    interestType: 'simple',
    loanInsurance: 25000, 
    surplusPrepayPct: 10,
    disbursements: generateEqualDisbursements(baseData?.recommended?.loan?.netDisbursed || 1000000, 4)
  });
  // Inside DisbursementView.jsx component:

const addTranche = () => {
  setParams(prev => {
    const nextYear = prev.disbursements.length + 1;
    const newDisbursements = [...prev.disbursements, { year: nextYear, amount: 0 }];
    return { ...prev, courseDuration: nextYear, disbursements: newDisbursements };
  });
};

const removeTranche = (idx) => {
  setParams(prev => {
    if (prev.disbursements.length <= 1) return prev;
    const filtered = prev.disbursements.filter((_, i) => i !== idx);
    // Re-map years to be sequential (1, 2, 3...)
    const remapped = filtered.map((d, i) => ({ ...d, year: i + 1 }));
    return { ...prev, courseDuration: remapped.length, disbursements: remapped };
  });
};

const redistribute = () => {
  setParams(prev => ({
    ...prev,
    disbursements: generateEqualDisbursements(prev.totalLoanAmount, prev.disbursements.length)
  }));
};

  // 2. EXECUTE ENGINE
  const result = useMemo(() => {
  try {
    return runDisbursementAnalysis({
      ...params
    });
  } catch (e) {
    console.error("Engine Error:", e);
    return null;
  }
}, [params]);


  if (!result) return null;

  // 3. UI HANDLERS
  const updateTranche = (idx, val) => {
    const updated = [...params.disbursements];
    updated[idx] = { ...updated[idx], amount: Number(val) };
    setParams({ ...params, disbursements: updated });
  };

  const { insights } = result;

  return (
    <div className="space-y-6 pb-20 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-700">
      
      {/* ─── 1. VERDICT BANNER ─── */}
      <VerdictBanner verdict={insights.verdict} />

      {/* ─── 2. SUMMARY HUD ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Original Loan" value={result.totalDisbursed} sub={`Incl. ₹${params.loanInsurance.toLocaleString()} Insurance`} />
        <SummaryCard label="Effective Principal" value={result.effectivePrincipal} sub={`+${formatCurrency(result.totalMoratoriumInterest)} Wait Tax`} highlight />
        <SummaryCard label="Monthly EMI" value={result.emi} sub={`${result.emiToSalaryRatio}% of Salary`} />
        <SummaryCard label="Cost per ₹1" value={`₹${(result.totalRepayment / result.totalDisbursed).toFixed(2)}`} sub="Lifetime Multiplier" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ─── LEFT COLUMN: SIMULATION ─── */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-slate-900 uppercase italic flex items-center gap-2">
                    <RefreshCw className="text-slate-400" size={18} /> Strategy Cockpit
                </h3>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
                    {['simple', 'compound'].map(t => (
                        <button key={t} onClick={() => setParams({...params, interestType: t})}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${params.interestType === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}>
                          {t}
                        </button>
                    ))}
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                <SurgicalInput label="Bank Rate (%)" value={params.interestRate} onChange={(v)=>setParams({...params, interestRate:v})} />
                <SurgicalInput label="Family Income" value={params.parentalIncome} onChange={(v)=>setParams({...params, parentalIncome:v})} />
                <SurgicalInput label="Grace Period (Y)" value={params.gracePeriod} onChange={(v)=>setParams({...params, gracePeriod:v})} />
                <SurgicalInput label="Loan Insurance" value={params.loanInsurance} onChange={(v)=>setParams({...params, loanInsurance:v})} />
                
                {/* Prepayment Slider */}
                <div className="col-span-2 space-y-3 bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/50">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                          <PiggyBank size={12}/> Surplus Prepayment
                        </label>
                        <span className="text-xs font-black text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-100">{params.surplusPrepayPct}%</span>
                    </div>
                    <input type="range" min="0" max="50" step="5" value={params.surplusPrepayPct} onChange={(e)=>setParams({...params, surplusPrepayPct: Number(e.target.value)})} 
                      className="w-full h-1 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-tight">Using ₹{result.monthlyPrepay.toLocaleString()}/mo from your surplus</p>
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disbursement Schedule</p>
                {params.disbursements.map((d, i) => (
                    <div key={i} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 w-12 shrink-0 uppercase">Year {d.year}</span>
                        <input type="number" value={d.amount} onChange={(e) => updateTranche(i, e.target.value)}
                          className="flex-1 bg-transparent font-black text-slate-900 outline-none" />
                    </div>
                ))}
             </div>
          </div>

          <RealityCheck 
            items={insights.realityCheck} 
            surplusDeficit={result.surplusDeficit} 
            isDeficit={result.isDeficit} 
            expectedSalary={params.expectedSalary} 
            emi={result.emi} 
          />

          <TrancheTable breakdown={result.disbursementBreakdown} />
        </div>

        {/* ─── RIGHT COLUMN: INTELLIGENCE ─── */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* ⚡ POWER-UP SAVINGS CARD ⚡ */}
          <AnimatePresence>
            {result.moneySaved > 0 && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden"
              >
                  <div className="absolute -top-4 -right-4 p-6 opacity-20 rotate-12"><Zap size={120}/></div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Prepayment Power-Up</p>
                  <div className="text-5xl font-black italic tracking-tighter">Save {formatCurrency(result.moneySaved)}</div>
                  <div className="mt-6 pt-6 border-t border-white/20">
                      <p className="text-sm font-bold leading-relaxed">
                          By prepaying <span className="underline decoration-yellow-400 decoration-2">₹{result.monthlyPrepay.toLocaleString()}/mo</span>, you kill your debt <span className="text-yellow-300 font-black italic">{result.tenureSaved} years early.</span>
                      </p>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>

          <CostWaterfall result={result} />
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 mt-6">Deep Intelligence</p>
          <InsightCard icon={TrendingUp} iconBg="bg-slate-100 text-slate-900" title="Disbursement Impact" items={insights.disbursementImpact} />
          <InsightCard icon={AlertTriangle} iconBg="bg-amber-50 text-amber-600" title="Hidden Costs" items={insights.hiddenCosts} />
          <InsightCard icon={Users} iconBg="bg-emerald-50 text-emerald-600" title="Subsidy Policy" items={insights.parentalIncome} />
          
          <ConclusionBanner conclusion={insights.conclusion} />
        </div>
      </div>
    </div>
  );
}

// ─── ATOMIC SUB-COMPONENTS ───

function SummaryCard({ label, value, sub, highlight }) {
    return (
        <div className={`bg-white border rounded-[2rem] p-6 shadow-sm transition-all duration-500 ${highlight ? 'border-slate-900 ring-4 ring-slate-50' : 'border-slate-100 hover:border-slate-300'}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <div className="text-xl font-black text-slate-900 tracking-tighter italic">
                {typeof value === 'number' ? formatCurrency(value) : value}
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1">{sub}</p>
        </div>
    );
}

function SurgicalInput({ label, value, onChange }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
            <input type="number" value={value} onChange={(e)=>onChange(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-black text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none" />
        </div>
    );
}

function VerdictBanner({ verdict }) {
  if (!verdict) return null;
  const isDanger = verdict.type === 'danger';
  return (
    <div className={`p-8 rounded-[2.5rem] border-2 flex gap-6 items-center shadow-sm ${isDanger ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isDanger ? 'bg-rose-500' : 'bg-emerald-500'} text-white`}>
            {isDanger ? <AlertTriangle size={28} /> : <ShieldCheck size={28} />}
        </div>
        <div>
            <h3 className={`text-xl font-black uppercase italic ${isDanger ? 'text-rose-900' : 'text-emerald-900'}`}>{verdict.headline}</h3>
            <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-slate-900 bg-white/50 w-fit px-3 py-1.5 rounded-xl border border-black/5">
                <ArrowRight size={14} className="text-slate-400"/> Strategy Architecture Mapped
            </div>
        </div>
    </div>
  );
}

function RealityCheck({ items, surplusDeficit, isDeficit, expectedSalary, emi }) {
    return (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><BarChart3 size={16} className="text-slate-400"/> Reality Check</h3>
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-sm font-bold">{formatCurrency(expectedSalary)} salary</div>
                <span className="text-slate-300">−</span>
                <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 text-sm font-bold text-rose-600">{formatCurrency(emi)} EMI</div>
                <span className="text-slate-300">=</span>
                <div className={`${isDeficit ? 'bg-rose-600' : 'bg-emerald-500'} px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg shadow-slate-100`}>
                    {formatCurrency(Math.abs(surplusDeficit))} {isDeficit ? 'deficit' : 'surplus'}
                </div>
            </div>
            <div className="space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                        <span className="text-xs font-bold text-slate-500">{item.label}</span>
                        <span className="text-sm font-black text-slate-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TrancheTable({ breakdown }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <tr><th className="px-8 py-4">Year</th><th className="px-8 py-4 text-right">Interest Leak</th><th className="px-8 py-4 text-right">Balloon Amount</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {breakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5 text-xs font-black">Year {row.year}</td>
                        <td className="px-8 py-5 text-xs font-black text-rose-500 text-right">+{formatCurrency(row.interest)}</td>
                        <td className="px-8 py-5 text-xs font-black text-slate-900 text-right">{formatCurrency(row.growsTo)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}

function CostWaterfall({ result }) {
  const { totalRepayment, percentages } = result;
  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp size={160}/></div>
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Net Outflow Breakdown</h4>
        <div className="text-5xl font-black tracking-tighter italic mb-10 tracking-[-0.05em]">{formatCurrency(totalRepayment)}</div>
        <div className="space-y-6">
            <VisualBar label="Original Capital" percent={percentages.principalPct} color="bg-white" />
            <VisualBar label="Moratorium Tax" percent={percentages.moratoriumPct} color="bg-rose-400" />
            <VisualBar label="Repayment Interest" percent={percentages.repaymentInterestPct} color="bg-amber-400" />
        </div>
    </div>
  );
}

function InsightCard({ icon: Icon, iconBg, title, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm group">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 p-6 text-left hover:bg-slate-50 transition-all">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} shadow-sm group-hover:scale-110 transition-transform`}><Icon size={18}/></div>
            <span className="font-black text-xs uppercase tracking-widest flex-1 text-slate-900">{title}</span>
            {open ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
        </button>
        {open && (
            <div className="p-6 pt-0 space-y-6 border-t border-slate-50 animate-in slide-in-from-top-4 duration-300">
                {items.map((item, i) => (
                    <div key={i} className="space-y-3">
                        <p className="text-xs font-black text-slate-900 italic underline decoration-slate-200 underline-offset-4">{item.title}</p>
                        <div className="space-y-3">
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">"{item.means}"</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
                            <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-slate-700 leading-relaxed">{item.action}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}

function ConclusionBanner({ conclusion }) {
  if (!conclusion) return null;
  return (
    <div className="p-6 rounded-[2rem] border-2 bg-slate-50 border-slate-100 text-slate-800 flex gap-4 shadow-inner">
        <Info size={20} className="text-slate-400 shrink-0 mt-1" />
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500">Expert Conclusion</p>
            <p className="text-xs font-bold leading-relaxed italic">{conclusion.text}</p>
        </div>
    </div>
  );
}

function VisualBar({ label, percent, color }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-60">
                <span>{label}</span><span>{percent}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className={`h-full ${color}`} />
            </div>
        </div>
    );
}