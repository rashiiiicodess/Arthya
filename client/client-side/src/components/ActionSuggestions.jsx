import React from 'react';
import { Lightbulb, Shield, TrendingDown, PieChart } from 'lucide-react';

const ActionSuggestions = ({ recommended, salary }) => {
  const emi = Number(recommended?.loan?.emi || 44009);
  const safeSalary = Number(salary || 100000);
  const postEmi = safeSalary - emi;
  const estimatedExpenses = 35000;                    // Realistic for fresh grad in Tier-1 (shared accommodation)
  const realisticSurplus = Math.max(postEmi - estimatedExpenses, 0); // ≈ ₹18k - ₹20k

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
          <Lightbulb size={20} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Practical Strategy Recommendations</h3>
      </div>

      <div className="space-y-5">
        <div className="p-6 bg-white border border-slate-100 rounded-3xl">
          <div className="flex gap-4">
            <Shield className="text-emerald-600 mt-1" size={28} />
            <div className="flex-1">
              <h4 className="font-semibold">1. Build Emergency Fund (Highest Priority)</h4>
              <p className="text-2xl font-bold text-emerald-600 mt-3">₹8,000 – ₹10,000 / month</p>
              <p className="text-xs text-slate-500 mt-2">First 6–12 months: Focus on building 3–6 months of expenses.</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-3xl">
          <div className="flex gap-4">
            <TrendingDown className="text-rose-600 mt-1" size={28} />
            <div className="flex-1">
              <h4 className="font-semibold">2. Loan Prepayment</h4>
              <p className="text-2xl font-bold mt-3">₹4,000 – ₹7,000 / month</p>
              <p className="text-xs text-slate-500 mt-2">
                Start after emergency fund is stable. Early prepayment saves the most interest.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-3xl">
          <div className="flex gap-4">
            <PieChart className="text-blue-600 mt-1" size={28} />
            <div className="flex-1">
              <h4 className="font-semibold">3. SIP / Investments</h4>
              <p className="text-2xl font-bold mt-3">₹2,000 – ₹4,000 / month</p>
              <p className="text-xs text-slate-500 mt-2">
                Only with remaining surplus. Do not stretch investments in the first 1–2 years.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
        <p className="text-amber-700 text-sm">
          With your current salary, after EMI and living expenses, you’ll likely have around 
          <span className="font-bold"> ₹{realisticSurplus.toLocaleString('en-IN')} </span> 
          as true monthly surplus. This is a <strong>limited but manageable buffer</strong>. 
          Prioritize emergency savings first.
        </p>
      </div>
    </div>
  );
};

export default ActionSuggestions;