import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

const FinancialRealityCheck = ({ recommended, salary, status }) => {
  const emi = Number(recommended?.loan?.emi || 0);
  const safeSalary = Number(salary || 0);
  const shortfall = safeSalary - emi;
  const ratio = safeSalary > 0 ? (emi / safeSalary).toFixed(2) : 0;

  const themes = {
    danger: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', accent: 'bg-rose-500', icon: <AlertCircle className="text-rose-500" /> },
    neutral: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', accent: 'bg-amber-500', icon: <AlertTriangle className="text-amber-500" /> },
    safe: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', accent: 'bg-emerald-500', icon: <CheckCircle2 className="text-emerald-500" /> }
  };

  // ✅ FALLBACK: If status is undefined or wrong, use 'safe'
  const theme = themes[status] || themes.safe;

  return (
    <div className={`${theme.bg} border ${theme.border} rounded-[32px] p-8 font-sans transition-colors duration-500`}>
      <div className="flex items-center gap-3 mb-6">
        {theme.icon}
        <h3 className={`font-bold ${theme.text}`}>
          {status === 'danger' ? "At your current salary, this loan is not just risky — it is practically impossible to sustain." : 
           status === 'neutral' ? "This loan is manageable but will require significant lifestyle changes." : 
           "This loan is well within your financial capacity."}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatBox label="Expected Salary" value={safeSalary} />
        <StatBox label="Monthly EMI" value={-emi} isNegative />
        <StatBox 
          label={shortfall < 0 ? "Monthly Shortfall" : "Left After EMI"} 
          value={shortfall} 
          isCritical={shortfall < 0} 
        />
      </div>

      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">How your salary is split</p>
      <div className="h-4 w-full bg-white/50 rounded-full overflow-hidden flex shadow-inner">
         <div className={`${theme.accent} h-full transition-all duration-1000`} style={{ width: `${Math.min((emi / (safeSalary || 1)) * 100, 100)}%` }} />
      </div>
      
      <div className="flex justify-between items-center mt-3 px-1">
        <p className={`text-xs font-bold ${theme.text}`}>
          EMI is {ratio}× your salary (₹{emi.toLocaleString('en-IN')})
        </p>
        {status === 'danger' && <span className="text-[10px] font-black text-rose-600 uppercase animate-pulse">Financial Crisis Warning</span>}
      </div>

      {status === 'danger' && (
        <div className="mt-6 p-4 bg-white/60 rounded-2xl border border-rose-100 flex gap-3 shadow-sm">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <p className="text-[11px] text-rose-900 font-medium leading-relaxed">
            Do not proceed with this loan plan. Your monthly obligations exceed your expected income by ₹{Math.abs(shortfall).toLocaleString('en-IN')}. 
            Taking this on leads to a long-term debt trap.
          </p>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, isNegative, isCritical }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{label}</p>
    <p className={`text-xl font-black ${isCritical || isNegative ? 'text-rose-600' : 'text-slate-900'}`}>
      ₹{Math.abs(value).toLocaleString('en-IN')}
    </p>
    {isCritical && <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-tighter">Shortfall — cannot proceed</p>}
  </div>
);

export default FinancialRealityCheck;