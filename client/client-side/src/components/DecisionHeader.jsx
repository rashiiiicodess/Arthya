import React from 'react';
import { motion } from 'framer-motion';
import { Crown, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function DecisionHeader({ recommended, salary }) {
  const bankName = recommended?.bankName || "State Bank of India (SBI)";
  const emi = Number(recommended?.loan?.emi || 44009);
  const safeSalary = Number(salary || 100000);
  const emiRatio = safeSalary > 0 ? Math.round((emi / safeSalary) * 100) : 44;
  const shortfall = safeSalary - emi;
  const confidence = recommended?.confidenceScore || 80;

  const isHighRisk = emiRatio >= 40;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden"
    >
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

        {/* Honest Risk Message */}
        <div className="mb-8">
          {isHighRisk ? (
            <div className="flex gap-3 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
              <AlertTriangle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-700">This is an aggressive loan structure</p>
                <p className="text-sm text-amber-600 mt-1">
                  Your EMI takes {emiRatio}% of your monthly salary. This leaves limited margin for error 
                  in the first few years and depends heavily on future salary growth.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={18} />
              <p className="font-medium">This loan is manageable with disciplined financial planning</p>
            </div>
          )}
        </div>

        {/* Best Decision Card */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#DDD6FE] shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Best Option For You</p>
              <h3 className="text-2xl font-black text-[#6D28D9] tracking-tight mt-1">{bankName}</h3>
            </div>

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
                <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-[#6D28D9]">
                  {confidence}%
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase leading-tight">AI Confidence Score</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-50 p-5 rounded-2xl text-center">
              <p className="text-2xl font-bold">₹{emi.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-500 mt-1">Monthly EMI</p>
            </div>
            <div className={`p-5 rounded-2xl text-center ${isHighRisk ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              <p className={`text-2xl font-bold ${isHighRisk ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isHighRisk ? 'Tight' : '+'} ₹{Math.abs(shortfall).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-500 mt-1">Monthly Surplus (Before Expenses)</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}