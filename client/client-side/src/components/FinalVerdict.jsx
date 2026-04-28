import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ShieldCheck, Zap, Target, AlertCircle, TrendingUp } from 'lucide-react';

const FinalVerdict = ({ recommended, salary }) => {
  const emi = Number(recommended?.loan?.emi || 0);
  const safeSalary = Number(salary || 0);
  const ratio = safeSalary > 0 ? Math.round((emi / safeSalary) * 100) : 0;
  
  // 🚀 CONTENT CLEANING & PARTITIONING
  const aiText = recommended?.aiExplanation || "";
  
  // Splits by '###', then cleans up extra stars and whitespace
  const blocks = aiText.split('###').filter(s => s.trim().length > 0).map(block => {
    const lines = block.trim().split('\n');
    return {
      title: lines[0].replace(/[*#]/g, '').trim(),
      content: lines.slice(1).join(' ').replace(/[*#]/g, '').trim()
    };
  });

  return (
    <div className="py-12 space-y-12 font-sans">
      
      {/* 1. HEADER: MATCHES YOUR 'FINANCIAL REALITY CHECK' STYLE */}
      <div className="flex items-center gap-4 px-2">
        <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl shadow-sm">
          <Brain className="text-[#10B981]" size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">AI Logic Engine</p>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight text-emerald-950">Executive Verdict</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 2. LEFT: CLEAN PARTITIONED BLOCKS (Easy to Read) */}
        <div className="lg:col-span-8 space-y-6">
          {blocks.map((block, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:border-emerald-100 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                 <h4 className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em]">{block.title}</h4>
              </div>
              
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {block.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 3. RIGHT: THE SNAPSHOT (Matches your stat boxes) */}
        <div className="lg:col-span-4 space-y-6 sticky top-8">
          
          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[3rem] p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-10">
               <ShieldCheck className="text-[#10B981]" size={18} />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Conclusion</span>
            </div>
            
            <div className="space-y-10">
               <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-2">EMI Obligation</p>
                 <p className="text-4xl font-black text-slate-900">₹{Math.round(emi).toLocaleString('en-IN')}</p>
                 <div className="mt-4 space-y-2">
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${ratio}%` }}
                          className="h-full bg-[#10B981] rounded-full" 
                        />
                    </div>
                    <p className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest">{ratio}% of salary</p>
                 </div>
               </div>

               <div className="pt-8 border-t border-[#DCFCE7]">
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Verdict Status</p>
                 <div className="bg-white px-5 py-4 rounded-2xl border border-[#DCFCE7] flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Recommendation</span>
                    <span className="text-xs font-black text-[#10B981] uppercase tracking-widest">
                        {ratio > 40 ? 'Caution' : 'Safe'}
                    </span>
                 </div>
               </div>

               <button className="w-full py-5 bg-[#10B981] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Generate PDF Summary
               </button>
            </div>
          </div>

          {/* Quick Insight Callout */}
          <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center gap-4 group">
             <div className="p-3 bg-[#F0FDF4] rounded-full text-[#10B981]">
                <Zap size={18} fill="currentColor" />
             </div>
             <p className="text-[11px] font-bold text-slate-500 leading-tight">
                This loan is {ratio < 20 ? 'ideally' : 'moderately'} optimized for your ₹{safeSalary.toLocaleString()} salary profile.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinalVerdict;  