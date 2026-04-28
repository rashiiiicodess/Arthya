import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

const FinancialRealityCheck = ({ recommended, salary, status }) => {
  const emi = Number(recommended?.loan?.emi || 0);
  const safeSalary = Number(salary || 0);
  const shortfall = safeSalary - emi;
  const ratio = safeSalary > 0 ? (emi / safeSalary).toFixed(2) : 0;

  const themes = {
    danger: { 
      bg: 'bg-[#FFF1F2]', border: 'border-rose-200', text: 'text-rose-900', 
      accent: 'bg-rose-500', icon: <AlertCircle className="text-rose-500" size={24} /> 
    },
    neutral: { 
      bg: 'bg-[#FFFBEB]', border: 'border-amber-200', text: 'text-amber-900', 
      accent: 'bg-amber-500', icon: <AlertTriangle className="text-amber-500" size={24} /> 
    },
    safe: { 
      bg: 'bg-[#F0FDF4]', border: 'border-emerald-200', text: 'text-emerald-900', 
      accent: 'bg-emerald-500', icon: <CheckCircle2 className="text-emerald-500" size={24} /> 
    }
  };

  const theme = themes[status] || themes.safe;

  return (
    <div className={`${theme.bg} border ${theme.border} rounded-[40px] p-8 font-sans shadow-sm`}>
      <div className="flex items-start gap-4 mb-8">
        <div className="mt-1">{theme.icon}</div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Financial Reality Check</p>
          <h3 className={`text-lg font-bold leading-tight ${theme.text}`}>
            {status === 'danger' 
              ? `At your current salary, this loan is not just risky — it is practically impossible to sustain. Your Monthly EMI is ${ratio}× your salary.` 
              : status === 'neutral' 
              ? "This loan is manageable but will consume a significant portion of your disposable income."
              : "This loan is well within your financial capacity and highly sustainable."}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatBox label="Expected Monthly Salary" value={safeSalary} />
        <StatBox label="Monthly EMI Obligation" value={-emi} isNegative />
        <StatBox 
          label={shortfall < 0 ? "Monthly Shortfall" : "Left After EMI Every Month"} 
          value={shortfall} 
          isCritical={shortfall < 0} 
        />
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">How your salary is split</p>
        <div className="h-5 w-full bg-white/60 rounded-full overflow-hidden flex p-1 shadow-inner">
           <div 
             className={`${theme.accent} h-full rounded-full transition-all duration-1000`} 
             style={{ width: `${Math.min((emi / (safeSalary || 1)) * 100, 100)}%` }} 
           />
        </div>
        <p className={`text-[11px] font-bold ${theme.text} px-1`}>
          ● EMI: {ratio}× salary (₹{emi.toLocaleString('en-IN')})
        </p>
      </div>

      {status === 'danger' && (
        <div className="mt-8 p-5 bg-white/80 rounded-3xl border border-rose-100 flex gap-4 items-center">
          <AlertCircle size={20} className="text-rose-500 shrink-0" />
          <p className="text-xs text-rose-900 font-medium leading-relaxed">
            <span className="font-bold">Do not proceed with this loan plan.</span> Your monthly obligations exceed your expected income by <span className="font-bold underline">₹{Math.abs(shortfall).toLocaleString('en-IN')}</span>. You would need to take on additional debt just to pay the EMIs — a cycle that leads to financial crisis.
          </p>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, isNegative, isCritical }) => (
  <div className="bg-white/70 backdrop-blur-sm p-6 rounded-[24px] border border-white shadow-sm">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-tight">{label}</p>
    <p className={`text-2xl font-black ${isCritical || isNegative ? 'text-rose-600' : 'text-slate-900'}`}>
      ₹{Math.abs(value).toLocaleString('en-IN')}
    </p>
    {isCritical && <p className="text-[10px] font-bold text-rose-500 mt-2 uppercase tracking-tighter italic">Shortfall — cannot proceed</p>}
  </div>
);

export default FinancialRealityCheck;