import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Wallet, AlertCircle, CheckCircle2, 
  ArrowRight, ShieldCheck, PieChart, Info, 
  Calendar, Landmark, Coins, Scale
} from 'lucide-react';

export default function InvestView({ data }) {
  const winner = data?.recommended;
  const guidance = winner?.investmentGuidance;
  const overview = winner?.overview;
  
  const salary = data?.salary || 0;
  const emi = overview?.emi || 0;
  const remaining = overview?.monthlyShortfall || (salary - emi);
  const score = overview?.affordabilityScore || 0;
  
  const isNegative = remaining < 0;

  return (
    <div className="space-y-8 pb-20 font-sans max-w-5xl mx-auto">
      
      {/* --- 1. THE ADVISOR HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl text-violet-600 shadow-sm border border-violet-50">
            <TrendingUp size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight italic">Arthya Wealth Engine</h2>
            <p className="text-sm text-slate-500 font-medium mt-1 uppercase tracking-wider text-[10px]">Strategic Capital Allocation</p>
          </div>
        </div>

        {/* Dynamic Affordability Meter */}
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
           <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Affordability Score</div>
              <div className="text-2xl font-black text-slate-900">{score}<span className="text-slate-300 text-sm">/100</span></div>
           </div>
           <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-xs ${
             score > 70 ? 'border-emerald-500 text-emerald-600' : score > 40 ? 'border-amber-400 text-amber-600' : 'border-rose-500 text-rose-600'
           }`}>
             {score}%
           </div>
        </div>
      </div>

      {/* --- 2. CASH FLOW DECONSTRUCTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* The Math Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Scale size={120} />
          </div>

          <div className="flex items-center gap-2 mb-8">
            <PieChart size={18} className="text-violet-500" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Monthly Liquidity Analysis</h4>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-end border-b border-slate-50 pb-4">
               <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Gross Monthly Income</span>
               <span className="text-xl font-black text-slate-900 font-mono tracking-tighter">₹{salary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end border-b border-slate-50 pb-4">
               <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">EMI Obligation</span>
               <span className="text-xl font-black text-rose-500 font-mono tracking-tighter">- ₹{Math.round(emi).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end pt-2">
               <div>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">Net Surplus (Investable)</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Available for SIPs / Prepayments</p>
               </div>
               <span className={`text-3xl font-black font-mono tracking-tighter ${isNegative ? 'text-rose-600' : 'text-emerald-500'}`}>
                  ₹{Math.round(remaining).toLocaleString()}
               </span>
            </div>
          </div>
        </div>

        {/* Milestone Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl">
           <div className="space-y-4">
              <Calendar className="text-violet-400" size={32} />
              <h5 className="font-black text-lg leading-tight uppercase italic">The Debt-Free Horizon</h5>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Based on your {overview?.years}-year tenure, your financial "rebirth" occurs in 
                <span className="text-white font-bold px-1">{overview?.loanFreeYear}</span>. 
                Until then, every ₹1 you save is worth {overview?.interestMultiplier}x in future value.
              </p>
           </div>
           <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Interest Multiplier</div>
              <div className="text-4xl font-black text-center text-violet-400 tracking-tighter">{overview?.interestMultiplier}x</div>
           </div>
        </div>
      </div>

      {/* --- 3. THE STRATEGY MATRIX --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Intelligence Strategy */}
        <div className={`rounded-[2rem] p-8 border-2 transition-all ${isNegative ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-200 shadow-md shadow-emerald-100/50'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
               {isNegative ? <AlertCircle className="text-rose-500" /> : <Coins className="text-emerald-500" />}
            </div>
            <div>
              <h5 className="font-black text-slate-900 uppercase text-xs tracking-tight">{guidance?.title || "Tactical Move"}</h5>
              <p className={`text-[9px] font-black uppercase ${isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>{guidance?.status}</p>
            </div>
          </div>
          <h4 className="text-sm font-black text-slate-900 leading-snug mb-3">{guidance?.headline}</h4>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {guidance?.detailedAdvice}
          </p>
        </div>

        {/* Prepayment vs. Investment Logic */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <h5 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Arthya Recommendation</h5>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-violet-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                <span className="text-slate-900 font-bold tracking-tight uppercase text-[10px]">Priority 1:</span> 
                {isNegative ? "Debt Restructuring. Your EMI is unsustainable for your current income." : `SIP of ₹${Math.round(remaining * 0.2).toLocaleString()} in Index Funds.`}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-violet-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                <span className="text-slate-900 font-bold tracking-tight uppercase text-[10px]">Priority 2:</span> 
                Aggressive prepayment to reduce the <span className="text-violet-600 font-bold">{overview?.interestMultiplier}x</span> loss.
              </p>
            </div>
          </div>

          
        </div>

      </div>

    </div>
  );
}