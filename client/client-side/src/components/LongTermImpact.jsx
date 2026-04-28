import React from 'react';
import { Target, Clock, ShieldCheck, BarChart3 } from 'lucide-react';


export default function LongTermImpact({ recommended, salary }) {
  const currentYear = new Date().getFullYear();
  
  // 1. NORMALIZE DATA (Match the keys we found in your console log)
  const emi = Number(recommended?.loan?.emi || recommended?.emi || 0);
  const safeSalary = Number(salary || 0);
  const tenure = Number(recommended?.loan?.maxTenureYears || recommended?.loan?.tenureYears || 10);
  
  // 2. CALCULATE RATIO SAFELY
  const emiRatio = safeSalary > 0 ? Math.round((emi / safeSalary) * 100) : 0;
  const endYear = currentYear + tenure;

  return (
    <div className="space-y-4 font-sans">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Long-term Impact</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <ImpactCard 
          icon={<BarChart3 />} 
          label="Loan vs Your Income" 
          /* ✅ FIXED: Using the calculated emiRatio */
          value={emiRatio > 0 ? `${emiRatio}% of salary` : "Calculating..."}
          desc="Your loan repayment will consume a noticeable share of your income each month."
        />

        <ImpactCard 
          icon={<Target />} 
          label="Affordability Score" 
          value="64 / 100"
          desc="This score reflects how manageable this loan is based on your income profile."
          isGood
        />

        <ImpactCard 
          icon={<Clock />} 
          label="Financial Recovery Outlook" 
          value={`Loan-free by ${endYear}`}
          desc="Expect pressure in early years. As salary grows, the burden will naturally ease."
        />

        <ImpactCard 
          icon={<ShieldCheck />} 
          label="Is This Loan Worth It?" 
          value="Manageable but Disciplined"
          desc="Your loan is within healthy limits, but requires strict budgeting in years 1-3."
        />
      </div>
    </div>
  );
}



const ImpactCard = ({ icon, label, value, desc, isGood }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{icon}</div>
      <p className="font-bold text-slate-800 text-sm">{label}</p>
    </div>
    <p className={`text-xl font-bold mb-2 ${isGood ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</p>
    <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);