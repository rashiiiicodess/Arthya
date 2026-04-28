import React from 'react';
import { ArrowRight, Zap, Info, Clock, Wallet, AlertCircle } from 'lucide-react';

const ActionSuggestions = ({ recommended, status, salary }) => {
  // 1. DEFENSIVE DATA EXTRACTION
  const emi = Number(recommended?.loan?.emi || 0);
  const safeSalary = Number(salary || 0);
  const moratoriumInterest = Number(recommended?.disbursement?.moratoriumInterest || 0);

  // 2. DYNAMIC RECOVERY STEPS (Matches your screenshot's level of insight)
  const dangerSuggestions = [
    {
      icon: <Wallet className="text-rose-500" />,
      title: "Reduce your loan amount",
      impact: "High Impact",
      desc: `Your current EMI of ₹${Math.round(emi).toLocaleString('en-IN')} exceeds what your ₹${safeSalary.toLocaleString('en-IN')} salary can support. Borrowing less directly lowers your monthly obligation.`
    },
    {
      icon: <Clock className="text-violet-500" />,
      title: "Extend tenure beyond 10 years",
      impact: "High Impact",
      desc: "A longer repayment period spreads the same loan over more months, making each EMI smaller and potentially bringing it within your salary range."
    },
    {
      icon: <Zap className="text-amber-500" />,
      title: "Pay moratorium interest monthly",
      impact: "Critical",
      desc: `Your loan grows by ₹${moratoriumInterest.toLocaleString('en-IN')} during study. Paying interest monthly prevents this growth entirely.`
    }
  ];

  // 3. Fallback to backend insights if not in danger
  const backendInsights = recommended?.insights?.suggestions || [];
  const displayItems = status === 'danger' ? dangerSuggestions : backendInsights;

  // 4. Guard against empty state
  if (displayItems.length === 0 && status !== 'danger') {
    return null; 
  }

  return (
    <div className={`rounded-[40px] p-8 ${status === 'danger' ? 'bg-[#FFF1F2]/50 border border-rose-100' : 'bg-slate-50 border border-slate-100'}`}>
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-2xl ${status === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-violet-100 text-violet-600'}`}>
          {status === 'danger' ? <AlertCircle size={24} /> : <Zap size={24} />}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">What you can do next</p>
          <h3 className={`text-lg font-bold ${status === 'danger' ? 'text-rose-900' : 'text-slate-900'}`}>
            {status === 'danger' 
              ? "This plan is not financially feasible. Your monthly obligations would exceed your income." 
              : "Optimize your loan path for long-term wealth."}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayItems.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-6 rounded-[28px] flex items-center justify-between group hover:border-violet-300 transition-all cursor-pointer shadow-sm">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-violet-50 transition-colors">
                {item.icon || <Info className="text-slate-400" size={20} />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <span className="text-[9px] font-black bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    {item.impact || "Actionable"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                  {item.desc || item.description}
                </p>
              </div>
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionSuggestions;