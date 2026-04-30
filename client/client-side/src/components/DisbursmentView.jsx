import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Zap, TrendingUp, AlertTriangle, RefreshCw,
  BarChart3, ChevronDown, ChevronUp, Lightbulb, PiggyBank,
  Users, Plus, Minus, Info
} from 'lucide-react';

import { runDisbursementAnalysis, generateEqualDisbursements } from '../utils/disbursementEngine';
import { formatCurrency } from '../utils/LoanCalculator';

export default function DisbursementView({ baseData }) {
  const [params, setParams] = useState({
    totalLoanAmount: baseData?.recommended?.loan?.netDisbursed || 2025000,
    interestRate: baseData?.recommended?.bankRawInfo?.interest?.effective_mid || 9.5,
    courseDuration: 4,
    gracePeriod: 0.5,
    repaymentTenure: baseData?.recommended?.overview?.years || 7,
    expectedSalary: baseData?.salary || 100000,
    parentalIncome: baseData?.input?.familyIncome || 400000,
    interestType: 'compound',
    loanInsurance: 25000,
    surplusPrepayPct: 25,
    disbursements: generateEqualDisbursements(baseData?.recommended?.loan?.netDisbursed || 2025000, 4)
  });

  // Handlers
  const addTranche = useCallback(() => {
    setParams(prev => {
      const nextYear = prev.disbursements.length + 1;
      return {
        ...prev,
        courseDuration: nextYear,
        disbursements: [...prev.disbursements, { year: nextYear, amount: 0 }]
      };
    });
  }, []);

  const removeTranche = useCallback((idx) => {
    setParams(prev => {
      if (prev.disbursements.length <= 1) return prev;
      const filtered = prev.disbursements.filter((_, i) => i !== idx);
      const remapped = filtered.map((d, i) => ({ ...d, year: i + 1 }));
      return { ...prev, courseDuration: remapped.length, disbursements: remapped };
    });
  }, []);

  const redistribute = useCallback(() => {
    setParams(prev => ({
      ...prev,
      disbursements: generateEqualDisbursements(prev.totalLoanAmount, prev.disbursements.length)
    }));
  }, []);

  const updateTranche = useCallback((idx, val) => {
    setParams(prev => {
      const updated = [...prev.disbursements];
      updated[idx] = { ...updated[idx], amount: Number(val) || 0 };
      return { ...prev, disbursements: updated };
    });
  }, []);

  // Run Engine
  const result = useMemo(() => {
    try {
      return runDisbursementAnalysis(params);
    } catch (e) {
      console.error("Engine Error:", e);
      return null;
    }
  }, [params]);

  if (!result) {
    return <div className="p-10 text-red-500 text-center">Error in loan analysis engine</div>;
  }

  const { insights } = result;

  return (
    <div className="space-y-8 pb-20 font-sans max-w-[1480px] mx-auto">
      <VerdictBanner verdict={insights.verdict} />

      {/* Summary HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard label="Original Loan" value={result.totalDisbursed} sub={`Incl. ₹${params.loanInsurance.toLocaleString()} Insurance`} />
        <SummaryCard 
          label="Effective Principal" 
          value={result.effectivePrincipal} 
          sub={`+${formatCurrency(result.totalMoratoriumInterest)} Moratorium Interest`} 
          highlight 
        />
        <SummaryCard label="Monthly EMI" value={result.emi} sub={`${result.emiToSalaryRatio}% of Salary`} />
       
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN - Simulation */}
        <div className="lg:col-span-7 space-y-8">
          <StrategyCockpit 
            params={params}
            setParams={setParams}
            addTranche={addTranche}
            removeTranche={removeTranche}
            redistribute={redistribute}
            updateTranche={updateTranche}
            result={result}
          />

          <RealityCheck 
            items={insights.realityCheck}
            surplusDeficit={result.surplusDeficit}
            isDeficit={result.isDeficit}
            expectedSalary={params.expectedSalary}
            emi={result.emi}
          />

          <TrancheTable breakdown={result.disbursementBreakdown} />
        </div>

        {/* RIGHT COLUMN - Intelligence */}
        <div className="lg:col-span-5 space-y-6">
          <PrepaymentPowerUp result={result} />
          <CostWaterfall result={result} />

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-5 flex items-center gap-2">
              <Info size={17} className="text-slate-400" /> What’s Really Happening
            </h3>
            <p className="text-[13px] leading-relaxed text-slate-600">
              Interest accrues on each disbursement during your course and grace period. 
              This "<strong>Moratorium Interest</strong>" is added to your loan balance, 
              increasing the <strong>Effective Principal</strong>. You then repay EMIs on this higher amount.
            </p>
          </div>

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

/* ====================== SUB-COMPONENTS ====================== */

function VerdictBanner({ verdict }) {
  if (!verdict) return null;
  const isDanger = verdict.type === 'danger';
  const isWarning = verdict.type === 'warning';

  return (
    <div className={`p-8 rounded-[2.5rem] border-2 flex gap-6 items-center shadow-sm 
      ${isDanger ? 'bg-rose-50 border-rose-200' : isWarning ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-100'}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg 
        ${isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'} text-white`}>
        {isDanger || isWarning ? <AlertTriangle size={28} /> : <ShieldCheck size={28} />}
      </div>
      <div>
        <h3 className={`text-xl font-black uppercase italic 
          ${isDanger ? 'text-rose-900' : isWarning ? 'text-amber-900' : 'text-emerald-900'}`}>
          {verdict.headline}
        </h3>
        <div className="mt-4 text-[11px] font-bold text-slate-900 bg-white/70 w-fit px-4 py-1.5 rounded-xl border border-black/5">
          Strategy Architecture Mapped
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, highlight = false }) {
  return (
    <div className={`bg-white border rounded-[2rem] p-7 shadow-sm transition-all ${highlight ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-100 hover:border-slate-300'}`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="text-2xl font-black text-slate-900 tracking-tighter mt-1">{formatCurrency(value)}</div>
      <p className="text-xs font-medium text-slate-500 mt-2">{sub}</p>
    </div>
  );
}

function StrategyCockpit({ params, setParams, addTranche, removeTranche, redistribute, updateTranche, result }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-9 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-black text-slate-900 uppercase italic flex items-center gap-2">
          <RefreshCw className="text-slate-400" size={19} /> Strategy Cockpit
        </h3>
        <div className="flex gap-2 bg-slate-50 p-1 rounded-2xl">
          {['simple', 'compound'].map(t => (
            <button
              key={t}
              onClick={() => setParams(prev => ({ ...prev, interestType: t }))}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase transition-all ${params.interestType === t ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <SurgicalInput label="Bank Rate (%)" value={params.interestRate} onChange={v => setParams(p => ({ ...p, interestRate: v }))} />
        <SurgicalInput label="Family Income" value={params.parentalIncome} onChange={v => setParams(p => ({ ...p, parentalIncome: v }))} />
        <SurgicalInput label="Grace Period (Years)" value={params.gracePeriod} onChange={v => setParams(p => ({ ...p, gracePeriod: v }))} />
        <SurgicalInput label="Loan Insurance" value={params.loanInsurance} onChange={v => setParams(p => ({ ...p, loanInsurance: v }))} />

        <div className="col-span-2 bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black text-emerald-900 flex items-center gap-2">
              <PiggyBank size={14} /> Surplus Prepayment
            </label>
            <span className="font-black text-emerald-700">{params.surplusPrepayPct}%</span>
          </div>
          <input 
            type="range" min="0" max="50" step="5" 
            value={params.surplusPrepayPct} 
            onChange={e => setParams(p => ({ ...p, surplusPrepayPct: Number(e.target.value) }))}
            className="w-full accent-emerald-600"
          />
          <p className="text-xs text-emerald-700">Using ₹{result.monthlyPrepay.toLocaleString()}/mo from your surplus</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Disbursement Schedule</p>
        <div className="flex gap-3">
          <button onClick={redistribute} className="text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold">Redistribute Equally</button>
          <button onClick={addTranche} className="flex items-center gap-1 text-xs px-4 py-2 bg-emerald-100 hover:bg-emerald-200 rounded-2xl font-bold">
            <Plus size={14} /> Add Year
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {params.disbursements.map((d, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 group">
            <span className="font-black text-slate-400 w-12">Year {d.year}</span>
            <input 
              type="number" 
              value={d.amount} 
              onChange={(e) => updateTranche(i, e.target.value)}
              className="flex-1 bg-transparent font-black text-xl outline-none"
            />
            {params.disbursements.length > 1 && (
              <button onClick={() => removeTranche(i)} className="opacity-0 group-hover:opacity-100 text-rose-500">
                <Minus size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SurgicalInput({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{label}</label>
      <input 
        type="number" 
        value={value} 
        onChange={e => onChange(Number(e.target.value))}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-lg font-black focus:bg-white focus:border-slate-900 outline-none transition-all"
      />
    </div>
  );
}

function RealityCheck({ items, surplusDeficit, isDeficit, expectedSalary, emi }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
        <BarChart3 size={16} className="text-slate-400" /> Reality Check
      </h3>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-sm font-bold">{formatCurrency(expectedSalary)} salary</div>
        <span className="text-slate-300">−</span>
        <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 text-sm font-bold text-rose-600">{formatCurrency(emi)} EMI</div>
        <span className="text-slate-300">=</span>
        <div className={`${isDeficit ? 'bg-rose-600' : 'bg-emerald-500'} px-4 py-2 rounded-xl text-white text-sm font-bold`}>
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
        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
          <tr>
            <th className="px-8 py-4">Year</th>
            <th className="px-8 py-4 text-right">Interest Leak</th>
            <th className="px-8 py-4 text-right">Balloon Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {breakdown.map((row) => (
            <tr key={row.year}>
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

function PrepaymentPowerUp({ result }) {
  if (result.moneySaved <= 0) return null;
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-4 -right-4 p-6 opacity-20 rotate-12"><Zap size={120}/></div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Prepayment Power-Up</p>
        <div className="text-5xl font-black italic tracking-tighter">Save {formatCurrency(result.moneySaved)}</div>
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-sm font-bold leading-relaxed">
            By prepaying <span className="underline decoration-yellow-400 decoration-2">₹{result.monthlyPrepay.toLocaleString()}/mo</span>, 
            you close your debt <span className="text-yellow-300 font-black italic">{result.tenureSaved} years early.</span>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function CostWaterfall({ result }) {
  const { totalRepayment, percentages } = result;
  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp size={160}/></div>
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Net Outflow Breakdown</h4>
      <div className="text-5xl font-black tracking-tighter italic mb-10">{formatCurrency(totalRepayment)}</div>
      <div className="space-y-6">
        <VisualBar label="Disbursed Capital + Insurance" percent={percentages.disbursedPct} color="bg-white" />
        <VisualBar label="Moratorium Interest" percent={percentages.moratoriumPct} color="bg-rose-400" />
        <VisualBar label="Repayment Interest" percent={percentages.repaymentInterestPct} color="bg-amber-400" />
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

function InsightCard({ icon: Icon, iconBg, title, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm group">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 p-6 text-left hover:bg-slate-50 transition-all">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}><Icon size={18} /></div>
        <span className="font-black text-xs uppercase tracking-widest flex-1 text-slate-900">{title}</span>
        {open ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
      </button>
      {open && (
        <div className="p-6 pt-0 space-y-6 border-t border-slate-50">
          {items.map((item, i) => (
            <div key={i} className="space-y-3">
              <p className="text-xs font-black text-slate-900">{item.title}</p>
              <p className="text-[11px] text-slate-500 italic">"{item.means}"</p>
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
      <Lightbulb size={20} className="text-amber-500 shrink-0 mt-1" />
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500">Expert Conclusion</p>
        <p className="text-xs font-bold leading-relaxed italic">{conclusion.text}</p>
      </div>
    </div>
  );
}