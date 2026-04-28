
import React from 'react';
import { AlertTriangle, CheckCircle2, Crown } from 'lucide-react';

export default function DecisionHeader({ recommended, allResults, salary }) {
const emi = Number(recommended?.loan?.emi || 0);
  const safeSalary = Number(salary || 0);
  
  // Recalculate locally to be safe
  const emiRatio = safeSalary > 0 ? Math.round((emi / safeSalary) * 100) : 0;
  const remaining = safeSalary - emi;
  
  const isCaution = emiRatio > 40;
  const isDanger = emiRatio >= 100;
  

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <div className={`border-2 rounded-2xl p-5 flex items-start gap-4 ${isCaution ? 'bg-[#FFFBEB] border-[#FEF3C7]' : 'bg-[#F0FDF4] border-[#DCFCE7]'}`}>
        {isCaution ? <AlertTriangle className="text-[#F59E0B] shrink-0" size={28} /> : <CheckCircle2 className="text-[#10B981] shrink-0" size={28} />}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isCaution ? 'bg-[#F59E0B] text-white' : 'bg-[#10B981] text-white'}`}>
              {isCaution ? 'Caution' : 'Healthy'}
            </span>
            <h3 className={`font-bold ${isCaution ? 'text-[#92400E]' : 'text-[#065F46]'}`}>
              This loan is {isCaution ? 'manageable but financially tight' : 'financially healthy and sustainable'}
            </h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {emiRatio}% of salary goes to EMI. You retain ₹{remaining.toLocaleString('en-IN')}/month.
          </p>
        </div>
      </div>
      {/* ... Rest of Summary Box ... */}
    </div>
  );
}