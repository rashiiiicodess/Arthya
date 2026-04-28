import React from 'react';
import { Brain, Quote } from 'lucide-react';

const FinalVerdict = ({ recommended, salary }) => {
  const aiText = recommended?.aiExplanation || "";
  const emi = Number(recommended?.loan?.emi || 0);
  const ratio = salary > 0 ? Math.round((emi / salary) * 100) : 0;

  return (
    <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -ml-32 -mb-32" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-violet-500/20 rounded-xl">
            <Brain className="text-violet-400" size={24} />
          </div>
          <h3 className="text-xl font-black tracking-tight">AI Final Verdict</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="relative">
              <Quote className="absolute -top-4 -left-6 text-slate-700" size={40} />
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium italic">
                {aiText}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 self-start">
            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4">Summary Conclusion</p>
            <div className="space-y-6">
               <div>
                 <p className="text-xs text-slate-400 mb-1 font-medium">Monthly Commitment</p>
                 <p className="text-2xl font-black text-white">₹{Math.round(emi).toLocaleString('en-IN')}</p>
                 <p className="text-[11px] text-slate-500 font-bold mt-1">~{ratio}% of your income</p>
               </div>
               
               <div className="pt-6 border-t border-white/5">
                 <p className="text-xs text-slate-400 mb-2 font-medium">Recommendation Status</p>
                 <div className={`inline-flex px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${ratio > 50 ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {ratio > 100 ? 'Rejected' : ratio > 40 ? 'Proceed with Caution' : 'Highly Recommended'}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalVerdict;