import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Home, HeartPulse, ArrowRight } from 'lucide-react';

const LifestyleBuffer = ({ salary, emi }) => {
  const safeSalary = Number(salary || 0);
  const safeEmi = Number(emi || 0);
  const leftAfterEMI = safeSalary - safeEmi;
  
  // Arthya Financial Logic
  const estimatedSurvival = 6500; 
  const inflationBuffer = leftAfterEMI - estimatedSurvival;
  
  // Calculate percentages for the bar
  const survivalWidth = (estimatedSurvival / safeSalary) * 100;
  const bufferWidth = (Math.max(inflationBuffer, 0) / safeSalary) * 100;

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
      {/* Decorative Brand Flare */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#6D28D9]/5 rounded-full blur-3xl -mr-16 -mt-16" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#F5F3FF] border border-[#DDD6FE] rounded-2xl shadow-sm">
            <ShoppingBag className="text-[#6D28D9]" size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#6D28D9] uppercase tracking-[0.2em] mb-1">Stability Analysis</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Lifestyle Buffer</h3>
          </div>
        </div>
        <div className="px-4 py-2 bg-[#F0FDF4] rounded-full border border-[#DCFCE7]">
            <p className="text-[10px] font-black text-[#10B981] uppercase tracking-widest">
                Post-EMI Surplus: ₹{leftAfterEMI.toLocaleString()}
            </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 🚀 STROKED PROGRESS BAR SYSTEM */}
        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-1">
            <span className="text-slate-400">Monthly Cashflow Mapping</span>
            <span className="text-[#6D28D9]">Breathing Room: {Math.round(bufferWidth)}%</span>
          </div>
          
          <div className="h-6 w-full bg-slate-50 rounded-full p-1 border-2 border-[#6D28D9]/10 flex items-center shadow-inner">
            {/* Survival Zone (Stroked Purple Style) */}
            <div 
              className="h-full bg-[#6D28D9] rounded-l-full flex items-center justify-center border-r-2 border-white/20" 
              style={{ width: `${survivalWidth}%` }}
            >
               <span className="text-[8px] font-black text-white uppercase tracking-tighter opacity-80">Survival</span>
            </div>
            
            {/* Buffer Zone (Emerald Growth Style) */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${bufferWidth}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-[#10B981] rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center"
            >
               <span className="text-[8px] font-black text-white uppercase tracking-tighter">Growth</span>
            </motion.div>
          </div>
        </div>

        {/* INSIGHT CARDS WITH BRAND STROKES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-[2rem] bg-white border-2 border-[#6D28D9]/5 hover:border-[#6D28D9]/20 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#F5F3FF] rounded-lg group-hover:bg-[#6D28D9] group-hover:text-white transition-colors text-[#6D28D9]">
                <Home size={16} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rent Threshold</p>
            </div>
            <p className="text-xl font-black text-slate-900">Max ₹4,500</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">To maintain a stable recovery path.</p>
          </div>

          <div className="p-6 rounded-[2rem] bg-white border-2 border-[#10B981]/5 hover:border-[#10B981]/20 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#F0FDF4] rounded-lg group-hover:bg-[#10B981] group-hover:text-white transition-colors text-[#10B981]">
                <HeartPulse size={16} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Safety Net</p>
            </div>
            <p className="text-xl font-black text-slate-900">₹2,000 / mo</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Mandatory emergency liquid fund.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4 p-6 bg-slate-900 rounded-[2rem] text-white">
        <div className="w-12 h-12 rounded-full border-2 border-[#6D28D9] flex items-center justify-center shrink-0">
          <span className="text-xs font-black text-[#6D28D9]">9/10</span>
        </div>
        <p className="text-xs font-medium leading-relaxed opacity-90">
          Your debt-to-income structure is <span className="text-[#10B981] font-bold">highly efficient</span>. 
          By prioritizing the "Growth Zone" for 24 months, you will reach financial freedom 3 years earlier.
        </p>
      </div>
    </div>
  );
};

export default LifestyleBuffer;