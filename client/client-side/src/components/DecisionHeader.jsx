import React from 'react';
import { motion } from 'framer-motion';
import { Crown, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function DecisionHeader({ recommended, salary }) {
  const bankName = recommended?.bankName || "Selected Bank";
  const emi = Number(recommended?.loan?.emi || 0);
  const safeSalary = Number(salary || 0);
  const shortfall = safeSalary - emi;
  const confidence = recommended?.confidenceScore || 85; // Fallback to 85 if missing

  const isDanger = shortfall < 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden"
    >
      {/* Background Decorative Icon */}
      <Crown className="absolute -top-4 -right-4 text-[#6D28D9]/5 w-32 h-32 rotate-12" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 bg-[#6D28D9] rounded-lg">
            <Crown size={14} className="text-white" />
          </div>
          <p className="text-[10px] font-black text-[#6D28D9] uppercase tracking-[0.2em]">
            Your Financial Decision Summary
          </p>
        </div>

        {/* 🚀 QUICK ALERT TAGS */}
        <div className="space-y-2 mb-8">
          {isDanger ? (
            <>
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle size={14} />
                <p className="text-[11px] font-bold">Your loan obligations exceed your income — this plan cannot work as-is</p>
              </div>
              <div className="flex items-center gap-2 text-rose-500">
                <AlertTriangle size={14} />
                <p className="text-[11px] font-medium opacity-80">You would face a monthly shortfall, making it impossible to pay EMIs</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={14} />
              <p className="text-[11px] font-bold">This loan structure is sustainable for your current salary profile</p>
            </div>
          )}
        </div>

        {/* 🚀 THE BEST DECISION CARD */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#DDD6FE] shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Best Decision For You</p>
                <h3 className="text-2xl font-black text-[#6D28D9] tracking-tight">{bankName}</h3>
              </div>
              
              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2">
                {['Lowest total repayment cost', 'No prepayment penalty', 'Flexible options'].map((tag, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-[#F0FDF4] border border-[#DCFCE7] rounded-full">
                    <CheckCircle2 size={10} className="text-[#10B981]" />
                    <span className="text-[9px] font-bold text-[#065F46] whitespace-nowrap">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Dial */}
            <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
               <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                      strokeDasharray={175.9}
                      strokeDashoffset={175.9 - (175.9 * confidence) / 100}
                      className="text-[#6D28D9]" 
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-[#6D28D9]">
                    {confidence}%
                  </span>
               </div>
               <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight">AI Confidence<br/>Score</p>
            </div>
          </div>

          {/* EMI & Shortfall Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <p className="text-xl font-black text-slate-900">₹{emi.toLocaleString('en-IN')}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Monthly EMI</p>
            </div>
            <div className={`${isDanger ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'} p-4 rounded-xl border text-center`}>
              <p className={`text-xl font-black ${isDanger ? 'text-rose-600' : 'text-emerald-600'}`}>
                {isDanger ? '-' : '+'}₹{Math.abs(shortfall).toLocaleString('en-IN')}
              </p>
              <p className={`text-[9px] font-bold ${isDanger ? 'text-rose-400' : 'text-emerald-400'} uppercase mt-1`}>
                {isDanger ? 'Monthly Shortfall' : 'Monthly Surplus'}
              </p>
            </div>
          </div>
        </div>

        <button className="w-full mt-6 py-4 bg-[#6D28D9] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#5B21B6] transition-all">
          View Full Analysis <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}