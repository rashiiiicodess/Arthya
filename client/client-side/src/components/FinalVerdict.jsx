import React from 'react';
import { Brain } from 'lucide-react';
export default function FinalVerdict({ recommended, salary }) {
  const emi = Number(recommended?.loan?.emi || 0);
  const safeSalary = Number(salary || 0);
  const emiRatio = safeSalary > 0 ? Math.round((emi / safeSalary) * 100) : 0;
  const endYear = new Date().getFullYear() + Number(recommended?.loan?.tenureYears || 10);

  return (
    <div className="bg-[#FFFBEB] border-2 border-[#FEF3C7] rounded-3xl p-8">
      {/* ... icon and title ... */}
      <p className="text-amber-800/80 text-sm leading-relaxed font-medium">
        You will pay ₹{emi.toLocaleString('en-IN')} every month until {endYear} — that's {emiRatio}% of your salary. 
        {/* ... remaining text ... */}
      </p>
    </div>
  );
}