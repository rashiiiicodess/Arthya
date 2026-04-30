import React from 'react';
import { Target, Clock, ShieldCheck, BarChart3, AlertTriangle } from 'lucide-react';

export default function LongTermImpact({ recommended, salary }) {
  // Safely extract data
  const emi = Number(recommended?.loan?.emi || recommended?.emi || 0);
  const safeSalary = Number(salary || 100000);
  const tenureYears = Number(
    recommended?.loan?.maxTenureYears || 
    recommended?.loan?.tenureYears || 
    recommended?.loan?.years || 13
  );

  const emiRatio = safeSalary > 0 ? Math.round((emi / safeSalary) * 100) : 0;
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + tenureYears;

  // Dynamic Risk Assessment
  let affordabilityScore = 65;
  let riskLevel = "Moderate";
  let riskColor = "text-emerald-600";
  let outlookDesc = "As your salary grows, the burden will naturally ease.";
  let worthItTitle = "Manageable with Discipline";
  let worthItDesc = "Your loan is within acceptable limits, but requires careful budgeting.";

  if (emiRatio >= 45) {
    affordabilityScore = 32;
    riskLevel = "Very High Risk";
    riskColor = "text-rose-600";
    outlookDesc = "Significant pressure expected in the first 5–7 years. Rapid salary growth and prepayments are critical.";
    worthItTitle = "High-Risk Choice";
    worthItDesc = "This loan is aggressive for your current income. Success depends heavily on career progression and strict financial discipline.";
  } 
  else if (emiRatio >= 35) {
    affordabilityScore = 38;
    riskLevel = "High Risk";
    riskColor = "text-amber-600";
    outlookDesc = "Expect pressure in early years. Strong salary hikes and prepayments will help reduce stress significantly.";
    worthItTitle = "High-Risk but Potentially Viable";
    worthItDesc = "Requires strict budgeting in the first 3–4 years and proactive prepayment strategy.";
  } 
  else if (emiRatio >= 25) {
    affordabilityScore = 55;
    riskLevel = "Moderate Risk";
    riskColor = "text-amber-600";
    outlookDesc = "Manageable with room for savings and emergencies if you maintain discipline.";
  }

  return (
    <div className="space-y-4 font-sans">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Long-term Impact</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <ImpactCard 
          icon={<BarChart3 />} 
          label="Loan vs Your Income" 
          value={`${emiRatio}% of salary`}
          desc={`Your EMI consumes ${emiRatio}% of your monthly income. ${emiRatio >= 40 ? "This is considered aggressive for a fresher." : "This is on the higher side."}`}
        />

        <ImpactCard 
          icon={<Target />} 
          label="Affordability Score" 
          value={`${affordabilityScore} / 100`}
          desc={`Risk Level: ${riskLevel}. ${emiRatio >= 40 ? "Limited buffer for unexpected expenses." : "Moderate buffer depending on lifestyle."}`}
          isGood={affordabilityScore >= 50}
        />

        <ImpactCard 
          icon={<Clock />} 
          label="Financial Recovery Outlook" 
          value={`Loan-free by ${endYear}`}
          desc={outlookDesc}
        />

        <ImpactCard 
          icon={emiRatio >= 40 ? <AlertTriangle /> : <ShieldCheck />} 
          label="Is This Loan Worth It?" 
          value={worthItTitle}
          desc={worthItDesc}
          isGood={emiRatio < 35}
        />
      </div>
    </div>
  );
}

// Reusable ImpactCard Component
const ImpactCard = ({ icon, label, value, desc, isGood = false }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{icon}</div>
      <p className="font-bold text-slate-800 text-sm">{label}</p>
    </div>
    
    <p className={`text-xl font-bold mb-2 ${isGood ? 'text-emerald-600' : 'text-slate-900'}`}>
      {value}
    </p>
    
    <p className="text-xs text-slate-500 leading-relaxed font-medium">
      {desc}
    </p>
  </div>
);